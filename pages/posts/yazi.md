---
title: Yazi初体验
date: 2024-12-11 18:28:11
lang: zh
duration: 10min
type: blog
art: connections
---

## Yazi是什么？

Yazi是一个基于异步 I/O 的高效终端文件管理器，采用 Rust 语言编写。

> 由于正在学习Rust，因此对Rust相关的项目都比较感兴趣，于是就体验了一下Yazi。

## [Installation](https://yazi-rs.github.io/docs/installation)

macos下可以使用brew安装

```bash
brew install yazi ffmpeg sevenzip jq poppler fd ripgrep fzf zoxide imagemagick font-symbols-only-nerd-font
```

安装完成后可以通过`yazi`命令启动，`q`退出。

## Configuration

在`~/.config/yazi`目录下创建`yazi.toml`,`keymap.toml`,`theme.toml`文件。

### Theme

在[flavors](https://github.com/yazi-rs/flavors)下可以找到一些主题，以下以`catppuccin-mocha.yazi`为例

通过命令安装

```bash
ya pack -a yazi-rs/flavors:catppuccin-mocha
```

在`theme.toml`中添加

```toml
[flavor]
dark = "catppuccin-mocha"
```

> 重启yazi即可看到效果

### File Icons

在使用时遇到File Icon不显示的[问题](https://github.com/sxyazi/yazi/issues/170#issuecomment-1722371155), 将iTerm2的终端字体修改为` non-ASCII text`即可。

## to be continued...
