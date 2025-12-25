---
title: .NET System.Text.Json的便利性
date: 2023-10-28T16:00:00.000+00:00
lang: zh
duration: 25min
type: blog
art: connections
---

[原文连接](https://devblogs.microsoft.com/dotnet/the-convenience-of-system-text-json/)

[JSON文档处理](https://learn.microsoft.com/zh-cn/dotnet/standard/serialization/system-text-json/overview)是处理现代代码库时最常见的任务之一，同样出现在客户端和云应用程序中。System.Text.Json提供了多个api来读写JSON文档。在这篇文章中，我们将看看用System.Text.Json读取和写入JSON的便利性。我们也会看看[Newtonsoft.Json](https://www.newtonsoft.com/json)(又名[Json.NET](https://Json.NET))，最流行、功能强大的.NET Json库。

我们最近开始了一个关于[.NET便利性](https://devblogs.microsoft.com/dotnet/the-convenience-of-dotnet/)的系列，该系列描述了我们为常见任务提供方便解决方案的方法。这个系列的关键在于.NET平台的优势之一是它提供的api能够吸引具有广泛需求的广泛开发人员。这个范围的api可以被认为是初学者到高级的，但是我更愿意认为这个范围是方便的，有很好的默认行为，有灵活的低级控制。System.Text.Json就是这样一个例子。

请查看.NET 8中[System.Text.Json](https://devblogs.microsoft.com/dotnet/the-convenience-of-system-text-json/#:~:text=What%E2%80%99s%20new%20in%20System.Text.Json%20in%20.NET%208)的新特性。我们将要分析的代码中使用了其中一些新的JSON特性。

## API

JSON处理有几种常见的方式。

- 序列化器api自动序列化和反序列化JSON，分别将对象转换为JSON和JSON转换为对象。
- 文档对象模型(Document Object Model, DOM) api提供了整个JSON文档的视图，并直接用于读写对象、数组和其他JSON数据类型。
- 最后是阅读器和写入器api，它们支持读取和写入JSON文档，一次一个JSON节点，具有最大的性能和灵活性。

下面是我们将要分析的api(涵盖所有这三种风格)

- [System.Text.Json.JsonSerializer](https://learn.microsoft.com/dotnet/api/system.text.json.jsonserializer)
- [Newtonsoft.Json.JsonSerializer](https://www.newtonsoft.com/json/help/html/T_Newtonsoft_Json_JsonSerializer.htm)
- [System.Text.Json.Nodes.JsonNode](https://learn.microsoft.com/dotnet/api/system.text.json.nodes.jsonnode)
- [System.Text.Json.Utf8JsonReader](https://learn.microsoft.com/dotnet/api/system.text.json.utf8jsonreader)
- [System.Text.Json.Utf8JsonWriter](https://learn.microsoft.com/dotnet/api/system.text.json.utf8jsonwriter)

注意: Newtonsoft.Json还提供DOM、读取器和写入器。System.Text.Json还通过System.Text.Json.JsonDocument提供了一个只读的DOM API。这篇文章不涉及这些，但是它们都提供了有价值的功能。

接下来，我们将看一个已经实现了多次的应用程序——针对每个api——测试它们的易用性和效率。

## 应用程序

该[应用程序](https://github.com/richlander/convenience/tree/main/releasejson/releasejson)从我们为.NET发布的JSON文件中生成一种JSON遵从性摘要。本博客系列的目标之一是编写一些我们可以测试性能的小应用程序，其他人可能会觉得有用。

报告要求如下:

- 包括各主要版本的最新补丁版本和安全版本，包括CVE列表。
- 包括重要事件发生前后的天数。
- 匹配发行版本。尽可能使用Json串式模式。

应用程序将JSON报告写入控制台，但仅在Debug模式下(以避免影响性能测量)。

为了简单起见，这些基准测试为单个.NET版本生成报告。我编写了另一个为[多个版本生成报告](https://github.com/dotnet/dotnet-docker/blob/main/samples/releasesapp/README.md)的示例。如果你想使用这个应用程序来达到它声明的合规性目的，我建议你使用它。

## 方法

该应用程序已经使用多个JSON文件进行了测试，所有文件都使用相同的模式，但在大小(1k vs 1000k)和目标数据在文件中的位置(开始vs结束)上差异很大。测试还在两种机器类型上运行。

你可以用相同的方式测量这些测试app。请注意，测量包括调用网络(就像现实世界中的应用程序一样)，因此网络条件会影响结果。

所有测试都以发布模式运行(dotnet run -c Release)。我使用的是rtm分支.NET 8 [nightly build](https://devblogs.microsoft.com/dotnet/the-convenience-of-system-text-json/#:~:text=branch%20.NET%208-,nightly%20build,-.%20That%20means%20a)。这意味着构建将尽可能接近最终的.NET 8 GA构建(在撰写本文时)。

我在Ubuntu 22.04 x64机器上运行了大多数性能测试，.NET现在已经内置到Ubuntu中，但是这对测试没有帮助。

下面是使用每日版的模式:

```shell
rich@vancouver:~$ mkdir dotnet
rich@vancouver:~$ curl -LO https://aka.ms/dotnet/8.0.1xx/daily/dotnet-sdk-linux-x64.tar.gz
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
  0     0    0     0    0     0      0      0 --:--:-- --:--:-- --:--:--     0
100  204M  100  204M    0     0  61.7M      0  0:00:03  0:00:03 --:--:-- 70.9M
rich@vancouver:~$ tar -C dotnet/ -xf dotnet-sdk-linux-x64.tar.gz
rich@vancouver:~$ export PATH=~/dotnet:$PATH
rich@vancouver:~$ dotnet --version
8.0.100-rtm.23502.10
```

我的测试机器是Skylake时代的8核i7-6700。这并不新鲜，这意味着更新的机器应该产生更快的结果。

```shell
rich@vancouver:~$ cat /proc/cpuinfo | grep "model name" | head -n 1
model name  : Intel(R) Core(TM) i7-6700 CPU @ 3.40GHz
rich@vancouver:~$ cat /proc/cpuinfo | grep "model name" | wc -l
8
```

注意:这台机器是专用的无头测试机器，没有运行其他任何东西。我通过vscode.dev(tunnels)和Tailscale SSH的组合，从家里、微软园区或在路上远程访问它。我们真的被今天可用的巨大的远程开发选项宠坏了。

测试是通过有线以太网在家庭互联网上运行的。

## 结果评判

通过以下几个方面去评价测试结果：

- 代码数量
- 执行速度
- 内存使用

### 代码数量

我喜欢简单和平易近人的解决方案。代码行数是我们最好的代理度量。

![](https://raw.githubusercontent.com/eeee0717/chentaoImg/master/Json便利性1.png)

这些度量是针对整个应用的，包括为序列化器定义的类型。代码以惯用的方式编写，健康地使用了较新的(简洁的)语法。

这张图表清楚地说明了一个问题。JsonSerializer(两者)和JsonNode是最方便的api(基于行数)。如果您已经为要读写的JSON定义了类型，那么JsonSerializer是一个简单的选择。如今，通过引入记录类型，可以方便地快速创建一组类型来为JSON域建模。事实上，应用程序使用记录类型就是为了这个原因。否则，JsonSerializer和JsonNode之间的代码行差异就没有那么大的意义了。如果您喜欢使用自动序列化器或DOM API，这更多的是一个问题。我很乐意使用它们中的任何一个。

Utf8JsonReader API是我们的底层主力API。它实际上是JsonSerializer和JsonNode构建的基础。如果您希望对JSON文档的读取方式有更多的控制，例如跳过部分内容，那么这是一个很好的选择。该API假定您非常了解.NET和JSON类型系统，以及如何编写低级可靠的代码。

更高的行数是其直接结果。

JsonSerializer和JsonNode显然是默认选项，因为它们不需要太多代码来编写json驱动的算法。让我们看看是否有令人信服的理由在性能度量中考虑Utf8JsonReader，因为让某些东西工作的成本要高得多。

## 小文件测试

第一个性能测试使用一个从远程URL请求的[小测试文档](https://devblogs.microsoft.com/dotnet/the-convenience-of-system-text-json/#:~:text=test%20uses%20a-,small%20test%20document,-%2C%20requested%20from%20a)。

![](https://raw.githubusercontent.com/eeee0717/chentaoImg/master/Json便利性2.png)

这两个api打成了平手!这很令人震惊，对吧?所有这些api都非常好，但我们应该期待更多的区别。我的理论(这应该在接下来的分析中发挥作用)是，他们都在网络上消耗了大量的时间。

换句话说，CPU完全可以跟上网络的速度，而实现之间的任何差异都被主要的网络消耗所掩盖。

顺便说一句，我在Utf8JsonReader实现中添加了一些日志记录(以诊断我自己代码中的挑战);发现代码在网络上等待的时间比我想象的要长。毫不奇怪，现代cpu可以跑得比网络快(通常是不可靠的)。50ms的计算是很多的，特别是对于只有905字节的JSON。让我们尝试一些本地访问选项。

![](https://raw.githubusercontent.com/eeee0717/chentaoImg/master/Json便利性3.png)

OK。这些数字看起来好多了。我们现在得到了亚毫秒级的结果。澄清一下，我只是改变了数据的来源。这些实现都是基于Stream的，所以很容易从一个Stream生成器切换到另一个Stream生成器。

这两个数字仍然非常接近。我的理论是，这是因为这份文件太小了。

我为这个测试尝试了三种不同的本地选项，以便我们能够真正关注api的性能。

- 本地Web:从本地ASP读取JSON。. NET Core应用程序-通过http://localhost:5255 -在同一台机器上。
- Local File:从文件系统中读取JSON。
- 本地文件M1:相同，但在M1 Mac (Arm64)上运行。

前两个测试是在我的英特尔i7电脑上进行的。最后一个测试是在我的MacBook Air M1笔记本电脑上运行的(已接通电源)。

关键的收获是，当这些api忙于处理数据时，它们可以运行得非常快。这是远程和本地的有效差值。Apple M1的性能数据告诉我们，目前.NET在Arm64上的性能非常好。这些数字好得惊人。

Utf8JsonReader是怎么回事?它应该很快的，对吧?哈!等一下，等一下。

我尝试了一个中等大小的文档(9.41 kB)，没有发现明显的差异。

让我们使用Environment.WorkingSet查看小文档测试的内存使用情况。

![](https://raw.githubusercontent.com/eeee0717/chentaoImg/master/Json便利性4.png)

在这里，Newtonsoft.Json和其他的差距变得很大。让我们弄清楚这里发生了什么。System.Text.Json是在Newtonsoft之后十年左右建立的。Json和使用一套全新的平台api的好处是使高性能代码更容易编写，无论是速度还是内存使用。

特别是，System.Text.Json实现面向8位Unicode字符，而不是字符串和char类型的16位Unicode字符。这就是为什么阅读器被称为Utf8JsonReader。这意味着System.Text.Json能够以“半价”维护文档数据，直到JSON字符串数据需要具体化为UTF16 .NET字符串(如果需要的话)。

## 大文件测试

下一个性能测试使用一个更大的测试文档（1.17MB）。
![](https://raw.githubusercontent.com/eeee0717/chentaoImg/master/Json便利性5.png)
Wow!这是一个很大的区别。等等。为什么Utf8Reader在处理这么大的文档时性能会好得多?

简而言之，应用程序只需要文档的前1k的数据，我们的Utf8JsonReader实现能够最好地利用这一点。在这种情况下，我的应用程序(以及它处理的JSON)可能与您的不同。

该应用程序正在JSON文档中寻找.NET 6的第一个”security”:true的补丁版本。如果你熟悉我们的补丁版本，你就会知道我们发布了很多安全更新。这意味着最近的补丁版本很可能是一个安全版本，并且不需要读取1MB以上文档的大部分内容。

这种类型的数据非常适合手动序列化方法。

如果您有大型JSON文档，并且只需要读取其中的一小部分，那么这个发现可能与您相关。手动和自动序列化可以混合和匹配，但在某种程度上是有限的。我想为JsonSerializer提供一个Utf8JsonReader，并让它在大型JSON文档的某个中点返回`IAsyncEnumerable<MyObject>`。这在目前是不可能的。

让我们在本地再做一次相同的测试。

![](https://raw.githubusercontent.com/eeee0717/chentaoImg/master/Json便利性6.png)

这是我们真正看到System.Text.Json家族闪耀的地方。同样，这些api能够快速处理JSON数据，特别是当它接近时。

让我们看看内存使用情况。

![](https://raw.githubusercontent.com/eeee0717/chentaoImg/master/Json便利性7.png)

这些结果与我们在小文档中看到的情况大致相似，但是JsonNode似乎更受文档中目标数据的影响。

## 大文档——压力测试

我修改了文档，使最新的安全补丁的时间要早得多。我把它推迟了差不多两年，一直到6.0.1版本(与现在的6.0.20+相比)，看看它是如何改变结果的。这意味着Utf8JsonReader必须做更多的工作(一种相对压力测试)，可能与其他实现更相似。结果应该会显示出来。

![](https://raw.githubusercontent.com/eeee0717/chentaoImg/master/Json便利性8.png)

所有的实现都需要更长的时间，因为大多数JSON都需要读取。性能顺序仍然是相同的，但值要紧凑得多。

![](https://raw.githubusercontent.com/eeee0717/chentaoImg/master/Json便利性9.png)

这是本地的性能情况。这些值比前两个文档慢得多(出于说明的原因)，但是System.Text.Json实现能够快速处理兆字节的JSON。

## 结果总结

- 从这些数据中可以得出以下几点结论
- System.Text.Json的主要和一致的优点是更低的内存使用。
- JsonSerializer和Utf8JsonReader都是特定工作的好工具，然而，JsonSerializer在绝大多数情况下应该足够好。
- Newtonsoft.Json在速度上与System.Text.Json在互联网url上有竞争力(这两个api都可能在网络上等待)。当数据可以更快地提供时，System.Text.Json将始终获胜。

让我们进行更详细的分析。

## JsonSerializer

System.Text.Json.JsonSerializer是.NET提供的高级自动序列化解决方案。在最近的几个版本中，我们一直在使用配套的源代码生成器对其进行改进。JsonSerializer易于使用，而源生成器消除了反射的使用，这对于trimming和native AOT至关重要。

Implementations：

- [JsonSerializerBenchmark](https://github.com/richlander/convenience/blob/main/releasejson/releasejson/JsonSerializerBenchmark.cs)
- [JsonSerializerSourceGeneratorRecordBenchmark with source generation using records](https://github.com/richlander/convenience/blob/main/releasejson/releasejson/JsonSerializerSourceGeneratorRecordBenchmark.cs)
- [JsonSerializerSourceGeneratorPocoBenchmark with source generation using regular classes](https://github.com/richlander/convenience/blob/main/releasejson/releasejson/JsonSerializerSourceGeneratorPocoBenchmark.cs)

我用JsonSerializer编写了三个实现，以评估在使用和不使用源生成时是否存在显著的可接近性或效率差异。实际上并没有。

让我们看看这些数字告诉我们什么，在我的Apple M1机器上，用这个小文档。

![](https://raw.githubusercontent.com/eeee0717/chentaoImg/master/Json便利性10.png)

这是一个相当小的范围(对于每种测量类型)。我添加了string作为新的测量类型。它使JSON离API更近了一步，因为它是在基准测试运行之前加载到内存中的。

下面是更大的1MB以上的文档。

![](https://raw.githubusercontent.com/eeee0717/chentaoImg/master/Json便利性11.png)

我们再次看到，随着数据越来越接近，API的性能也越来越好。我们还看到源生成器提供了一些优势，但不是很多。

让我们来看看代码。

顶层方法非常紧凑。

```cs
public static async Task<int> MakeReportWebAsync(string url)
{
    using HttpClient httpClient= new();
    MajorRelease release = await httpClient.GetFromJsonAsync<MajorRelease>(url, _options) ?? throw new Exception(Error.BADJSON);
    Report report = new(DateTime.Today.ToShortDateString(), [ GetVersion(release) ]);
    string reportJson =  JsonSerializer.Serialize(report, _options);
    WriteJsonToConsole(reportJson);
    return reportJson.Length;
}
```

有三个方面需要指出，使这个实现方便使用

- HttpClient上的GetFromJsonAsync扩展方法为web请求和反序列化提供了一个很好的一行代码。MajorRelease类型通过泛型方法提供，作为JSON反序列化过程返回的对象类型。
- ??在网络调用返回空响应的情况下，空合并操作符是一种“最后手段”选项，可以很好地处理非空引用类型。
- GetVersion方法产生一个Version对象，该对象通过Report (record)构造函数中的集合表达式添加到隐式`List<Version>`中。

深入到实现中，您会发现一个迭代器方法(包括yield return)。我认为迭代器方法是“`prigrammable IEnumerable<T> machines`”，事实上它们就是这样。我喜欢使用它们，因为它们提供了一个很好的API，同时允许我从更集中的方法中卸载一堆杂乱的东西。

下面的迭代器方法在这个实现中做了大量的工作。它为遵从性报告查找第一个和第一个补丁版本。

```cs
// Get first and first security release
public static IEnumerable<ReportJson.PatchRelease> GetReleases(MajorRelease majorRelease)
{
    bool securityOnly = false;

    foreach (ReleaseJson.Release release in majorRelease.Releases)
    {
        if (securityOnly && !release.Security)
        {
            continue;
        }

        yield return new(release.ReleaseDate, GetDaysAgo(release.ReleaseDate, true), release.ReleaseVersion, release.Security, release.CveList);

        if (release.Security)
        {
            yield break;
        }
        else if (!securityOnly)
        {
            securityOnly = true;
        }
    }

    yield break;
}
```

GetVersion表达式体方法调用GetRelease迭代器方法上的ToList，以创建`List<Release>`作为Version记录实例化的一部分。

```cs
public static MajorVersion GetVersion(MajorRelease release) =>
    new(release.ChannelVersion,
        release.SupportPhase is "active" or "maintainence",
        release.EolDate ?? "",
        release.EolDate is null ? 0 : GetDaysAgo(release.EolDate),
        GetReleases(release).ToList()
        );
```

这几乎是整个实现。GetDaysAgo方法和记录定义是您需要查看实现才能看到的仅有的其他部分。

源代码生成很容易启用。唯一的区别是，对序列化器的两次调用包括来自*Context*类型的静态属性值，这些值来自两个部分类声明。就是这样!

```cs
public static async Task<int> MakeReportWebAsync(string url)
{
    using HttpClient httpClient= new();
    var release = await httpClient.GetFromJsonAsync(url, ReleaseRecordContext.Default.MajorRelease) ?? throw new Exception(Error.BADJSON);
    Report report = new(DateTime.Today.ToShortDateString(), [ GetVersion(release) ]);
    string reportJson = JsonSerializer.Serialize(report, ReportRecordContext.Default.Report);
    WriteJsonToConsole(reportJson);
    return reportJson.Length;
}

[JsonSourceGenerationOptions(PropertyNamingPolicy = JsonKnownNamingPolicy.KebabCaseLower)]
[JsonSerializable(typeof(MajorRelease))]
public partial class ReleaseRecordContext : JsonSerializerContext
{
}

[JsonSourceGenerationOptions(PropertyNamingPolicy = JsonKnownNamingPolicy.KebabCaseLower)]
[JsonSerializable(typeof(Report))]
public partial class ReportRecordContext : JsonSerializerContext
{
}
```

您可以看到，我选择使用JsonKnownNamingPolicy.KebabCaseLower，因为它与release.json模式匹配。在我看来，使用源代码生成来指定JsonSerializerOptions比不使用更方便。

> JsonSerializer使代码非常紧凑，易于理解。序列化器非常高效。这是读取和写入JSON文档的默认选项。

## Json.NET

Json.NET JsonSerializer在性能方面与System.Text.Json非常相似。事实上，System.Text.Json是基于Newtonsoft.Json建模的，所以这应该不足为奇。

Implementation:

- [NewtonsoftJsonSerializerBenchmark](https://github.com/richlander/convenience/blob/main/releasejson/releasejson/NewtonsoftJsonSerializerBenchmark.cs)

实现的主要部分也非常紧凑。它几乎与前面的代码相同，除了没有一个方便的HttpClient扩展方法。

```cs
public static async Task<int> MakeReportWebAsync(string url)
{
    // Make network call
    using var httpClient = new HttpClient();
    using var releaseMessage = await httpClient.GetAsync(url, HttpCompletionOption.ResponseHeadersRead);
    using var stream = await releaseMessage.Content.ReadAsStreamAsync();

    // Attach stream to serializer
    JsonSerializer serializer = new();
    using StreamReader sr = new(stream);
    using JsonReader reader = new JsonTextReader(sr);

    // Process JSON
    MajorRelease release = serializer.Deserialize<MajorRelease>(reader) ?? throw new Exception(Error.BADJSON);
    Report report = new(DateTime.Today.ToShortDateString(), [ GetVersion(release) ]);
    string reportJson = JsonConvert.SerializeObject(report);
    WriteJsonToConsole(reportJson);
    return reportJson.Length;
}
```

没有太多额外的分析要提供。从编码的角度来看，至少对于这个应用程序来说，它与System.Text.Json版本(足够)相同。实现中的其余代码实际上是相同的，所以不需要再看一遍。

此代码有几个using语句，用于确保在方法退出后正确处置资源。有时你可以不这样做，但这是很好的练习。

我们应该快速看一下httpClient.GetAsync(JsonBenchmark.Url, HttpCompletionOption.ResponseHeadersRead)。它会出现在所有剩下的例子中。HttpCompletionOption.ResponseHeadersRead enum值告诉HttpClient只急切地读取响应中的HTTP头，然后等待读取器(在本例中为JsonSerializer)从服务器请求更多的字节，因为它可以读取它们。这种模式对于避免内存峰值非常重要。

Json.NET不提供源代码生成器选项。因此，它也不兼容trimming和native AOT。

> Json.NET JsonSerializer是一个优秀的JSON实现，多年来一直为数百万.NET开发人员提供良好的服务。如果你对它感到满意，你应该继续使用它。

## JsonNode

JsonNode是一个典型的文档对象模型API，它既为JSON类型系统(分别使用JsonObject、JsonArray和JsonValue来表示JSON对象、数组和基本值)提供了一个替代API，又尽可能地与.NET类型系统集成(JsonArray是一个IEnumerable)。大多数API都是面向字典键值样式语法。

Implementation:

- [JsonNodeBenchmark](https://github.com/richlander/convenience/blob/main/releasejson/releasejson/JsonNodeBenchmark.cs)

这种编码模式是完全不同的。它看起来是代码的三倍，但那是因为我选择在primary方法中包含更多的实际实现。考虑到DOM范例，我认为这是有意义的。

实际上，这段代码非常紧凑，因为我们自己开始做大量的序列化工作。它也很容易阅读，特别是使用嵌套的报告代码。

```cs
public static async Task<int> MakeReportAsync(string url)
{
    // Make network call
    var httpClient = new HttpClient();
    using var responseMessage = await httpClient.GetAsync(url, HttpCompletionOption.ResponseHeadersRead);
    var stream = await responseMessage.Content.ReadAsStreamAsync();

    // Parse Json from stream
    var doc = await JsonNode.ParseAsync(stream) ?? throw new Exception(Error.BADJSON);
    var version = doc["channel-version"]?.ToString() ?? "";
    var supported = doc["support-phase"]?.ToString() is "active" or "maintenance";
    var eolDate = doc["eol-date"]?.ToString() ??  "";
    var releases = doc["releases"]?.AsArray() ?? [];

    // Generate report
    var report = new JsonObject()
    {
        ["report-date"] = DateTime.Now.ToShortDateString(),
        ["versions"] = new JsonArray()
        {
            new JsonObject()
            {
                ["version"] = version,
                ["supported"] = supported,
                ["eol-date"] = eolDate,
                ["support-ends-in-days"] = eolDate is null ? null : GetDaysAgo(eolDate, true),
                ["releases"] = GetReportForReleases(releases),
            }
        }
    };

    // Generate JSON
    string reportJson = report.ToJsonString(_options);
    WriteJsonToConsole(reportJson);
    return reportJson.Length;
}
```

代码的其余部分具有大致相同的模式。GetReportForReleases主要是对doc["releases"]的查询。如前所述，JsonArray公开了一个`IEnumerable<JsonNode>`，这使得它可以很自然地与惯用的C#语法集成。您可以轻松地将LINQ与JsonArray一起使用。

在这个实现中有几个亮点需要指出

- JsonNode与HttpClient的集成方式与JsonSerializer不同，但这并不重要。JsonNode。ParseAsync很乐意接受来自HttpClient的流，并且没有对JsonNode有意义的一行代码。
- DOM API可以从键值请求返回null，就像从doc["not-a-propertyname-in-this-schema"]。
- 使用JsonNode生成JSON是令人愉快的，因为你可以使用类型和c#表达式，同时可视化嵌套模式，几乎看起来像JSON。

> 如果您喜欢DOM访问模式或无法生成使用序列化器所需的类型，JsonNode是一个很好的API。如果您想要最快的路径以编程方式读取和写入JSON，这是您的默认选择。

> 如果您想要读取、操作和编写JSON文档，那么它非常适合。对于JSON文本的只读查询，您可能需要考虑使用更快的JsonDocument。

## Utf8JsonReader

Utf8JsonReader是我们的“手动模式”解决方案。如果你准备好了，有很多功能和功能可供选择。就像我之前说的，更高级的System.Text.Json api是建立在这种类型之上的，所以很明显，你可以用它来构建非常有用的JSON处理算法。

Implementations:

- [Utf8JsonReaderWriterStreamBenchmark](https://github.com/richlander/convenience/blob/main/releasejson/releasejson/Utf8JsonReaderWriterStreamBenchmark.cs)
- [Utf8JsonReaderWriterPipelineBenchmark](https://github.com/richlander/convenience/blob/main/releasejson/releasejson/Utf8JsonReaderWriterPipelineBenchmark.cs)
- [Utf8JsonReaderWriterStreamRawBenchmark](https://github.com/richlander/convenience/blob/main/releasejson/releasejson/Utf8JsonReaderWriterStreamRawBenchmark.cs)

同样，我写了一些不同的实现。前两个是相同的，除了一个使用Stream，另一个使用Pipelines。它们都将JSON反序列化为真实对象，就像序列化器所做的那样。然后将对象交给一些JSON编写器代码，这些代码将这些对象序列化为JSON，就像序列化器所做的那样。

我非常喜欢这种方法，感觉非常自然(对于低级代码)。当我下次需要对JSON处理进行更多控制时，我将使用这种方法。回想起来，我本可以使用JsonSerializer将序列化器作为该方法的一部分。至少将[JsonSerializer.Deserialize](https://learn.microsoft.com/dotnet/api/system.text.json.jsonserializer.deserialize)(通过Utf8JsonReader)作为测试。

Pipelines提供了比流更高级别的API，这使得缓冲区管理更容易实现。Stream代码需要比我喜欢处理的更小心一点的处理。

第三种实现将UTF8数据直接从读取器复制到写入器，而不创建中间对象。这种方法更有效，因此行数明显更低。

然而，代码没有分层，我怀疑这会损害维护。我不太可能回到这种模式。

这些实现非常不同，我们应该再次查看这三种方法的结果，使用JsonSerializer作为基线。

![](https://raw.githubusercontent.com/eeee0717/chentaoImg/master/Json便利性12.png)

JsonSerializer实现领先于其他Utf8JsonReader实现。JsonSerializer实现仍然是编写简单代码的一个很好的基准。

让我们看看这三种实现的性能。

![](https://raw.githubusercontent.com/eeee0717/chentaoImg/master/Json便利性13.png)

这些都是通过从MacBook M1的本地文件系统读取大型JSON文档来测量的。JsonSerializer方法始终更快(不仅仅是在这个特定的基准测试中)。

为了降低内存使用，不这样做是可能的，但我没有研究这个问题。

这种编码模式(来自第一个实现)又有所不同，具有更复杂的主题和技术，尽管许多低级API的使用隐藏在// Process JSON部分的类型实现中。

```cs
public static async Task<int> MakeReportWebAsync(string url)
{
    // Make network call
    using var httpClient = new HttpClient();
    using var releaseMessage = await httpClient.GetAsync(url, HttpCompletionOption.ResponseHeadersRead);
    releaseMessage.EnsureSuccessStatusCode();
    using var jsonStream = await releaseMessage.Content.ReadAsStreamAsync();

    // Acquire byte[] as a buffer for the Stream
    byte[] rentedArray = ArrayPool<byte>.Shared.Rent(JsonStreamReader.Size);
    int read = await jsonStream.ReadAsync(rentedArray);

    // Process JSON
    var releasesReader = new ReleasesJsonReader(new(jsonStream, rentedArray, read));
    var memory = new MemoryStream();
    var reportWriter = new ReportJsonWriter(releasesReader, memory);
    await reportWriter.Write();
    ArrayPool<byte>.Shared.Return(rentedArray);

    // Flush stream and prepare for reader
    memory.Flush();
    memory.Position= 0;

    WriteJsonToConsole(memory);
    return (int)memory.Length;
}
```

这里有一些值得注意的亮点。

ArrayPool是一种重用数组的模式，它大大减少了垃圾收集器的工作。如果您需要反复读取JSON文件(例如在每个web请求或性能测量中)，这是一个很好的选择。

我必须为Utf8JsonReader的JSON处理构建一个小框架。我在Utf8JsonReader之上写了一个通用的JsonStreamReader，然后在此之上写了一个模式特定的ReleasesJsonReader。我用JsonPipelineReader对pipeline实现做了同样的事情。这种方法和结构使代码更容易编写。

最后的结果是JSON，写入内存流。该流需要刷新并重置其位置，以便读取器读取。

ReportJsonWriter显示了整个代码的流程。

```cs
public async Task Write()
{
    _writer.WriteStartObject();
    _writer.WriteString("report-date"u8, DateTime.Now.ToShortDateString());
    _writer.WriteStartArray("versions"u8);

    var version = await _reader.GetVersionAsync();
    WriteVersionObject(version);
    _writer.WritePropertyName("releases"u8);
    // Start releases
    _writer.WriteStartArray();

    await foreach (var release in _reader.GetReleasesAsync())
    {
        WriteReleaseObject(release);
    }

    // End releases
    _writer.WriteEndArray();

    // End JSON document
    _writer.WriteEndObject();
    _writer.WriteEndArray();
    _writer.WriteEndObject();

    // Write content
    _writer.Flush();
}
```

\_writer (Utf8JsonWriter)将JSON写入MemoryStream，而\_reader (ReleasesJsonReader)公开用于从源JSON中读取对象的api。ReleasesJsonReader是一个仅向前的JSON阅读器，因此api只能按特定顺序调用(否则会抛出)。ParseState枚举用于通过文档记录处理状态。

最有趣的部分是ReleasesJsonReader api是异步的，然而Utf8JsonReader不支持在异步方法中使用，因为它是一个ref struct。下面的代码块很好地展示了在异步工作流中使用Utf8JsonReader的模式，以及Utf8JsonReader代码的一般外观。

```cs
private async IAsyncEnumerable<Cve> GetCvesAsync()
{
    while (!_json.ReadToTokenType(JsonTokenType.EndArray, false))
    {
        await _json.AdvanceAsync();
    }

    while(GetCve(out Cve? cve))
    {
        yield return cve;
    }

    yield break;
}

private bool GetCve([NotNullWhen(returnValue:true)] out Cve? cve)
{
    string? cveId = null;
    cve = null;

    var reader = _json.GetReader();

    while (true)
    {
        reader.Read();

        if (reader.TokenType is JsonTokenType.EndArray)
        {
            return false;
        }
        else if (!reader.IsProperty())
        {
            continue;
        }
        else if (reader.ValueTextEquals("cve-id"u8))
        {
            reader.Read();
            cveId = reader.GetString();
        }
        else if (reader.ValueTextEquals("cve-url"u8))
        {
            reader.Read();
            var cveUrl = reader.GetString();

            if (string.IsNullOrEmpty(cveUrl) ||
                string.IsNullOrEmpty(cveId))
            {
                throw new Exception(BenchmarkData.BADJSON);
            }

            cve = new Cve(cveId, cveUrl);
            reader.Read();
            _json.UpdateState(reader);
            return true;
        }

    }
}
```

我将分享这两个方法之间的重点：

- GetCvesAsync是一个异步迭代器风格的方法。如前所述，我尽可能使用迭代器方法。你可以在`IAsyncEnumerable<T>`中使用它们，就像`IEnumerable<T>`一样。
- 该方法首先调用JsonStreamReader.ReadToTokenType。这要求底层的JsonStreamReader读取JsonTokenType.EndArray令牌(cve-list数组的末尾)在缓冲区内。如果没有，那么调用JsonStreamReader.AdvanceAsync来刷新缓冲区。
- false参数表示在ReadToTokenType操作完成后不应该更新底层读取器状态。此模式对JSON内容进行双重读取，以确保可以到达cve-list的末尾，并且每个Utf8Json.Read调用GetCve方法将返回true。重复阅读可能听起来很糟糕，但这比其他模式要好。此外，这段代码更多地受网络而不是cpu的限制(正如我们在性能数据中观察到的那样)。
- GetCve不是一个异步方法，所以我们可以自由地使用Utf8JsonReader。
- 我们需要做的第一件事是从先前保存的状态中获取一个新的Utf8JsonReader。
- 该方法的其余部分是一个状态机，用于处理cve-list内容，该内容是一个具有两个属性的JSON对象数组。
- UTF8字符串字面值(如“cve-id”u8)是在整个代码库中使用的非常有用的模式。堆栈分配的UTF8字符串被暴露为`ReadOnlySpan<byte>`，这对于比较Utf8JsonReader暴露的UTF8值是完美的。
- JsonStreamReader.UpdateState保存Utf8JsonReader的状态，以便在下次需要时重新创建它。同样，读取器不能存储在某些实例字段中，因为它是一个ref struct。
- 当out值可以被信任为非空时，[NotNullWhen(returnValue:true)]是一个有用的通信属性。

为什么所有这些都集中在ref struct上，为什么团队会做出这样的设计选择?Utf8JsonReader在整个实现过程中普遍使用`ReadOnlySpan<T>`，这有避免复制JSON数据的(很大)好处。`ReadOnlySpan<T>`是一个ref struct，因此Utf8JsonReader也必须是。例如，来自Utf8JsonRead.ValueSpan的JSON字符串是一个低成本的`ReadOnlySpan<byte>`，指向程序开始时创建的rentedArray缓冲区。这种设计选择在使用时需要一点额外的注意，但它所提供的性能价值是值得的。此外，对于JsonSerializer和JsonNode用户来说，这种额外的复杂性是隐藏的。只有直接使用Utf8JsonReader的开发人员才需要关心。

需要明确的是，使用`ReadOnlySpan<T>`并不强制类型成为一个重构。发生这种情况的那一行是当您需要将ref struct存储为(通常是私有的)字段时。Utf8JsonReader就是这样做的，因此要进行重构。

最后，编写器代码如下所示。

```cs
public void WriteVersionObject(Version version)
{
    _writer.WriteStartObject();
    _writer.WritePropertyName("version"u8);
    _writer.WriteStringValue(version.MajorVersion);
    _writer.WritePropertyName("supported"u8);
    _writer.WriteBooleanValue(version.Supported);
    _writer.WritePropertyName("eol-date"u8);
    _writer.WriteStringValue(version.EolDate);
    _writer.WritePropertyName("support-ends-in-days"u8);
    _writer.WriteNumberValue(version.SupportEndsInDays);
}
```

这段代码正在编写基本的JSON内容，并利用UTF8字符串字面值(用于属性名)来高效地完成这一工作。

代码库的其余部分遵循这些相同的模式。

我跳过了JsonStreamReader是如何实现的。它包括一组ReadTo方法，如ReadToTokenType和缓冲区管理。这确实很有趣，但我还是把它留给大家自己去读吧。这是一种感觉应该在库中提供给人们简单依赖的类型。JsonPipeReader也是一样。如果您想使用pipelines，请查看[dotnet/runtime #87984](https://github.com/dotnet/runtime/issues/87984)。

> Utf8JsonReader是一个功能强大的API, System.Text.Json栈的其余部分是建立在它之上的。在某些情况下，它是最好的选择，因为它提供了最大的灵活性。它需要更高水平的技能来导航与低级api和概念的交互。如果你有需求和技能，这种类型可以实现。

## Summary

这篇文章的目的是演示System.Text.Json为每个开发人员和场景提供JSON读写api。从编码模式和可实现的性能两方面来看，这些api涵盖了易于控制的范围。

这篇文章的重点是，JsonSerializer提供了出色的性能，并且在我测试的所有场景中都具有竞争力。这是一个很好的结果。

正如我所提到的，System.Text.Json是一个相对较新的API，是作为.NET Core项目的一部分创建的。它很好地展示了一个完全集成的平台设计方法可以为可用性和性能带来很多好处。

Newtonsoft.Json仍然是一个很好的选择。正如我在帖子中所说的，如果它对你有效，那就继续使用它。
