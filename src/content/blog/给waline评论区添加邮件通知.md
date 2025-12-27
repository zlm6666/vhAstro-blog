---
title: 教你给自己的waline评论系统部署评论通知
categories: Code
tags:
  - Github
  - 免费教程
  - 博客
id: waline-mail-push
date: 2025-12-27 11:37:45
cover: "http://img.magicalapp.cn/api/image/show/520a1a46d6c696428a00b68d437a7d1f"
recommend: true
---
## 前言

之前我教过大家如何给自己的博客搭建waline的评论系统，现在教大家如何配置邮件通知~

## 配置要求

1. 已配置waline在自己的博客（可以看我之前的文章）
2. 有自己的邮箱服务
3. 建议使用vercel，更方便

## 教程开始

### 获取邮箱服务授权码

我们需要先到自己的邮箱服务中获取授权码，**一般不是登录密码**，推荐邮箱列表
- QQ邮箱
- 163邮箱
- 谷歌邮箱
- 126邮箱

:::note
至于resend，好用是挺好用，但是也有几大痛点：无法发送到outlook邮箱（不被信任），waline自带的配置有点问题，需要自己添加smtp服务器
:::
**以QQ邮箱为例**
登录[QQ邮箱网页版](https://mail.qq.com)，右上角呼出侧边栏，然后点左下角设置，切换到标准版
![切换到标准版](http://img.magicalapp.cn/api/image/show/d68728ff7a04f968fec1b068b0348171)
然后点击左上角设置，点击下方的**账号与安全**，点击设备管理，授权码管理，可以添加授权码（如未启用，请先启用smtp服务），

:::note{type="warning"}
这个授权码只展示一次，请复制下来，如果没复制到，可以重新生成
:::

### 配置环境变量

登录到[vercel](https://vercel.com)，找到自己的项目设置，添加环境变量

手机版的表格有些bug，横屏才能看全，如果显示[email protected]，刷新一下就行了~

 变量名 | 变量值（示例）  | 说明
---|---|---
SMTP_SERVICE  | QQ  | 邮箱服务商，点击[这里](https://github.com/nodemailer/nodemailer/blob/master/lib/well-known/services.json)查看你的邮箱是否支持，若不支持，填后面的
 SMTP_HOST | smtp.qq.com  | SMTP 服务器地址，一般可以在邮箱的设置中找到，不支持上面那个空的时候填
 SMTP_PORT   | 465  | SMTP 服务器端口，一般可以在邮箱的设置中找到，，不支持第一个空的时候填
 SMTP_USER  | 123456789&#x40;qq.com  | SMTP 邮件发送服务的用户名，一般为登录邮箱。
 SMTP_PASS  | 你在第一步获得的授权码  | 如果服务商没有授权码提供，则可能是登录密码
SMTP_SECURE   |  true | 否使用 SSL 连接 SMTP
SITE_NAME  |  笑的博客 | 网站名称，用于在消息中显示
SITE_URL  |  https://blog.xiaow.qzz.io | 网站地址，用于在消息中显示
AUTHOR_EMAIL  | 987654321&#x40;qq.com  | 博主邮箱，用来接收新评论通知。如果是博主发布的评论则不进行提醒通知
SENDER_NAME  |  笑-blog | 自定义发送邮件的发件人（选填）
SENDER_EMAIL  | 123456789&#x40;qq.com  |  自定义发送邮件的发件地址，一般与`SMTP_USER`一致（选填，需与`SENDER_NAME`同时填入）

那么到这里，你就可以顺利接收到邮箱通知了，接下来可以配置一下自定义的模板

### 自定义模板

打开vercel给你创建的GitHub仓库，找到`index.cjs`，将代码替换为
```js
const Application = require('@waline/vercel');

module.exports = Application({
    async postSave(comment) {
        // do what ever you want after save comment
    },
    mailSubjectAdmin: '{{site.name | safe}} 上有新评论了',
    mailTemplateAdmin: `<div style="background: url(https://image.baidu.com/search/down?url=https://tva3.sinaimg.cn/large/c56b8822ly1h62npb7s1ej201y01y0lh.jpg);padding:40px 0px 20px;margin:0px;background-color:#FFCDCE;width:100%;">
	<style type="text/css">@media screen and (max-width:600px){.afterimg,.beforeimg{display:none!important}}</style>
	<div style="border-radius: 10px 10px 10px 10px;font-size:14px;color: #555555;width: 530px;font-family:'Century Gothic','Trebuchet MS','Hiragino Sans GB',微软雅黑,'Microsoft Yahei',Tahoma,Helvetica,Arial,'SimSun',sans-serif;margin:50px auto;max-width:100%;background: ##ffffff;">
		<img class="beforeimg" style="width:530px;height:317px;pointer-events:none" src="https://npm.elemecdn.com/hexo-butterfly-envelope/lib/before.png">
		<img src="https://npm.elemecdn.com/hexo-butterfly-envelope/lib/violet.jpg" style="width:100%;overflow:hidden;pointer-events:none;margin-top: -120px;">
		<div style="width:100%;background:#f8d1ce;color:#9d2850;background-image: -moz-linear-gradient(0deg, rgb(67, 198, 184), rgb(255, 209, 244));height: 66px;background: url(https://tva2.sinaimg.cn/large/c56b8822ly1h61tb7tagcj20ii01u3yc.jpg) left top no-repeat;display: flex;justify-content: center;flex-direction: column;">
		<p style="font-size:16px;font-weight: bold;text-align:center;word-break:break-all;margin:0;">
		您在<a style="text-decoration:none;color: #9d2850;" href="{{site.url}}"target="_blank">{{site.name}}</a>上的文章有了新的评论</p>
		</div>
		<div class="formmain" style="background:#fff;width:100%;max-width:800px;margin:auto auto;overflow:hidden;margin-bottom: -155px;">
			<div style="margin:40px auto;width:90%;"><p><strong>{{self.nick}}</strong> 回复说：</p>
			<div style="background: #fafafa repeating-linear-gradient(-45deg,#fff,#fff 1.125rem,transparent 1.125rem,transparent 2.25rem);box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);margin:20px 0px;padding:15px;border-radius:5px;font-size:15px;color:#555555;">{{self.comment | safe}}</div>
			<p style="text-align:center;position: relative;z-index: 99;">您可以点击<a style="text-decoration:none;color:#cf5c83" href="{{site.postUrl}}" target="_blank">查看回复的完整內容</a></p>
			<img src="https://npm.elemecdn.com/hexo-butterfly-envelope/lib/line.png" style="width:100%;margin:25px auto 5px auto;display:block;pointer-events:none">
			<p class="bottomhr" style="font-size:12px;text-align:center;color:#999">上冬十二(oragekk)博客竭诚为您服务！</p>
			</div>
		</div>
		<img class="afterimg" style="width:535px;height:317px;z-index:100;margin-left: -3px;"src="https://npm.elemecdn.com/hexo-butterfly-envelope/lib/after.png">
	</div>
</div>`,
    mailSubject: '{{parent.nick}}，您在『{{site.name}}』上发表的评论收到了来自 {{self.nick}} 的回复',
    mailTemplate: `<div style="background: url(https://image.baidu.com/search/down?url=https://tva3.sinaimg.cn/large/c56b8822ly1h62npb7s1ej201y01y0lh.jpg);padding:40px 0px 20px;margin:0px;background-color:#FFCDCE;width:100%;">
	<style type="text/css">@media screen and (max-width:600px){.afterimg,.beforeimg{display:none!important}}</style>
	<div style="border-radius: 10px 10px 10px 10px;font-size:14px;color: #555555;width: 530px;font-family:'Century Gothic','Trebuchet MS','Hiragino Sans GB',微软雅黑,'Microsoft Yahei',Tahoma,Helvetica,Arial,'SimSun',sans-serif;margin:50px auto;max-width:100%;background: ##ffffff;">
		<img class="beforeimg" style="width:530px;height:317px;z-index:-100;pointer-events:none" src="https://npm.elemecdn.com/hexo-butterfly-envelope/lib/before.png">
		<img src="https://npm.elemecdn.com/hexo-butterfly-envelope/lib/violet.jpg" style="width:100%;overflow:hidden;pointer-events:none;margin-top: -120px;">
		<div style="width:100%;background:#f8d1ce;color:#9d2850;background-image: -moz-linear-gradient(0deg, rgb(67, 198, 184), rgb(255, 209, 244));height: 66px;background: url(https://tva2.sinaimg.cn/large/c56b8822ly1h61tb7tagcj20ii01u3yc.jpg) left top no-repeat;display: flex;justify-content: center;flex-direction: column;">
		<p style="font-size:16px;font-weight: bold;text-align:center;word-break:break-all;margin:0;">
		您在<a style="text-decoration:none;color: #9d2850;" href="{{site.url}}">『{{site.name | safe}}』</a>上的留言有新回复啦！</p>
		</div>
		<div class="formmain" style="background:#fff;width:100%;max-width:800px;margin:auto auto;overflow:hidden;margin-bottom: -155px;">
			<div style="margin:40px auto;width:90%;"><p>😊Hi，{{parent.nick}}，您曾在文章上发表评论：</p>
			<div style="background: #fafafa repeating-linear-gradient(-45deg,#fff,#fff 1.125rem,transparent 1.125rem,transparent 2.25rem);box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);margin:20px 0px;padding:15px;border-radius:5px;font-size:15px;color:#555555;">{{parent.comment | safe}}</div>
			<p><strong>{{self.nick}}</strong> 给您的回复如下：</p>
			<div style="background: #fafafa repeating-linear-gradient(-45deg,#fff,#fff 1.125rem,transparent 1.125rem,transparent 2.25rem);box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);margin:20px 0px;padding:15px;border-radius:5px;font-size:15px;color:#555555;">{{self.comment | safe}}</div>
			<p>您可以点击<a style="text-decoration:none; color:#cf5c83" href="{{site.postUrl}}" target="_blank"> 查看回复的完整內容 </a>，欢迎再次光临<a style="text-decoration:none; color:#cf5c83" href="{{site.url}}" target="_blank"> {{site.name}} </a>。<hr />
			<p style="font-size:14px;color:#b7adad;text-align:center;position: relative;z-index: 99;">本邮件为系统自动发送，请勿直接回复邮件哦，可到博文内容回复。<br />{{site.url}}</p>
			</p>
			<img src="https://npm.elemecdn.com/hexo-butterfly-envelope/lib/line.png" style="width:100%;margin:25px auto 5px auto;display:block;pointer-events:none">
			<p class="bottomhr" style="font-size:12px;text-align:center;color:#999">笑的博客竭诚为您服务！</p>
			</div>
		</div>
		<img class="afterimg" style="width:535px;height:317px;z-index:100;margin-left: -3px;"src="https://npm.elemecdn.com/hexo-butterfly-envelope/lib/after.png">
	</div>
</div>`
});
```
模板来源于[小波同学](https://blog.ganxb2.com/)，可以进行修改，将其中一些字符串替换成你自己的

**预览**
:::picture
![新评论](https://wp-cdn.4ce.cn/v2/WJ8e4kv.jpeg)
![回复评论](https://wp-cdn.4ce.cn/v2/kuQXuAk.jpeg)
:::
还是非常不错的，要注意邮箱有发现频率限制，过于频繁可能会被禁言！