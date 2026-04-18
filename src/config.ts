export default {
  // 网站标题
  Title: '笑的博客',
  // 网站地址
  Site: 'https://blog.xiaow.qzz.io',
  // 网站副标题
  Subtitle: '以笑为桥，共赴心途',
  // 网站描述
  Description: '随性收拢生活散落的笑意，与同路人漫谈成长微澜。',
  // 网站作者
  Author: '𝒙𝒊𝒂𝒐',
  // 作者头像
  Avatar: 'https://wp-cdn.4ce.cn/v2/TVFIv5x.jpeg',
  // 网站座右铭
  Motto: '懒于空想，勤于笔耕；若有所感，方落字成章',
  // Cover 网站缩略图
  Cover: '/assets/images/banner/072c12ec85d2d3b5.webp',
  // 网站侧边栏公告 (不填写即不开启)
  Tips: '<p>欢迎光临我的博客 🎉</p><p>这里会分享我的日常和学习中的收集、整理及总结，希望能对你有所帮助:) 💖</p>',
  // 首页打字机文案列表
  TypeWriteList: [
    '笑为光，照岁痕，见未改心',
    "Laughter as light, shining years, seeing unchanged heart.",
  ],
  // 网站创建时间
  CreateTime: '2025-12-07',
  // 顶部 Banner 配置
  HomeBanner: {
    enable: true,
    // 首页高度
    HomeHeight: '38.88rem',
    // 其他页面高度
    PageHeight: '28.88rem',
    // 背景
    background: "url('https://www.yumus.cn/api/?target=img&brand=bing&ua=pc') no-repeat center 60%/cover",
  },
  // 博客主题配置
  Theme: {
    // 颜色请用 16 进制颜色码
    // 主题颜色
    "--vh-main-color": "#01C4B6",
    // 字体颜色
    "--vh-font-color": "#34495e",
    // 侧边栏宽度
    "--vh-aside-width": "318px",
    // 全局圆角
    "--vh-main-radius": "0.88rem",
    // 主体内容宽度
    "--vh-main-max-width": "1458px",
  },
  // 导航栏 (新窗口打开 newWindow: true)
  Navs: [
    // 仅支持 SVG 且 SVG 需放在 public/assets/images/svg/ 目录下，填入文件名即可 <不需要文件后缀名>（封装了 SVG 组件 为了极致压缩 SVG）
    // 建议使用 https://tabler.io/icons 直接下载 SVG
    { text: '朋友', link: '/links', icon: 'Nav_friends' },
    { text: '圈子', link: '/friends', icon: 'WebSite_analytics' },
    { text: '动态', link: '/talking', icon: 'Nav_talking' },
    { text: '昔日', link: '/archives', icon: 'Nav_archives' },
    { text: '留言', link: '/message', icon: 'Nav_message' },
    { text: '关于', link: '/about', icon: 'Nav_about' },
    { text: '笑的主页',link :'https://www.xiaow.qzz.io',icon: 'Nav_link' }
  ],
  // 侧边栏个人网站
  WebSites: [
    // 仅支持 SVG 且 SVG 需放在 public/assets/images/svg/ 目录下，填入文件名即可 <不需要文件后缀名>（封装了 SVG 组件 为了极致压缩 SVG）
    // 建议使用 https://tabler.io/icons 直接下载 SVG
    { text: '主页', link: 'https://www.xiaow.qzz.io', icon: 'website_home' },
    { text: 'Github', link: 'https://github.com/zlm6666', icon: 'WebSite_github' },
    { text: '哔哩哔哩', link: 'https://m.bilibili.com/space/1309873575', icon: 'WebSite_bili' },
    { text: 'MT论坛', link: 'https://bbs.binmt.cc/home.php?mod=space&uid=139510&do=profile', icon: 'WebSite_mt' },
    { text: 'QQ群组', link: 'https://qm.qq.com/q/i844droz8k?from=tim', icon: 'website_qq' },
    { text: '图床', link: 'https://www.xiaow.qzz.io/image', icon: 'WebSite_img' },
  ],
  // 侧边栏展示
  AsideShow: {
    // 是否展示个人网站
    WebSitesShow: true,
    // 是否展示分类
    CategoriesShow: true,
    // 是否展示标签
    TagsShow: true,
    // 是否展示推荐文章
    recommendArticleShow: true
  },
  // DNS预解析地址
  DNSOptimization: [
    'https://registry.npmmirror.com',
    'https://pagead2.googlesyndication.com',
    'https://fenxi.xiaow.qzz.io',
    'https://img.tucang.cc',
    'https://vh-api.4ce.cn',
    'https://seccdn.libravatar.org',
    'http://api.xakj02.cn',
    'https://xiaow.qzz.io',
    'https://waline.xiaow.qzz.io',
    'https://img1.tucang.cc',
    'https://blog.xiaow.qzz.io'
  ],
  // 博客音乐组件解析接口
  vhMusicApi: 'https://vh-api.4ce.cn/blog/meting',
  // 评论组件（只允许同时开启一个）
  Comment: {
    // Twikoo 评论
    Twikoo: {
      enable: false,
      envId: 'https://twikoo.xiaow.qzz.io/'
    },
    // Waline 评论
    Waline: {
      enable: true,
      serverURL: 'https://waline.xiaow.qzz.io'
    }
  },
  // Han Analytics 统计（https://github.com/uxiaohan/HanAnalytics）
  HanAnalytics: { enable: true, server: 'https://fenxi.xiaow.qzz.io', siteId: 'xiao-blog' },
  // Google 广告
  GoogleAds: {
    ad_Client: '', //ca-pub-xxxxxx
    // 侧边栏广告(不填不开启)
    asideAD_Slot: `<ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-xxxxxx" data-ad-slot="xxxxxx" data-ad-format="auto" data-full-width-responsive="true"></ins>`,
    // 文章页广告(不填不开启)
    articleAD_Slot: `<ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-xxxxxx" data-ad-slot="xxxxxx" data-ad-format="auto" data-full-width-responsive="true"></ins>`
  },
  // 文章内赞赏码
  Reward: {
    // 支付宝收款码
    AliPay: '/assets/images/alipay.webp',
    // 微信收款码
    WeChat: '/assets/images/wechat.webp'
  },
  // 访问网页 自动推送到搜索引擎
  SeoPush: {
    enable: true,
    serverApi: 'https://vh-api.4ce.cn/api/seoPush',
    paramsName: 'url'
  },
  // 页面阻尼滚动速度
  ScrollSpeed: 666
}