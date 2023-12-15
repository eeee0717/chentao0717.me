---
title: 异步方法
date: 2023-12-13T16:00:00.000+00:00
lang: zh
duration: 10min
type: note
---
## async/await
1. 异步方法的返回值一般是`Task`或`Task<T>`，`Task`是一个异步操作的抽象，`Task<T>`是一个异步操作的抽象，它的返回值是`T`。
2. 即使没有返回值，也最好把返回值声明为非泛型的`Task`，而不是`void`，因为`void`返回值的异步方法不能使用`await`。
3. 调用泛型方法时，一般在方法前加`await`，这样拿到的返回值就是泛型指定的类型，而不是`Task<T>`。
4. 异步方法的传染性：一个方法如果使用了`await`，那么这个方法必须声明为`async`，调用这个方法的方法也必须声明为`async`，以此类推。

## async/await的线程切换
await调用的等待期间，.NET会把当前的线程返回给线程池等异步方法调用执行完毕后，框架会从线程池再取出来一个线程执行后续的代码。(await之前和之后可能不是同一个线程)

## 异步方法为什么不等于多线程
异步方法的代码并不会自动在新线程中执行，除非把代码放到新线程中执行。
```csharp
await Task.Run(() => {
    // 异步方法的代码
});
```

## 为什么有的方法没有async?
例如：`ReadAllTextAsync`, 因为这个方法的返回值是`Task<string>`，所以它是一个异步方法，但是它没有`async`，因为它是一个静态方法，静态方法不能声明为`async`。
### async方法缺点
1. 异步方法会生成一个类，运行效率没有普通方法高。
2. 可能会占用非常多的线程。
```csharp
static async Task ReadFile(int num)
{
    return await File.ReadAllTextAsync($"./{num}.txt");
}
```

### 不写async的优点
只写`Task`，当做普通方法调用。运行效率更高，不会造成线程浪费。
```csharp
static Task ReadFile(int num)
{
    return File.ReadAllTextAsync($"./{num}.txt");
}
```

### 什么样的方法可以不写async?
如果一个异步方法只是对别的异步方法调用的**转发**，并没有太多复杂的逻辑（比如等待的结果，再调用B；把调用的返回值拿到内部做一些处理再返回），那么就可以去掉async关键字。

## 异步方法不要写sleep
如果要在异步方法中暂停一段时间，不要使用`Thread.Sleep`，因为这样会阻塞线程，造成线程浪费，应该使用`await Task.Delay`。
```csharp
static async Task ReadFile(int num)
{
    await Task.Delay(1000);
    return await File.ReadAllTextAsync($"./{num}.txt");
}
```

## CancellationToken
场景：有时需要提前终止任务，比如： 请求超时、用户取消请求很多异步方法都有CancellationToken参数，用于获得提前终止执行的信号。

## WhenAll/WhenAny
1. `Task.WhenAll`：等待所有任务完成，返回一个`Task`，这个`Task`的返回值是一个`Task[]`，这个`Task[]`的返回值是所有任务的返回值。
2. `Task.WhenAny`：等待任意一个任务完成，返回一个`Task`，这个`Task`的返回值是一个`Task<Task>`，这个`Task<Task>`的返回值是第一个完成的任务的返回值。
```csharp
static async Task Main(string[] args)
{
    var task1 = ReadFile(1);
    var task2 = ReadFile(2);
    var task3 = ReadFile(3);

    var tasks = new[] { task1, task2, task3 };

    var result = await Task.WhenAll(tasks);
    Console.WriteLine(result.Length);
}
```
## 其他
1. 接口中不需要写`async`，在实现接口的类中写`async`。
2. 异步与`yield`，`yield`是同步的，`yield return`会把当前的状态保存下来，下次调用时从上次保存的状态开始执行。
