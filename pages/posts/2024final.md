---
title: 2024年终总结
postId: '1001'
date: 2024-12-28 13:57:54
lang: zh
duration: 10min
type: blog
art: connections
---

忙忙碌碌过完了2024年，完成了本科的学业，进入了研究生的新阶段。来到北京这个熟悉却陌生的城市🏙，相比杭州，北京给我的第一印象就是一个大型的县城、形形色色的人迈着急匆匆的脚步奔向各处、吸烟的人有很多......

## 技术🖥与变化

![](/images/2024final/github.png)
今年零零散散的提交了不少commit, 回顾今年，主要做的项目就是[Podwise-AI](https://github.com/eeee0717/podwise-ai-refactor) 和 [Subtitle-Translator-CLI](https://github.com/eeee0717/subtitle-translator-cli)，由于今年刚刚学习`rust`，于是便迫不及待的使用`rust`重构了原来的项目，将原本是使用 `Nuxt`全栈 和 `Avalonia` + `C#` 的两个项目使用`rust`进行了重构，也算是从中学习`rust`。

固然`rust`的学习曲线是十分陡峭的，但是随着慢慢接触到`rust`，便被其所吸引，在使用`Typescript`、`C#`进行错误处理时，总是会觉得`try catch`的写法不够优雅，而`rust`中使用`Result`和`Option`来处理错误，让我感觉到了一些清爽。

目前也有不少大厂在逐渐使用`rust`去替代原先的`C` / `C++`，无论是在嵌入式领域或服务端领域，`rust`的性能和安全性都是比较吸引人的（除了对编程人员的要求比较高...）。不过相信未来的`rust`一定也会更加好，我也会继续学习`rust`。

## 工具🛠与更新

今年在工具的使用方面也有一个比较大的更新，随着对`vscode`+ 触控板的使用，越来越发现，来回频繁切换键盘和触控板的操作是比较繁琐的，也很容易打断思路，于是从刷到[Vim综合症](https://www.bilibili.com/video/BV1az4y1f77A/)这个视频后，便开始了`nvim`的探索之旅，目前已经打算使用`nvim`来替代`vscode`来完成`rust`的一些开发，而`vue`由于`unocss`的提示只有`vscode`才有插件，这是刚需！所以暂时没法替换，除非改为使用`tailwindcss`。除此之外，也将`iTerm2`改为使用`wezterm`，添加了`yazi`的终端文件管理，非常非常好用，强烈推荐！
| 工具 | 旧 | 新 |
| --- | --- | --- |
| 编辑器 | vscode | nvim |
| 终端 | iTerm2 | wezterm |
| 文件管理 | 🈚️ | yazi |

## 未来🌌与展望

2025年即将到来，23年对commit⬆️1k的目标没有达成，不过也正常，毕竟没有那么多点子，甚至今年的一些commit还是刷LeetCode的题目。不过朝着这个目标前进总没错，超过500commit/年就已经超过GitHub上5%的人了，这也是一个不错的成绩。

明年也是研一下学期了，可能会有导师安排任务，希望在完成任务之余依旧能够继续精进代码水平，这也是我的一种取悦自己的方式。

> Always Coding, Always Learning.

<script setup>
import { recapData } from '~/data/2024'
</script>

<RecapPoster :data="recapData" />
