---
title: 深入理解C#事件与委托
date: 2023-10-12T16:00:00.000+00:00
lang: zh
duration: 20min
type: blog
---

[原文链接](https://csharpindepth.com/Articles/Events)

## 委托与事件

人们常常发现很难区分事件和代表之间的区别。 C# 允许您声明类似字段的事件，这些事件由同名的委托变量自动支持，这对解决问题没有帮助。

本文旨在为您澄清这个问题。另一个造成混淆的原因是「委托」一词的过多使用。有时它用于表示委托类型，有时它可用于表示委托类型的实例。我将使用“委托类型”和“委托实例”来区分它们，并在一般意义上谈论整个主题时使用「委托」。

## 委托类型

在某些方面，您可以将委托类型视为有点像具有单个方法的接口。它指定方法的签名，当您有委托实例时，您可以调用它，就好像它是具有相同签名的方法一样。

委托提供了其他功能，但使用特定签名进行调用的能力是委托概念存在的原因。

委托保存对方法的引用，以及对目标对象（调用该方法）的引用。

委托类型使用 `delegate` 关键字声明。它们可以单独出现，也可以嵌套在一个类中，如下所示。

```cs
namespace DelegateArticle
{
    public delegate string FirstDelegate (int x);

    public class Sample
    {
        public delegate void SecondDelegate (char a, char b);
    }
}
```

此代码声明了两种委托类型。第一个是 `DelegateArticle.FirstDelegate` ，它有一个 `int` 类型的参数并返回 `string` 。第二个是 `DelegateArticle.Sample.SecondDelegate` ，它有两个 `char` 参数，并且不返回任何内容（因为返回类型被指定为 `void` ）。

> 请注意， `delegate` 关键字并不总是意味着正在声明委托类型。使用匿名方法创建委托类型的实例时，会使用相同的关键字。

此处声明的类型派生自 `System.MulticastDelegate` ，而 `System.MulticastDelegate` 又派生自 `System.Delegate` 。实际上，您只会看到派生自 `MulticastDelegate` 的委托类型。 `Delegate` 和 `MulticastDelegate` 之间的差异很大程度上是历史性的；在 .NET 1.0 的测试版中，差异非常显着（而且很烦人） - Microsoft 考虑将这两种类型合并在一起，但认为在发布周期中进行如此重大的更改为时已晚。

你几乎可以假装它们只是一种类型。

您创建的任何委托类型都具有从其父类型继承的成员、一个带有 `object` 和 `IntPtr` 参数的构造函数以及三个额外方法： `Invoke` 、 `BeginInvoke` 和 `EndInvoke` 。我们稍后会回到构造函数。这些方法不能从任何东西继承，因为签名根据声明委托的签名而变化。使用上面的示例代码，第一个委托具有以下方法：

```cs
public string Invoke (int x);
public System.IAsyncResult BeginInvoke(int x, System.AsyncCallback callback, object state);
public string EndInvoke(IAsyncResult result);
```

正如您所看到的， `Invoke` 和 `EndInvoke` 的返回类型与声明签名的返回类型匹配， `Invoke` 的参数和 。我们将在下一节中了解 `Invoke` 的用途，并在高级用法部分中介绍 `BeginInvoke` 和 `EndInvoke` 。然而，当我们不知道如何创建实例时，谈论调用方法还为时过早。我们将在下一节中介绍这一点（以及更多内容）。

## 委托实例：基础知识

现在我们知道了委托类型是如何声明的以及它包含什么，让我们看看如何创建此类类型的实例以及我们可以用它做什么。

### 创建委托实例

> 注意：本文不介绍 C# 2.0 和 3.0 用于创建委托实例的功能，也不介绍 C# 4.0 中引入的通用委托变体。我关于闭包的文章讨论了 C# 2.0 和 3.0 的功能 - 或者，请阅读 C# 深入研究的第 5、9 和 13 章以获取更多详细信息。通过专注于 C# 1.0/1.1 中创建实例的显式方式，我相信会更容易理解幕后发生的事情。

当您了解基础知识时，显然值得了解这些后续版本提供的功能 - 但如果您在没有牢牢掌握基础知识的情况下尝试使用它们，您很可能会感到困惑。

如前所述，任何特定委托实例中的数据关键点是委托引用的方法以及调用该方法的引用（目标）。对于静态方法，不需要目标。

CLR 本身支持其他略有不同的委托形式，其中传递给静态方法的第一个参数保存在委托内，或者在调用方法时提供实例方法的目标作为参数。如果您有兴趣，请参阅 `System.Delegate` 的文档以获取更多信息，但不要太担心。

那么，现在我们知道创建实例所需的两条数据（当然还有类型本身），我们如何告诉编译器它们是什么？我们使用 C# 规范中所谓的委托创建表达式，其形式为 `new delegate-type (expression)` 。该表达式必须是相同类型的另一个委托（或 C# 2.0 中的兼容委托类型）或方法组 - 方法的名称和可选的目标，指定为就像调用该方法一样，但没有参数或括号。创建委托的副本相当罕见，因此我们将专注于更常见的形式。下面列出了一些示例：

```cs
//下面两个创建表达式是等价的:
//其中InstanceMethod是类中的实例方法
//包含创建表达式(或基类)。
//目标是"this"。
FirstDelegate d1 = new FirstDelegate(InstanceMethod);
FirstDelegate d2 = new FirstDelegate(this.InstanceMethod);

//这里我们创建了一个引用相同方法的委托实例
//和前两个例子一样，但是目标不同。
FirstDelegate d3 = new FirstDelegate(anotherInstance.InstanceMethod);

//这个委托实例使用另一个类中的实例方法，
//指定要调用该方法的目标
FirstDelegate d4 = new FirstDelegate(instanceOfOtherClass.OtherInstanceMethod);

//此委托实例在类中使用静态方法
//创建表达式(或基类)。
FirstDelegate d5 = new FirstDelegate(StaticMethod);

//这个委托实例在另一个类中使用静态方法
FirstDelegate d6 = new FirstDelegate(OtherClass.OtherStaticMethod);
```

我们之前提到的构造函数有两个参数 - `object` 和 `IntPtr` 。 `object` 是对目标的引用（或静态方法的 `null` ）， `IntPtr` 是指向方法本身的指针。

需要注意的一点是，委托实例可以引用在实际调用时通常不可见的方法和目标。

例如，可以使用私有方法创建委托实例，然后可以从公共成员返回该委托实例。或者，实例的目标可能是最终调用者一无所知的对象。

但是，目标和方法都必须可供创建代码访问。换句话说，如果（且仅当）您可以对特定对象调用特定方法，您就可以使用该方法和目标来创建委托。访问权限在调用时实际上被忽略。说到这...

### 调用委托实例

调用委托实例就像调用方法本身一样。例如，要调用上面变量 `d1` 引用的委托，我们可以编写：

```cs
string result = d1(10);
```

在目标对象（如果有）上调用委托实例引用的方法，并返回结果。生成一个完整的程序来演示这一点而不包含大量看似不相关的代码是很棘手的。

然而，这里有一个程序，它给出了一个静态方法的示例和一个实例方法的示例。 `DelegateTest.StaticMethod` 可以写成 `StaticMethod` ，就像（在实例方法中）您可以写 `InstanceMethod` 而不是 `this.InstanceMethod` -我添加类名只是为了让您清楚如何引用其他类的方法。

```cs
using System;

public delegate string FirstDelegate (int x);

class DelegateTest
{
    string name;

    static void Main()
    {
        FirstDelegate d1 = new FirstDelegate(DelegateTest.StaticMethod);

        DelegateTest instance = new DelegateTest();
        instance.name = "My instance";
        FirstDelegate d2 = new FirstDelegate(instance.InstanceMethod);

        Console.WriteLine (d1(10)); // Writes out "Static method: 10"
        Console.WriteLine (d2(5));  // Writes out "My instance: 5"
    }

    static string StaticMethod (int i)
    {
        return string.Format ("Static method: {0}", i);
    }

    string InstanceMethod (int i)
    {
        return string.Format ("{0}: {1}", name, i);
    }
}
```

> C# 语法只是调用每个委托类型提供的 `Invoke` 方法的简写。如果委托提供 `BeginInvoke` / `EndInvoke` 方法，也可以异步运行。这些稍后会解释。

### 合并委托

可以组合委托，这样当您调用委托时，就会调用整个方法列表 - 可能具有不同的目标。当我之前说过委托包含一个目标和一个方法时，这是一个轻微的简化。

这就是代表一个方法的委托实例所包含的内容。为了清楚起见，我将此类委托实例称为简单委托。另一种方法是委托实例，它实际上是简单委托的列表，所有委托都具有相同的类型（即具有相同的签名）。我将召集这些联合代表。组合代表本身可以组合在一起，以明显的方式有效地创建一个简单代表的大列表。

重要的是要理解委托实例始终是不可变的。任何将它们组合在一起（或将其中一个从另一个中分离出来）的东西都会创建一个新的委托实例来表示要调用的新目标/方法列表。这就像字符串一样：例如，如果您调用 `String.PadLeft` ，它实际上不会更改您调用它的字符串 - 它只是返回一个具有适当填充的新字符串。

通常使用加法运算符组合两个委托实例，就好像委托实例是字符串或数字一样。一个与另一个相减通常使用减法运算符来完成。

> 请注意，当您从一个组合委托中减去另一个组合委托时，减法将按照列表进行。如果在原始列表中找不到要减去的列表，则结果只是原始列表。否则，列表中最后出现的位置将被删除。通过一些例子可以很好地说明这一点。下面使用简单委托列表 `d1` 、 `d2` 等代替实际代码。例如， `[d1, d2, d3]` 是一个组合委托，在执行时会调用 `d1` 然后 `d2` 然后 `d3` 。空列表由 `null` 表示，而不是实际的委托实例。

|       **Expression表达**        |          **Result 结果**          |
| :-----------------------------: | :-------------------------------: |
|         null + d1 空+d1         |                d1                 |
|        d1 + null d1 + 空        |                d1                 |
|             d1 + d2             |         [d1, d2] [d1，d2]         |
|          d1 + [d2, d3]          |     [d1, d2, d3] [d1、d2、d3]     |
|       [d1, d2] + [d2, d3]       | [d1, d2, d2, d3] [d1、d2、d2、d3] |
|          [d1, d2] - d1          |                d2                 |
|          [d1, d2] - d2          |                d1                 |
|        [d1, d2, d1] - d1        |         [d1, d2] [d1，d2]         |
|     [d1, d2, d3] - [d1, d2]     |                d3                 |
|     [d1, d2, d3] - [d2, d1]     |     [d1, d2, d3] [d1、d2、d3]     |
| [d1, d2, d3, d1, d2] - [d1, d2] |     [d1, d2, d3] [d1、d2、d3]     |
|       [d1, d2] - [d1, d2]       |            null 无效的            |

委托实例还可以与静态 `Delegate.Combine` 方法组合，并且可以使用静态 `Delegate.Remove` 方法将一个实例从另一个实例中减去。 C# 编译器将加法和减法运算符转换为对这些方法的调用。因为它们是静态方法，所以它们可以轻松地使用 `null` 引用。

加法和减法运算符始终作为赋值的一部分： `d1 += d2;` 与 `d1 = d1+d2;` 完全相同，对于减法也是如此。同样，原始委托实例保持不变； `d1` 的值只是更改为对适当的新组合委托的引用。

请注意，由于额外的委托都会添加到列表末尾或从列表末尾删除，因此 `x += y; x -= y;` 始终是无操作。

如果声明委托类型返回一个值（即未使用 `void` 返回类型声明）并且调用组合委托实例，则从该调用返回的值是最后一个简单委托返回的值在列表中。

## 事件

首先，事件不是委托实例。让我们再重复一次。

> **事件不是委托实例。**

从某些方面来说不幸的是，C# 允许您在某些情况下以相同的方式使用它们，但理解其中的差异非常重要。

我发现理解事件的最简单方法是将它们视为属性。虽然属性看起来像是字段，但它们绝对不是 - 并且您可以编写根本不使用字段的属性。同样，虽然就表达添加和删除操作的方式而言，事件看起来像委托实例，但事实并非如此。

事件是成对的方法，在 IL 中进行了适当的修饰，将它们连接在一起，并让语言知道这些方法代表事件。这些方法对应于添加和删除操作，每个操作都采用相同类型（事件的类型）的委托实例参数。您对这些操作的执行方式很大程度上取决于您，但典型用途是从事件处理程序列表中添加或删除委托。当事件被触发时（无论触发是什么 - 按钮单击、超时、未处理的异常），处理程序将依次调用。

请注意，在 C# 中，事件处理程序的调用不是事件本身的一部分。 （CIL 定义了与 `raise__eventName_` 方法以及实际上“其他”方法的关联，但这些方法在 C# 中不使用。）

在 C# 中，分别使用 `eventName += delegateInstance;` 和 `eventName -= delegateInstance;` 调用添加和删除方法，其中 `eventName` 可以使用引用进行限定（例如 `myForm.Click` ）或类型名称（例如 `MyClass.SomeEvent` ）。静态事件相对较少。

事件本身可以通过两种方式声明。第一种是显式添加和删除方法，其声明方式与属性非常相似，但使用 `event` 关键字。下面是 `System.EventHandler` 委托类型的事件示例。请注意，它实际上并不对传递给添加和删除方法的委托实例执行任何操作 - 它只是打印出调用了哪个操作。请注意，即使我们告诉它删除 `null` ，删除操作也会被调用。

```cs
using System;

class Test
{
    public event EventHandler MyEvent
    {
        add
        {
            Console.WriteLine ("add operation");
        }

        remove
        {
            Console.WriteLine ("remove operation");
        }
    }

    static void Main()
    {
        Test t = new Test();

        t.MyEvent += new EventHandler (t.DoNothing);
        t.MyEvent -= null;
    }

    void DoNothing (object sender, EventArgs e)
    {
    }
}
```

虽然以这种方式忽略该值的情况很少见，但有时您不想使用简单的委托变量来支持事件。

例如，在存在大量事件但只有少数事件可能被订阅的情况下，您可以拥有从描述事件的某个键到当前处理该事件的委托的映射。

这就是 Windows 窗体所做的 - 这意味着您可以拥有大量事件，而不会浪费大量内存来使用通常只有 `null` 值的变量。

## 捷径：类似字段的事件

C# 提供了一种同时声明委托变量和事件的简单方法。这称为类似字段的事件，并且声明非常简单 - 它与“普通”事件声明相同，但没有“主体”部分：

```cs
public event EventHandler MyEvent;
```

这将创建一个委托变量和一个事件，两者具有相同的类型。对事件的访问由事件声明决定（例如，上面的示例创建了一个公共事件），但委托变量始终是私有的。

事件的隐式主体是向委托变量添加/删除委托实例的明显过程，但更改是在锁内进行的。对于 C# 1.1，该事件相当于：

```cs
private EventHandler _myEvent;

public event EventHandler MyEvent
{
    add
    {
        lock (this)
        {
            _myEvent += value;
        }
    }
    remove
    {
        lock (this)
        {
            _myEvent -= value;
        }
    }
}
```

这是针对实例成员的。对于声明为静态的事件，该变量也是静态的，并且在 `typeof(XXX)` 上获取锁，其中 `XXX` 是声明该事件的类的名称。

在 C# 2.0 中，对于用于锁定的内容几乎没有任何保证 - 只有与实例关联的单个对象用于锁定实例事件，而与类关联的单个对象用于锁定静态事件。

（请注意，这仅适用于类事件，不适用于结构事件 - 在锁定结构事件方面存在问题；实际上，我不记得曾经见过具有任何事件的结构。）这些实际上都没有您那么有用可能会认为 - 有关更多详细信息，请参阅线程部分。

那么，当您在代码中引用 `MyEvent` 时会发生什么？好吧，在类型本身的文本（包括嵌套类型）中，编译器生成引用委托变量的代码（上面示例中的 `_myEvent` ）。在所有其他上下文中，编译器生成引用该事件的代码。

## 重点是什么？

现在我们知道它们是什么了，同时拥有代表和事件有什么意义呢？答案是封装。假设事件在 C#/.NET 中不作为概念存在。另一个类如何订阅事件？三个选项：

    1. 公共委托变量
    2. 由属性支持的委托变量
    3. 具有 `AddXXXHandler` 和 `RemoveXXXHandler` 方法的委托变量

选项 1 显然是可怕的，因为我们厌恶公共变量的所有正常原因。选项 2 稍好一些，但允许订阅者有效地相互覆盖 - 编写 `someInstance.MyEvent = eventHandler;` 太容易了，它会替换任何现有的事件处理程序，而不是添加新的事件处理程序。此外，您还需要编写属性。

选项 3 基本上是事件为您提供的，但具有有保证的约定（由编译器生成并由 IL 中的额外标志支持）和“自由”实现（如果您对类似字段的事件为您提供的语义感到满意）。

订阅和取消订阅事件被封装，不允许任意访问事件处理程序列表，并且语言可以通过提供声明和订阅的语法来使事情变得更简单。

## 线程安全事件

之前我们谈到了添加/删除操作期间的类字段事件锁定。这是为了提供一定程度的线程安全性。不幸的是，它并不是很有用。首先，即使在 2.0 中，规范也允许锁是对 `this` 对象的引用，或者静态事件的类型本身。这违背了锁定私有引用以避免意外死锁的原则。

讽刺的是，第二个问题与第一个问题完全相反 - 因为在 C# 2.0 中，您无法保证将使用哪个锁，在引发事件时您无法自己使用它来确保您看到最新的值在线程中进行提升。

您可以锁定其他内容或调用其中一种内存屏障方法，但这会留下一些令人讨厌的味道。

如果您想真正实现线程安全，这样当您引发事件时，您始终使用委托变量的最新值，同时确保添加/删除操作不会相互干扰，您需要自己编写添加/删除操作的主体。

这是一个例子：

```cs
/// <summary>
/// 委托变量支持SomeEvent事件。
/// </summary>
SomeEventHandler someEvent;

/// <summary>
/// 锁定SomeEvent委托访问。
/// </summary>
readonly object someEventLock = new object();

/// <summary>
/// 事件的描述
/// </summary>
public event SomeEventHandler SomeEvent
{
    add
    {
        lock (someEventLock)
        {
            someEvent += value;
        }
    }
    remove
    {
        lock (someEventLock)
        {
            someEvent -= value;
        }
    }
}

/// <summary>
/// 引发SomeEvent事件
/// </summary>
protected virtual void OnSomeEvent(EventArgs e)
{
    SomeEventHandler handler;
    lock (someEventLock)
    {
        handler = someEvent;
    }
    if (handler != null)
    {
        handler (this, e);
    }
}
```

您可以对所有事件使用一个锁，甚至也可以对其他事件使用一个锁 - 这取决于您的情况。请注意，您需要将当前值分配给锁内的局部变量（以获取最新值），然后测试它是否为空并在锁外执行它：在引发事件的同时持有锁是一个非常糟糕的主意，因为你很容易陷入僵局。

（事件处理程序很可能需要等待另一个线程执行某些操作，如果另一个线程要调用事件的添加或删除操作，则会陷入死锁。）

这一切都有效，因为一旦为 `handler` 分配了 `someEvent` 的值，即使 `someEvent` 发生变化， `handler` 的值也不会改变。因此，如果所有处理程序都取消订阅该事件， `someEvent` 将变为 `null` ，但 `handler` 仍将具有分配时的值。事实上，由于委托实例是不可变的，因此在执行 `handler = someEvent;` 行时订阅的任何处理程序都将被调用，即使其他人在那时和 `handler (this, e);` 行之间订阅了处理程序。

现在，重要的是要考虑是否需要线程安全。是否要在其他线程中添加或删除事件处理程序？您需要从另一个线程引发该事件吗？如果您完全控制您的应用程序，答案很可能是否定的。

（如果您正在编写一个类库，那么线程安全很可能很重要。）如果您不需要线程安全，您可能需要实现添加/删除操作来解决外部可见的问题C# 使用的锁（或者在 2.0 的情况下可能使用）。到那时，操作就变得非常琐碎了。

这是与之前的代码等效的代码，但没有线程安全。

```cs
/// <summary>
/// Delegate variable backing the SomeEvent event.
/// </summary>
SomeEventHandler someEvent;

/// <summary>
/// Description for the event
/// </summary>
public event SomeEventHandler SomeEvent
{
    add
    {
        someEvent += value;
    }
    remove
    {
        someEvent -= value;
    }
}

/// <summary>
/// Raises the SomeEvent event
/// </summary>
protected virtual void OnSomeEvent(EventArgs e)
{
    if (someEvent != null)
    {
        someEvent (this, e);
    }
}
```

检查无效性是由于当没有任何委托实例可调用时委托变量为 `null` 。使事情变得更简单的一种方法是使用无操作委托实例作为“默认”实例，该实例永远不会被删除。

此时，您只需获取委托变量的值（如果是线程安全的，则在锁内），然后执行委托实例。如果没有“真正的”委托目标可供调用，则无操作目标将执行，这就是将发生的一切。

## 委托实例：其他方法

之前我们看到了对 `someDelegate(10)` 的调用实际上是 `someDelegate.Invoke(10)` 的简写。委托类型还可以允许使用 `BeginInvoke` / `EndInvoke` 对进行异步行为。就 CLI 规范而言，这些是可选的，但 C# 委托类型始终提供它们。

它们遵循与 .NET 其余部分相同的异步执行模型，允许提供回调处理程序以及存储状态信息的对象。委托在系统线程池创建的线程上执行。

下面的第一个示例在没有回调的情况下运行，仅使用同一线程中的 `BeginInvoke` 和 `EndInvoke` 。当单个线程用于通常是同步的但包含可以并行执行的元素的操作时，这有时很有用。

为了简单起见，所涉及的方法都是静态的，但是也可以使用具有特定目标对象的委托实例，而且经常如此。 `EndInvoke` 返回委托调用返回的任何值。如果调用抛出异常，则 `EndInvoke` 也会抛出相同的异常。

```cs
using System;
using System.Threading;

delegate int SampleDelegate(string data);

class AsyncDelegateExample1
{
    static void Main()
    {
        SampleDelegate counter = new SampleDelegate(CountCharacters);
        SampleDelegate parser = new SampleDelegate(Parse);

        IAsyncResult counterResult = counter.BeginInvoke ("hello", null, null);
        IAsyncResult parserResult = parser.BeginInvoke ("10", null, null);
        Console.WriteLine ("Main thread continuing");

        Console.WriteLine ("Counter returned {0}", counter.EndInvoke(counterResult));
        Console.WriteLine ("Parser returned {0}", parser.EndInvoke(parserResult));

        Console.WriteLine ("Done");
    }

    static int CountCharacters (string text)
    {
        Thread.Sleep (2000);
        Console.WriteLine ("Counting characters in {0}", text);
        return text.Length;
    }

    static int Parse (string text)
    {
        Thread.Sleep (100);
        Console.WriteLine ("Parsing text {0}", text);
        return int.Parse(text);
    }
}
```

对 `Thread.Sleep` 的调用只是为了证明执行确实是并行发生的。 `CountCharacters` 中的睡眠时间与强制系统线程池在两个不同线程上运行任务一样大 - 线程池序列化不需要很长时间的请求，以避免创建更多线程比它需要的多。

通过长时间休眠，我们正在模拟一个长时间运行的请求。以下是示例运行的输出：

```cs
Main thread continuing
Parsing text 10
Counting characters in hello
Counter returned 5
Parser returned 10
Done
```

对 `EndInvoke` 的调用会阻塞，直至委托完成，其方式与对 `Thread.Join` 的调用阻塞直至所涉及的线程终止的方式大致相同。调用 `BeginInvoke` 返回的 `IAsyncResult` 值允许访问作为最后一个参数传递给 `BeginInvoke` 的状态，但这通常不会在样式中使用上面显示的异步调用。

上面的代码相当简单，但通常不如委托完成后使用回调的模型强大。通常，回调将调用 `EndInvoke` 来获取委托的结果。尽管理论上它仍然是一个阻塞调用，但它实际上永远不会阻塞，因为回调仅在委托完成时才会执行。回调很可能使用提供给 `BeginInvoke` 的状态作为额外的上下文信息。下面的示例代码使用与前面的示例相同的计数和解析委托，但具有显示结果的回调。

状态用于确定如何格式化每个结果，因此单个回调可用于两个异步调用。请注意从 `IAsyncResult` 到 `AsyncResult` 的转换：提供给回调的值始终是 `AsyncResult` 的实例，这可用于获取原始委托实例，以便回调可以调用 `EndInvoke` 。当涉及的所有其他类都位于 `System` 或 `System.Threading` 中时， `AsyncResult` 位于 `System.Runtime.Remoting.Messaging` 命名空间中，这有点反常，但是这样就是生命。

```cs
using System;
using System.Threading;
using System.Runtime.Remoting.Messaging;

delegate int SampleDelegate(string data);

class AsyncDelegateExample2
{
    static void Main()
    {
        SampleDelegate counter = new SampleDelegate(CountCharacters);
        SampleDelegate parser = new SampleDelegate(Parse);

        AsyncCallback callback = new AsyncCallback (DisplayResult);

        counter.BeginInvoke ("hello", callback, "Counter returned {0}");
        parser.BeginInvoke ("10", callback, "Parser returned {0}");

        Console.WriteLine ("Main thread continuing");

        Thread.Sleep (3000);
        Console.WriteLine ("Done");
    }

    static void DisplayResult(IAsyncResult result)
    {
        string format = (string) result.AsyncState;
        AsyncResult delegateResult = (AsyncResult) result;
        SampleDelegate delegateInstance = (SampleDelegate)delegateResult.AsyncDelegate;

        Console.WriteLine (format, delegateInstance.EndInvoke(result));
    }

    static int CountCharacters (string text)
    {
        Thread.Sleep (2000);
        Console.WriteLine ("Counting characters in {0}", text);
        return text.Length;
    }

    static int Parse (string text)
    {
        Thread.Sleep (100);
        Console.WriteLine ("Parsing text {0}", text);
        return int.Parse(text);
    }
}
```

这次几乎所有的工作都是在线程池线程上完成的。主线程只是启动异步任务，然后休眠足够长的时间以完成所有工作。 （线程池线程是后台线程 - 如果没有额外的 `Sleep` 调用，应用程序将在委托调用完成执行之前终止。）下面是一些示例输出 - 请注意这次的情况，因为没有保证顺序对于 `EndInvoke` 的调用，解析器结果显示在计数器结果之前。在前面的示例中，解析器几乎肯定在计数器之前完成，但主线程首先等待获取计数器的结果。

```cs
Main thread continuing
Parsing text 10
Parser returned 10
Counting characters in hello
Counter returned 5
Done
```

注意，使用异步执行时必须调用 `EndInvoke` ，以保证不泄漏内存或句柄。有些实现可能不会泄漏，但您不应该依赖于此。请参阅我的线程池文章，了解一些示例代码，以允许“即发即忘”风格的异步行为（如果这不方便的话）。

## 结论

委托提供了一种简单的方式来将方法调用（可能带有目标对象）表示为可以传递的数据片段。

它们是事件的基础，是添加和删除在适当时间调用的处理程序代码的有效约定。
