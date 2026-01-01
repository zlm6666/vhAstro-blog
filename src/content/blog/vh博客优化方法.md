---
title: vhAstro主题博客优化方案
categories: Code
tags:
  - astro
  - 主题
  - vhAstro
  - Github
  - 博客
id: vhastro-blog-youhua
date: 2025-12-31 19:50:39
cover: "http://img.magicalapp.cn/api/image/show/80c06e41cb17e244e786487b31f35001"
recommend: true
---
## 前言&目录

之前我教过大家如何搭建[**vhAstro-Theme**博客](https://blog.xiaow.qzz.io/article/astro-theme-blog)，以及给这个博客配置waline评论区和waline邮件通知（*具体可以看我历史文章*），那现在我就来教大家，如何优化自己的博客，分为以下两个方面

<a href="#圈子功能api化" target="_self">1.**圈子**功能api化</a>

<a href="#动态功能api化" target="_self">2.**动态**功能api化</a>

> 至于友链功能为什么不弄。。。因为感觉没必要

## 圈子功能api化

当我们做了外链之后，有时会需要跟朋友博客互换rss订阅地址，达到互相可以在“对面的博客看到自己的帖子”这种效果，

![圈子功能预览](http://img.magicalapp.cn/api/image/show/950518f98fc73f00d36a6ced3970fc14)

当然如果你不嫌麻烦的话，可以手动在`/src/page_data/Friends.ts`这个目录下按照里面的格式手动添加（~~应该没人会这样吧~~）

那既然我们之前都白嫖了**netlify服务**，再白嫖一次也无伤大雅\~（*就算之前没白嫖也现在也可以白嫖*）

### 正式教程

我们只需要再创建一个GitHub仓库（也可以用之前有的），然后在netlify里新建项目，选择从这个仓库新建。

然后在这个仓库里新建目录文件`netlify/functions/rss.js`，在`rss.js`文件中填入以下代码

```js
const Parser = require('rss-parser');

// 创建 RSS 解析器（保持原配置）
const parser = new Parser({
  timeout: 10000,
  headers: { 'User-Agent': 'RSS-Aggregator-API/1.0' }
});

// 添加rss时，记得不要缺了逗号
const DEFAULT_FEEDS = [
  'https://blog.xiaow.qzz.io/rss.xml',
  // 可继续添加更多 RSS 源
];

exports.handler = async function(event, context) {
  // 处理 CORS（保持原逻辑）
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, OPTIONS'
      },
      body: JSON.stringify({})
    };
  }

  try {
    // 解析参数（保留但不影响最终取前20条）
    const params = event.queryStringParameters || {};
    const feedsParam = params.feeds;
    const limit = parseInt(params.limit) || 20; // 不再使用
    const offset = parseInt(params.offset) || 0; // 不再使用
    
    // 确定 RSS 源（保持原逻辑）
    let rssUrls = DEFAULT_FEEDS;
    if (feedsParam) rssUrls = feedsParam.split(',').map(url => url.trim()).filter(url => url);
    
    // 并行抓取 RSS 源（返回完整feed对象：含title和items）
    const fetchPromises = rssUrls.map(url => 
      parser.parseURL(url).catch(err => {
        console.error(`抓取失败 ${url}:`, err.message);
        return { items: [], title: '抓取失败的源' }; // 失败时返回带title的空对象
      })
    );
    const feeds = await Promise.all(fetchPromises); // 变量名改为feeds（更准确）
    
    let allArticles = [];
    feeds.forEach(feed => {
      if (feed.items?.length > 0) {
        const sourceTitle = feed.title || '未知来源'; // 来源feed的标题（默认“未知来源”）
        const itemsWithSource = feed.items.map(item => ({
          ...item,
          sourceFeedTitle: sourceTitle
        }));
        allArticles.push(...itemsWithSource);
      }
    });
    
    // 去重、排序（保持原逻辑）
    const uniqueArticles = removeDuplicates(allArticles);
    const sortedArticles = sortArticlesByDate(uniqueArticles); // 最新在前
    
    const pagedArticles = sortedArticles.slice(0, 20);
    
    // 格式化文章（📌 作者逻辑调整：优先取来源feed的title）
    const formattedArticles = pagedArticles.map(article => {
      // 1. 日期处理（yyyy-mm-dd）
      const date = article.isoDate ? new Date(article.isoDate) : 
                   article.pubDate ? new Date(article.pubDate) : new Date();
      const dateStr = formatDate(date);
      
      // 2. 作者处理（🔥 新增：取来源feed的title作为 fallback）
      let auther = '未知作者';
      if (article.author) auther = article.authorr;
    //  else if (article.creator) auther = article.creator;
     // else if (article['dc:creator']) auther = article['dc:creator'];//暂时弃用这两条，要启用的话直接删上面两个注释符号，然后第一个if等号后面，删掉最后一个r就行
      else if (typeof article.source === 'string') auther = article.source;
      else if (article.sourceFeedTitle) auther = article.sourceFeedTitle; // 取来源feed的title
      auther = cleanText(auther).substring(0, 50); // 清理并截断
      
      // 3. 内容处理（去HTML、截200字符）
      let content = article['content:encoded'] || article.content || 
                   article.contentSnippet || article.description || article.summary || '';
      const cleanContent = cleanHtml(content).substring(0, 200);
      
      // 返回标准格式
      return {
        title: cleanText(article.title || '无标题'),
        auther: auther, // 已包含来源feed的title逻辑
        date: dateStr,
        link: article.link || '',
        content: cleanContent
      };
    });
    
    // 返回结果（保持原响应头）
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=300'
      },
      body: JSON.stringify(formattedArticles, null, 2)
    };
    
  } catch (error) {
    console.error('聚合失败:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: '获取文章失败', message: error.message })
    };
  }
};

// 工具函数（保持原逻辑，仅优化可读性）
function removeDuplicates(articles) {
  const seen = new Set();
  return articles.filter(art => {
    const key = art.link || art.guid;
    return key && !seen.has(key) && (seen.add(key), true);
  });
}

function sortArticlesByDate(articles) {
  return articles.sort((a, b) => {
    const dateA = a.isoDate ? new Date(a.isoDate) : a.pubDate ? new Date(a.pubDate) : new Date(0);
    const dateB = b.isoDate ? new Date(b.isoDate) : b.pubDate ? new Date(b.pubDate) : new Date(0);
    return dateB - dateA; // 降序（最新在前）
  });
}

function formatDate(date) {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

function cleanHtml(html) {
  return html?.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim() || '';
}

function cleanText(text) {
  return text?.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim() || '';
}
```

当然我们还得导入rss库，在项目的根目录新建文件`package.json`，在里面输入代码

```json
{
  "name": "rss-aggregator-api",
  "version": "1.0.0",
  "description": "聚合多个 RSS 源转换为 JSON API",
  "dependencies": {
    "rss-parser": "^3.13.0"
  }
}
```
接着访问`https://项目名称.netlify.app/.netlify/functions/rss`就可以获取了，当然你也可以绑定自定义域名，或者自己想办法转移到`cloudflare worker`上面，都是可以的，将链接填入`/src/page_data/Friends.ts`这个文件中用注释标记出来的位置，就可以接入你的博客了\~

## 动态功能api化

接下来就是动态功能的api化，这里借助QQ说说的动态功能实现

:::note{type="success"}
感谢[远梦API](https://api.mmp.cc/doc/talk.html)提供API支持

小声蛐蛐：如果失效可以发邮件给远梦大佬反馈
:::

预览效果：![动态功能预览效果](http://img.magicalapp.cn/api/image/show/2bd2ff62144b82d6ccf0279084ed7bf0)

也是花了点时间做好了em对照表

### 正式教程

首先你得有一个QQ账号（建议用小号，防止和大号动态搞混），然后一定要开启“允许所有人访问QQ空间”，不然的话是获取不到你的说说的，**复制QQ号备用**

然后在刚刚新建的GitHub仓库里，在`/netlify/functions`目录里新建文件`talking.js`，内容输入

```js
exports.handler = async (event, context) => {
    try {
        // 完整的表情符号映射表
        const emojiMap = {
            '400823': '😁', '400824': '😂', '400825': '😃', 
            '400571': '👿', '400831': '😉', '400832': '😊', 
            '401074': '☺️', '400834': '😌', '400835': '😍', 
            '400837': '😏', '400840': '😒', '400841': '😓', 
            '400842': '😔', '400844': '😖', '400846': '😘', 
            '400848': '😚', '400850': '😜', '400851': '😝', 
            '400852': '😞', '400854': '😠', '400855': '😡', 
            '400856': '😢', '400857': '😣', '400859': '😥', 
            '400862': '😨', '400864': '😪', '400867': '😭', 
            '400870': '😰', '400871': '😱', '400872': '😲', 
            '400873': '😳', '400877': '😷', '401190': '🙃', 
            '400833': '😋', '400845': '😗', '400849': '😛', 
            '401193': '🤑', '401187': '🤓', '400836': '😎', 
            '401183': '🤗', '401185': '🙄', '401184': '🤔', 
            '400863': '😩', '400858': '😤', '401186': '🤐', 
            '401191': '🤒', '400874': '😴', '400822': '😀', 
            '400828': '😆', '400827': '😅', '400829': '😇', 
            '401182': '🙂', '400847': '😙', '400853': '😟', 
            '400843': '😕', '401189': '🙁', '401188': '☹️', 
            '400865': '😫', '400876': '😶', '400838': '😐', 
            '400839': '😑', '400869': '😯', '400860': '😦', 
            '400861': '😧', '400868': '😮', '400875': '😵', 
            '400866': '😬', '401192': '🤕', '400830': '😈', 
            '402404': '🥺', '402401': '🥴', '402210': '🤣', 
            '402399': '🥰', '402359': '🤩', '402211': '🤤', 
            '402361': '🤫', '402360': '🤪', '402470': '🧐', 
            '402362': '🤬', '402213': '🤧', '402363': '🤭', 
            '402207': '🤠', '402365': '🤯', '402212': '🤥', 
            '402400': '🥳', '402358': '🤨', '402209': '🤢', 
            '402208': '🤡', '402364': '🤮', '402402': '🥵', 
            '402403': '🥶', '400643': '💩', '401243': '☠️', 
            '400572': '💀', '400569': '👽', '400570': '👾', 
            '400561': '👺', '400560': '👹', '401244': '🤖'
        };

        // 1. 获取API数据
        // 下面的qqid换成你的QQ号
        const apiUrl = 'https://api.mmp.cc/api/talk?uin=qqid';
        const response = await fetch(apiUrl);
        const data = await response.json();
        
        if (data.code !== 0) throw new Error('API返回错误码');
        
        // 2. 处理数据并限制最多20条
        const allItems = data.data;
        // 按原始时间戳倒序排序（新到旧）
        allItems.sort((a, b) => parseInt(b.time) - parseInt(a.time));
        // 只取前20条
        const limitedItems = allItems.slice(0, 20);
        
        // 3. 处理每条数据
        const results = [];
        for (const item of limitedItems) {
            let { content, time } = item;
            const rawTime = parseInt(time); // 原始时间戳
            
            // 调整时间戳（+8小时）
            const adjustedTime = rawTime + 28800;
            
            // 处理tags（末尾的\tags=xx,xx）
            let tags = ["日常"];
            const tagMatch = content.match(/\ntags=([^\n]+)$/);
            if (tagMatch) {
                tags = tagMatch[1].split(',').map(tag => tag.trim());
                content = content.replace(/\ntags=([^\n]+)$/, '');
            }
            
            // 处理Emoji转码
            content = content.replace(/\[em\]e(\d+)\[\/em\]/g, (match, code) => {
                return emojiMap[code] || match; // 找不到映射时保留原文本
            });
            
            // 处理图片标记
            content = content.replace(
                /!\[([^\]]*)\]\(([^)]+)\)/g, 
                (match, alt, url) => {
                    const cleanUrl = url.replace(/\\\//g, '/');
                    return `<p class="vh-img-flex"><img src="${cleanUrl}"></p>`;
                }
            );
            
            // 转换时间格式（使用调整后的时间戳）
            const dateStr = formatTimestamp(adjustedTime);
            
            results.push({
                date: dateStr,
                tags: tags,
                content: content
            });
        }
        
        // 4. 返回结果
        return {
            statusCode: 200,
            headers: { 
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            },
            body: JSON.stringify(results, null, 2)
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
};

// 时间戳格式化函数（接收秒级时间戳）
function formatTimestamp(timestamp) {
    const date = new Date(timestamp * 1000); // 转换为毫秒
    return [
        date.getFullYear(),
        padZero(date.getMonth() + 1),
        padZero(date.getDate())
    ].join('-') + ' ' + [
        padZero(date.getHours()),
        padZero(date.getMinutes()),
        padZero(date.getSeconds())
    ].join(':');
}

// 补零辅助函数
function padZero(num) {
    return num.toString().padStart(2, '0');
}
```
:::note{type="warning"}
将上面API链接里面的qqid替换成你的QQ号
:::

部署完成后就可以访问`https://项目名称.netlify.app/.netlify/functions/talking`进行获取数据了，同样可以绑定自定义域名，然后这个要注意的一点就是，在QQ空间发动态时要按以下格式发送
```text
我这里是非常牛的说说内容，可以分享一下自己的生活写照，随便写点东西，下面是一张图片
![图片注释随便写](这里贴图床链接)
这个图片会在代码中自动转为博客需要的格式，不用太操心
然后下面空两行（连按两下换行）

tags=标签1,标签2
```
注意标签要用英文逗号隔开，如果没有标签则会默认为“日常”，
> 注意不要用QQ的表情，否则会乱码，可以用输入法自带的小黄脸表情
然后再刷新，就可以看到你新发的说说了\~

## 结语

说实话，要搞这些东西挺不容易的，东拼西凑了一堆东西，才勉强搞出来，但至少比一个一个手动填写要好一点，至于友情链接页面的话，反正不是很多，就可以手动填吧，懒得搞了~