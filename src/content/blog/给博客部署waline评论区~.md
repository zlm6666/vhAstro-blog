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
updated: 2026-01-16 7:20:42
cover: "http://img.magicalapp.cn/api/image/show/ce083b1ce217a8f707aaf33a1851364b"
recommend: true
---
## 前言

想给博客加能唠嗑、自己掌控的评论区？**Waline**刚好——不用靠第三方，部署简单还攒互动，这篇教你搞定～

## 目录
<a href="#waline概述" target="_self">1.waline概述</a>

<a href="#服务端部署" target="_self">2.服务端部署（使用vercel）</a>

<a href="#配置数据库" target="_self">3.配置数据库</a>

<a href="#配置客户端" target="_self">4.客户端配置</a>

<a href="#评论管理" target="_self">5.管理员注册</a>

<a href="#视频教程" target="_self">6.视频教程（来自其他up主）</a>

<a href="#更新方式" target="_self">7.如何更新</a>

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


## 服务端部署
使用vercel实现

[![Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fwalinejs%2Fwaline%2Ftree%2Fmain%2Fexample)

点击上方按钮，跳转至 Vercel 进行 Server 端部署，如果没有账号的话，可以先用GitHub创建一个账号，项目名称随便
:::note
vercel会为你创建一个GitHub仓库
:::

## 配置数据库

:::note{type="error"}
原本使用的`leancloud`即将停止服务，请使用下面的新方案
:::

1. 点击顶部的`Storage`进入存储服务配置页，选择`Create Database`创建数据库。`Marketplace Database Providers`数据库服务选择`Neon`，点击`Continue`进行下一步。（按图点击）

![创建数据库](http://img.magicalapp.cn/api/image/show/ba2952b6b6f4469765210c0a813ccf62)

2. 此时会让你创建一个`Neno`账号，此时选择 `Accept and Create`接受并创建。后续选择数据库的套餐配置，包括地区和额度（默认免费套餐，USA 东部地区）。这里可以什么都不操作直接选择`Continue`下一步。

![创建账号](http://img.magicalapp.cn/api/image/show/5006a3e61b58da2ecc50896afa8afb7b)

3. 然后取一个你喜欢的名称，下一步

4. 这时候`Storage`下就有你创建的数据库服务了，点击进去选择`Open in Neon`跳转到`Neon`。在`Neon`界面左侧选择`SQL Editor`，将下面的代码粘贴进编辑器中，点击`Run`执行创建表操作。（按图操作）
```sql
CREATE SEQUENCE wl_comment_seq;

CREATE TABLE wl_comment (
  id int check (id > 0) NOT NULL DEFAULT NEXTVAL ('wl_comment_seq'),
  user_id int DEFAULT NULL,
  comment text,
  insertedAt timestamp(0) without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ip varchar(100) DEFAULT '',
  link varchar(255) DEFAULT NULL,
  mail varchar(255) DEFAULT NULL,
  nick varchar(255) DEFAULT NULL,
  pid int DEFAULT NULL,
  rid int DEFAULT NULL,
  sticky numeric DEFAULT NULL,
  status varchar(50) NOT NULL DEFAULT '',
  "like" int DEFAULT NULL,
  ua text,
  url varchar(255) DEFAULT NULL,
  createdAt timestamp(0) without time zone NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt timestamp(0) without time zone NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ;


CREATE SEQUENCE wl_counter_seq;

CREATE TABLE wl_counter (
  id int check (id > 0) NOT NULL DEFAULT NEXTVAL ('wl_counter_seq'),
  time int DEFAULT NULL,
  reaction0 int DEFAULT NULL,
  reaction1 int DEFAULT NULL,
  reaction2 int DEFAULT NULL,
  reaction3 int DEFAULT NULL,
  reaction4 int DEFAULT NULL,
  reaction5 int DEFAULT NULL,
  reaction6 int DEFAULT NULL,
  reaction7 int DEFAULT NULL,
  reaction8 int DEFAULT NULL,
  url varchar(255) NOT NULL DEFAULT '',
  createdAt timestamp(0) without time zone NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt timestamp(0) without time zone NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ;


CREATE SEQUENCE wl_users_seq;

CREATE TABLE wl_users (
  id int check (id > 0) NOT NULL DEFAULT NEXTVAL ('wl_users_seq'),
  display_name varchar(255) NOT NULL DEFAULT '',
  email varchar(255) NOT NULL DEFAULT '',
  password varchar(255) NOT NULL DEFAULT '',
  type varchar(50) NOT NULL DEFAULT '',
  label varchar(255) DEFAULT NULL,
  url varchar(255) DEFAULT NULL,
  avatar varchar(255) DEFAULT NULL,
  github varchar(255) DEFAULT NULL,
  twitter varchar(255) DEFAULT NULL,
  facebook varchar(255) DEFAULT NULL,
  google varchar(255) DEFAULT NULL,
  weibo varchar(255) DEFAULT NULL,
  qq varchar(255) DEFAULT NULL,
  oidc varchar(255) DEFAULT NULL,
  "2fa" varchar(32) DEFAULT NULL,
  createdAt timestamp(0) without time zone NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt timestamp(0) without time zone NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ;
```

![open in neon](http://img.magicalapp.cn/api/image/show/231230d09092e5fe40276f8d37ad3f0a)

![粘贴代码](http://img.magicalapp.cn/api/image/show/8aacd69cb34f5b1984fdfd43e90da275)

5. 稍等片刻之后会告知你创建成功。然后回到vercel，更新部署，让配置生效（点击顶部的 `Deployments` 点击顶部最新的一次部署右侧的 `Redeploy` 按钮进行重新部署，就完成了。）

![更新部署](http://img.magicalapp.cn/api/image/show/cd7cf3b3a07cf7fd32b27f4448974a46)

等待部署完成就好了~

> vercel国内速度较慢，建议绑定自己的域名
> 没有域名的可以看[免费域名](https://blog.xiaow.qzz.io/article/free-domain-name-dpdns)
1. 点击顶部的 `Settings` - `Domains` 进入域名配置页
2.  输入需要绑定的域名并点击 `Add`
3. 在域名服务器商处添加新的 `CNAME` 解析记录（此处按照vercel给你的格式添加）
4. 等待生效，你可以通过自己的域名来访问了
   - 评论系统：example.yourdomain.com
   - 评论管理：example.yourdomain.com/ui
   :::note{type="import"}
   如果是用cloudflare绑定的，要关闭“通过cloudflare代理流量”，否则所有评论IP都会显示为`cloudflare`
   :::
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
来自其他up主的教程，版本较老，仅供参考，配置数据库的部分以本帖子为准

<div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden;"><iframe src="https://player.bilibili.com/player.html?bvid=1pB4y1E7fp&quality=16" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0;" frameborder="0" allowfullscreen></iframe></div>

<div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden;"><iframe src="https://player.bilibili.com/player.html?bvid=1NF411y7eP&quality=16" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0;" frameborder="0" allowfullscreen></iframe></div>

## 更新方式
使用faq，在github仓库中找到`package.json`，里面的内容默认是
```json
{
  "name": "template",
  "version": "0.0.1",
  "private": true,
  "dependencies": {
    "@waline/vercel": "latest"
  }
}
```
本来是会自动适配新版本的，但是如果没有自动适配的话，就可以手动更改，先在浏览器登录你部署的waline，它会提示最新版本是哪个，比如说他提示我的`@waline/vercel:1.35.0`，那我就把里面的`latest`换成`^1.35.0`，其中`^`意思是自动适配小版本更新

## 结语
没啥好说的，其实教程已经非常详细了，按照教程一步一步来都能成功，只要不乱改，出事了就是waline或者leancloud的锅(doge

也不用担心免费额度不够用，如果是个人博客的话，那免费额度够你用一辈子了

部署邮件通知，请看[这里](../waline-mail-push)