---
title: My Mac
date: 2025-01-03 14:05:34
lang: zh
duration: 5min
type: blog
---

距离我从Win党转换到Mac党已经有两年多的时间了，从一开始的不熟悉到现在已经无法离开macos，也经历了需要折腾的过程，🛠工具也在不断地更新迭代，分享一些目前我常用的工具。

## 🖥 Coding相关

作为一个"全栈"工程师，使用到的工具也是五花八门。

### Vue/Nuxt

#### VsCode

由于vue生态对vscode插件的支持比较好(例如unocss)，因此使用vscode对vue/nuxt开发具有一个比较舒适的体验，但是最近在户外开发的时候发现vscode的占用和耗电还是比较高，但因为插件的捆绑，也无法转向使用nvim。

#### Zen Browser

前端开发的第二大重要组成部分就是浏览器，一个好的浏览器还是比较重要的，之前使用Chrome的时候，偶尔会遇到卡死的情况，其原因可能是chromium内核的问题，后来使用了mozilla内核的套壳Firefox，也就是Zen Browser，发现卡死的情况减少了。而且颜值即正义，通过一些配置就可以让Zen Browser变得外观像Arc浏览器一样(虽然Arc现在停止开发了，悲😢)。

![zen browser](/images/mac-zen-browser.png)

### Rust

#### Nvim

2024年的大部分时间都是使用VsCode进行Rust开发，在年底的时候，由于在B站多次刷到nvim，便忍不住去尝试了一下nvim的神奇之处，使用[LazyVim](https://www.lazyvim.org/)进行nvim的基础配置，减少了很多配置的负担，开箱即用。目前也通过一些插件的安装基本达到了VSCode的开发体验。而最令我惊喜的是，使用nvim可以全键盘操作，大大减少了在鼠标和键盘间来回切换的繁琐，这也是我如此坚持使用nvim的原因之一。

### 终端

#### Wezterm

在接触到Rust之后，便逐渐对Rust编写的程序有了一些好感，而Wezterm就是使用Rust编写的终端应用，相比于iTerm2，Wezterm的占用更低，启动速度更快，而且配合`yazi`，堪称神器。

#### Yazi

Yazi也是一款基础Rust开发的终端文件管理工具，相较于访达，Yazi支持vim操作，而且也能实现文件的预览，而且也非常美观(逼格很高)。

## 效率工具

### Raycast

连续使用了两年Raycast，Raycast绝对是无法离开macos的原因之一，在偶尔使用win的时候，无论是uTools还是Listary，都无法做到像Raycast这样集美观、实用、快捷于一身的效率工具。
![raycast](/images/mac-raycast.png)

### Aerospace

Aerospace是一款使用Rust编写的窗口管理工具，相比于yabai，Aerospace的设计十分巧妙，通过将窗口应用缩小成一个小窗口来实现，不需要对mac进行SIP关闭，也不需要对窗口进行特殊的设置，只需要在Aerospace中设置好快捷键即可。
也可以设定规则实现窗口的自动布局，非常方便。美中不足的地方在与添加新窗口只能平铺展开，希望后续能够支持窗口的堆叠展开。

> 就先分享这么多吧，后续有更多体会再更新🥳。
