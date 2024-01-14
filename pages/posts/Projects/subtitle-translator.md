---
title: 字幕翻译工具
date: 2024-01-11T16:00:00.000+00:00
lang: zh
duration: 20min
type: projects-detail
---
## 1. 项目介绍
基于Avalonia MVVM架构开发的跨平台字幕翻译工具，支持多种字幕格式，可自定义翻译引擎，支持多种翻译引擎，可自定义翻译结果的格式。

## 2. 技术栈

## 3. 技术难点
### 2024-1-12 ViewModel通讯
1. 使用Ioc容器将ViewModel注册到容器中
由于使用Ioc注入会导致vm互相引用，容易忘记注册，比较麻烦，所以使用Messenger通讯

2. 使用Messenger通讯
优点：类似于广播机制，不需要注册，不需要关心对方是否存在，只需要发送消息即可
```csharp
// 发送消息
WeakReferenceMessenger.Default.Send(new ValueChangedMessage<string>("Hello World!"));
// 接收消息
public void Receive(ValueChangedMessage<string> message)
{
  ToBeTranslatedPaths.Add(message.Value);
}
// datacontext开启
<UserControl.DataContext>
  <vm:MainWindowViewModel IsActive = "true"/>
</UserControl.DataContext>
```

### 2024-1-13 字符串变量携带转义字符
起因：由于使用变量读取文件中的字符串，导致变量中存在转义字符，如\n，\t等，导致嵌入json格式不正确
解决：构造实体类，序列化为json
```csharp
public class TencentcloudRequestBody
{
  public required string SourceText;
  public string Source="en";
  public string Target="zh";
  public int ProjectId=1;
}

var tencentcloudRequestBody = new TencentcloudRequestBody
{
  SourceText = text,
  Source = sourceLanguage,
  Target = targetLanguage
};
string tencentcloudRequestBodyString = JsonConvert.SerializeObject(tencentcloudRequestBody);
``` 

### 2024-1-14 翻译格式问题
起因：最初的方案是读取文件中的所有字符串，将其直接进行翻译，后来发现会出现如下问题：

1. 由于srt格式的第一行为序号，调用API翻译时会将序号进行翻译，例如"1"翻译成"1个","1岁"之类的。
2. srt中的时间戳的格式为"00:00:00,000 --> 00:00:00,000"，调用API翻译时会将英文":"翻译成中文"："
3. 由于API调用次数有限，不能频繁调用，因此需要将翻译内容拼接，分批翻译。

故修改为如下方案：

1. 将srt读取的字符串按照行来存储，读取到字幕内容时使用""占位。使用正则表达式筛选序号和时间戳。
2. 将读取的字幕内容进行分批存储。
3. 将字幕内容翻译后按照"\n"进行分割，分割后的结果存在一个List中。
4. 将分割后的结果与原来的字幕内容进行拼接，得到翻译后的字幕内容。
> 性能待优化

