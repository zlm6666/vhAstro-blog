---
title: 在termux安装blutter教程
categories: Code
tags:
  - mt管理器
  - termux
  - 安卓逆向
  - 教程
id: termux-install-blutter
date: 2026-3-21 15:50:12
cover: "https://img.tucang.cc/api/image/show/2859f26f38a901982ed62ccf25c55e96"
recommend: true
---
## 前言
好了，隔了这么久也是又来更新了，这里也是带来termux安装blutter的教程，封面图是AI生成的，挺雷霆吧😂
### 目录
<a href="#blutter功能" target="_self">**1.blutter功能**</a>

<a href="#更换快速镜像" target="_self">**2.更换快速镜像**</a>

<a href="#安装教程" target="_self">**3.安装教程**</a>

<a href="#使用教程" target="_self">**4.使用教程**</a>
## blutter功能

为什么要安装blutter？因为当我们逆向分析flutter软件时，他的代码不是在dex文件里，而是被藏在了`libapp.so`里，我们需要把这玩意儿给他解密出来，便于我们进行逆向分析

## 更换快速镜像

因为termux在国内的网络有些玄学，建议更换国内镜像，更快一点，首先下载安装termux我就不再多说了，自己去官网或者GitHub下载安装就行

安装后先输入
```bash
termux-change-repo
```
这时候会出现一个图形化界面

![图形化界面](https://img.tucang.cc/api/image/show/e6da83f77e99f370bdab71e9083252bd)

他让我们从`Mirror group`和`Single mirror`里面选择，第一个是镜像组，就是选择一堆镜像源，要用的时候让他自己挑，但这边还是建议选择第二个，选取单个镜像，就指定只用这一个镜像，国内比较推荐的镜像有清华源和阿里源，怎么说呢，看地理位置吧，华南华东地区的建议使用阿里源，北方的建议使用清华源，虽然说差别不是很大

我们通过`↓`这个按钮选择到`Single mirror`，然后这一步用手指点击标题前面的括号，这样括号里就会出现一个星号，说明你选上了，然后按回车或者用手指点ok，这时候就会跳出以下界面（如果没跳出来，请耐心等待）

![选择界面](https://img.tucang.cc/api/image/show/602d45aba6e7403dbaa4196856e5e806)

像图中标出来的那个就是阿里源，清华源的话是在上面`mirrors.tuna.tsinghua.edu`那个，同样用手指点击前面的括号，使其带上星号，就选上了，最后回车等他安装完就行。

## 安装教程

因为我们要克隆blutter仓库，并且他的语言是Python，在此之前，我们先需要安装一些依赖

我们依次输入
```bash
termux-setup-storage
pkg update && pkg upgrade
pkg install python3 openssl git build-essential ninja cmake pkg-config libicu capstone fmt
```
第一行命令是索取储存权限，你需要在接下来弹窗中选择同意，第二行命令是更新依赖，第三行命令是安装`python3`、`openssl`、`git`、`build-essential`、`ninja`、`cmake`、`pkg-config`、`libicu`、`capstone`、`fmt`这些依赖
然后我们再克隆仓库
我们输入
```bash
git clone https://gh-proxy.org/https://github.com/AbhiTheModder/blutter-termux.git
```
这里已经配置了代理，如果不想要代理的话，把前面的`https://gh-proxy.org/`删掉就行，如果嫌不够快的话，可以在`gh-proxy`前面加一个`hk.`（不过这个速度已经够快了，没必要）

然后我们还需要安装Python3所需依赖
直接输入
```bash
pip install requests pyelftools
```
等他安装完成，最后再输入
```bash
cd blutter-termux
```
如果能正常进到这个目录里，就说明成功了

## 使用教程
先通过这个命令来到blutter目录
```bash
cd blutter-termux
```
然后在mt管理器，找到你要解包的应用，进去之后将`lib/arm64-v8a`这个文件夹移动到你找得到的位置，并创建一个新的文件夹，

进入移动后的`arm64-v8a`文件夹，长按最上面的路径就可以复制完整路径，比如`/storage/emulated/0/Download/arm64-v8a`，顺便把刚刚让你新建的文件夹路径也复制一下，比如`/storage/emulated/0/Download/new`，然后回到termux

输入
```bash
python3 blutter.py 路径1 路径2
```
例如我刚刚复制的路径，那么代码就输入
```bash
python3 blutter.py /storage/emulated/0/Download/arm64-v8a /storage/emulated/0/Download/new
```
然后要你非常有耐心的等待，反正就是要特别有耐心

最后在你新建的那个文件夹里就可以找到你所需要的数据了~