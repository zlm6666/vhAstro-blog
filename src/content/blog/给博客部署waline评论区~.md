---
title: 免费给自己的博客部署waline评论系统的教程~
categories: Code
tags:
  - Github
  - 开源
  - 免费教程
  - 博客
id: waline-deploy-course
date: 2025-12-21 10:09:46
cover: "http://img.magicalapp.cn/api/image/show/ce083b1ce217a8f707aaf33a1851364b"
recommend: true
---
## 前言

想给博客加能唠嗑、自己掌控的评论区？**Waline**刚好——不用靠第三方，部署简单还攒互动，这篇教你搞定～

## 目录
[1.waline概述](#waline概述){:target="_self"}

[2.后端配置](#后端配置){:target="_self"}

[3.服务端部署（使用vercel）](#服务端部署){:target="_self"}

[4.客户端配置](#配置客户端){:target="_self"}

[5.管理员注册](#评论管理){:target="_self"}

[6.视频教程（来自其他用户）](#视频教程){:target="_self"}

## waline概述

**轻量**
- 53kb gzip 的完整客户端大小
**完全免费部署**
- 可免费部署在 Vercel 上
**易于部署**
- 多种部署部署方式和存储服务支持
**登录支持**
- 在允许匿名评论的基础上，支持账号注册，保持身份
**自由评论**
- 完全的 Markdown 支持，同时包含表情、数学公式、HTML 嵌入
**强大的安全性**
- 内容校验、防灌水、保护敏感数据等
**文章反应**
- 快速表达你对文章的态度
**浏览量统计**
- 通过 <1kb 代码可靠统计文章浏览量

## 后端配置

后端会使用**leancloud**服务
1. [登录](https://console.leancloud.app/login) 或 [注册](https://console.leancloud.app/register) `LeanCloud 国际版` 并进入 [控制台](https://console.leancloud.app/apps)
2. 点击左上角 [创建应用](https://console.leancloud.app/apps) 并起一个你喜欢的名字 (请选择免费的开发版):
![创建应用](http://img.magicalapp.cn/api/image/show/b07570145c351554e6d5b69f4cc32f1d)
3. 进入应用，选择左下角的 `设置` > `应用 Key`。你可以看到你的 `APP ID`,`APP Key` 和 `Master Key`。请记录它们，以便后续使用（手机桌面是右上角三条杠可以看到）
![key](http://img.magicalapp.cn/api/image/show/69b5f70337bf00894188062d22c77888)

:::note{type="warning"}
**国内版需要备案**

如果你正在使用 Leancloud 国内版 ([leancloud.cn](https://leancloud.cn))，我们推荐你切换到国际版 ([leancloud.app](https://leancloud.app))。否则，你需要为应用额外绑定**已备案**的域名，同时购买独立 IP 并完成备案接入:

- 登录国内版并进入需要使用的应用
- 选择 `设置` > `域名绑定` > `API 访问域名` > `绑定新域名` > 输入域名 > `确定`。
- 按照页面上的提示按要求在 DNS 上完成 CNAME 解析。
- 购买独立 IP 并提交工单完成备案接入。(独立 IP 目前价格为 ￥ 50/个/月)
![设置域名](http://img.magicalapp.cn/api/image/show/f30a97728b9b1f43a27f456519c7ba0c)
:::

## 服务端部署
使用vercel实现

[![Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fwalinejs%2Fwaline%2Ftree%2Fmain%2Fexample)

点击上方按钮，跳转至 Vercel 进行 Server 端部署，如果没有账号的话，可以先用GitHub创建一个账号，项目名称随便
:::note
vercel会为你创建一个GitHub仓库
:::

### 配置环境变量

点击顶部的 `Settings` - `Environment Variables` 进入环境变量配置页，并配置三个环境变量（变量名和变量值见下）


| 变量名           | 变量值                                 |
|------------------|----------------------------------------|
| LEAN_ID          | 你刚刚在 LeanCloud 获得的 APP ID       |
| LEAN_KEY         | 你刚刚在 LeanCloud 获得的 APP KEY      |
| LEAN_MASTER_KEY  | 你刚刚在 LeanCloud 获得的 Master Key   |

![设置环境变量](http://img.magicalapp.cn/api/image/show/6d55719d9a0e502db07f2dfe75075cc0)

:::note{type="import"}
   如果你使用 LeanCloud 国内版，请额外配置 `LEAN_SERVER` 环境变量，值为你绑定好的域名。
:::
 环境变量配置完成之后点击顶部的 `Deployments` 点击顶部最新的一次部署右侧的 `Redeploy` 按钮进行重新部署，就完成了。
 
> vercel国内速度较慢，建议绑定自己的域名
> 没有域名的可以看[免费域名](https://blog.xiaow.qzz.io/article/free-domain-name-dpdns)
1. 点击顶部的 `Settings` - `Domains` 进入域名配置页
2.  输入需要绑定的域名并点击 `Add`
3. 在域名服务器商处添加新的 `CNAME` 解析记录（此处按照vercel给你的格式添加）
4. 等待生效，你可以通过自己的域名来访问了
   - 评论系统：example.yourdomain.com
   - 评论管理：example.yourdomain.com/ui
   
## 配置客户端

如果你用的是与我这个博客相同的源码，可以直接在`src/config.ts`里面按提示进行配置，如果不是，请看下面。

1. 导入 Waline 样式 `https://unpkg.com/@waline/client@v3/dist/waline.css`。

2. 创建 `<script>` 标签使用来自 `https://unpkg.com/@waline/client@v3/dist/waline.js` 的 `init()` 函数初始化，并传入必要的 `el` 与 `serverURL` 选项。
   - `el` 选项是 Waline 渲染使用的元素，你可以设置一个字符串形式的 CSS 选择器或者一个 HTMLElement 对象。
   - `serverURL` 是服务端的地址，即上一步获取到的值。
   ```html
   <head>
     <!-- ... -->
     <link
       rel="stylesheet"
       href="https://unpkg.com/@waline/client@v3/dist/waline.css"
     />
     <!-- ... -->
   </head>
   <body>
     <!-- ... -->
     <div id="waline"></div>
     <script type="module">
       import { init } from 'https://unpkg.com/@waline/client@v3/dist/waline.js';

       init({
         el: '#waline',
         serverURL: 'https://your-domain.vercel.app',
       });
     </script>
   </body>
   ```
## 评论管理

1. 部署完成后，请访问 `<serverURL>/ui/register` 进行注册。首个注册的人会被设定成管理员。
2. 管理员登陆后，即可看到评论管理界面。在这里可以修改、标记或删除评论。
3. 用户也可通过评论框注册账号，登陆后会跳转到自己的档案页。

## 视频教程
来自其他up主的教程

<div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden;"><iframe src="https://player.bilibili.com/player.html?bvid=1pB4y1E7fp&quality=16" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0;" frameborder="0" allowfullscreen></iframe></div>

<div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden;"><iframe src="https://player.bilibili.com/player.html?bvid=1NF411y7eP&quality=16" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0;" frameborder="0" allowfullscreen></iframe></div>

## 结语
没啥好说的，其实教程已经非常详细了，按照教程一步一步来都能成功，只要不乱改，出事了就是waline或者leancloud的锅(doge

也不用担心免费额度不够用，如果是个人博客的话，那免费额度够你用一辈子了