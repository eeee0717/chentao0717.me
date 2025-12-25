---
title: Subtitle-Translator-CLI/GUI使用说明书
date: 2024-12-27 10:49:34
lang: zh
duration: 10min
type: blog
art: connections
---

## Subtitle-Translator-CLI使用说明书

> Blog地址: [Subtitle-Translator-CLI](/posts/subtitle-translator-cli)

> GitHub地址: [Subtitle-Translator-CLI](https://github.com/eeee0717/subtitle-translator-cli)

### 工具简介

这是一个基于AI翻译的命令行工具, 可以翻译.srt字幕格式的文件。

### 灵感来源

1. 在寻找国外电影时，一般字幕都为英文，而有些小众的电影或者比较新的电影国内还没有翻译。
2. 即使在一些字幕网站上可以找到翻译成中文的字幕，但很大概率是直接机翻的，质量不高。
3. 市面上一些翻译工具都是基于GUI，且也是机翻，即使有使用AI翻译，在长文本翻译上仍会出现一些幻觉。

### 项目解决的难点

> 市面上大部分字幕翻译工具都是基于机器翻译，但是机器翻译的质量不高；使用AI进行翻译的工具会由于大模型的幻觉问题导致翻译效果不好。

#### 相比机器翻译

1. 解决机器翻译质量不高的问题
2. 解决机器翻译无法多行翻译的问题

#### 相比AI翻译

1. 解决Tokens限制问题
2. 解决字幕格式保持问题
3. 解决翻译质量问题

### 项目实现

#### 提取字幕信息

为了使AI可以精准地处理信息，我们需要分离SRT文件中的各部分信息，只让AI处理文本部分。这样又节省了Tokens，也能使字幕格式不被破坏。

- 对输入的原始字幕文本进行解析。
- 将字幕信息分类为三部分：时间信息、序号信息和文本信息。
- 只保留文本信息用于后续的 AI 翻译。

#### 切分文本

为了进一步优化翻译过程，需要将提取出的文本信息重新组织。这一步的目的是将文本分割成适合 LLM 处理的大小，同时保持上下文的连贯性。

- 将文本按照每 40 句为一组进行切分。这个数字是经过多次测试后得出的平衡点，既能保证翻译质量，又不会超出 LLM 的处理能力。
- 使用 标签分割每句文本。这种标记方法便于后续的重新组装，同时也为 AI 模型提供了清晰的句子边界。
- 使用`<nl>`标签替换每组文本中的换行符，以实现多行翻译。

#### 格式化原文本

在这一步，我们构建了最终输入给 LLM 的原文本。这个步骤的关键在于如何在控制 tokens 数量的同时，为 AI 提供足够的上下文信息。

- 传入所有文本作为背景上下文。这确保 AI 能理解整段对话的语境。
- 使用`<TRANSLATE_THIS>`标签明确指出当前需要翻译的片段。这种方法既能控制 AI 的输出范围，又不会丢失整体语境。

#### LLM翻译

这是整个过程中最关键的一步。我们利用 LLM 的强大能力来实现高质量翻译，使用CoT的思维链提高AI的翻译质量。

这个过程包括以下几个阶段：

- 第一轮直译：要求 AI 严格按照 标签逐句翻译，保证准确性。
- 第二轮意译：允许 AI 自主发挥，对第一轮的结果进行修改和优化。
- 第三轮反思：AI 对自己的翻译进行评价，从多个角度提出改进建议。
- 最后一轮修改：根据反思阶段的建议，AI 对翻译进行最后的调整和优化。

> 这种多轮翻译和反思的方法显著提高了翻译质量。它不仅能捕捉原文的准确含义，还能使翻译更加流畅自然。

#### 整合字幕

完成翻译后，我们需要将所有信息重新组合成完整的字幕文件。这一步骤包括：

- 整合之前分离的序号信息和时间信息。
- 将翻译好的文本与原文本对应。
- 使用代码执行模块自动完成组装过程。

#### 并发处理

为了快速处理整个长字幕文件，我们使用并发处理的方法。这种方法可以大大提高处理速度，同时也能保证翻译质量。

- 将字幕文本切分为多个Group。
- 使用多线程同时处理多个Group，并用key记录Group的序号。
- 完成任务后根据key进行排序。

### 使用说明

1. 下载`release.zip`文件并解压。[下载地址](https://github.com/eeee0717/subtitle-translator-cli/releases/download/v0.1.0/release.zip)
2. 填写`config.json`文件，填写openai的`api_key`和`api_base'
3. 打开终端，进入解压后的文件夹，使用命令`stc -p <path> -s <source_language> -t <target_language>`进行翻译。
   > path为字幕文件路径，source_language为源语言，target_language为目标语言。

<video id="video" controls="" preload="none">
 <source id="mp4" src="/videos/subtitle-translator-cli.mp4" type="video/mp4">
</video>

## 后续优化

1. 支持更多的字幕格式。
2. 基于此内核构建GUI版本。

## Subtitle-Translator-GUI使用说明书

> Bilibili视频链接: [Subtitle-Translator-GUI](https://www.bilibili.com/video/BV1Cg4y127NP/?spm_id_from=333.999.0.0&vd_source=e69adc4cbcbf14d298fc66f0ae53c5c8)

> GitHub地址: [Subtitle-Translator-GUI](https://github.com/eeee0717/SubtitleTranslator)

### 工具简介

这是一个使用`C#`+`Avalonia`框架实现的字幕翻译工具GUI，支持使用腾讯云和有道云服务对字幕进行翻译工作。

### 使用说明

#### 项目截图

<img width="868" alt="CleanShot 2024-01-24 at 16 31 45@2x" src="https://github.com/eeee0717/SubtitleTranslator/assets/70054568/c6c22132-2227-45e6-8161-5ce0332b682c">

#### 安装指南

> 前往(Release)[]界面下载对应的安装包

##### MacOS

由于没有Apple开发者账号，打开时如出现 xxx.app 已损坏，请执行如下指令：

```bash
sudo xattr -rd com.apple.quarantine /Applications/SubtitleTranslator.app
```

#### 服务商配置

##### 腾讯云配置

1. 登录[腾讯云](https://cloud.tencent.com/)
2. 搜索访问管理 -> 用户 -> 用户列表 -> 新增用户
   ![CleanShot 2024-01-24 at 16 39 02@2x](https://github.com/eeee0717/SubtitleTranslator/assets/70054568/561d5437-d59d-4520-9c5a-4905c5df862d)
3. 点击新增的用户 -> API密钥 -> 新增密钥
4. 复制 SecretId 和 SecretKey粘贴到设置中
5. 点击测试按钮进行测试

##### 有道云配置

1. 登录[有道智云](https://ai.youdao.com/console/#/)
2. 应用总览 -> 创建应用 -> 选择文本翻译服务和API接入
3. 复制 AppId 和 AppKey粘贴到设置中
4. 点击测试按钮进行测试

### 开发指南

该项目使用Avalonia开发，[Avalonia](https://avaloniaui.net/)是一个跨平台框架，可以让.NET开发人员更好的创建跨平台App。

由于开发中使用到了Community Toolkit Lab中的实验特性，因此需要在nuget中添加新的nuget包

```bash
https://pkgs.dev.azure.com/dotnet/CommunityToolkit/_packaging/CommunityToolkit-Labs/nuget/v3/index.json
```
