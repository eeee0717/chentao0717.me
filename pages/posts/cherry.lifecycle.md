---
title: Cherry Studio V2 lifecycle 学习
postId: '1023'
date: 2026-04-18 14:58:25
lang: zh
duration: 10min
type: blog
art: connections
---

## Chapter 1
本章节会先从四个问题入手lifecycle的学习。
1. 生命周期解决了什么问题？
2. 3个phase该如何区分？
3. hook的顺序是什么？
4. `onAllReady()`的意义是什么？

### 生命周期解决了什么问题？

生命周期是用来将主进程里的服务初始化、依赖顺序、运行状态和资源回收统一纳入一个可控框架中，避免各服务各自启动、各自清理，最终变为隐式依赖和难以收尾的状态。
更准确一点描述，它主要解决了5类问题:

1. 启动顺序

哪些服务必须先准备好，比如 DbService、配置、缓存，这些要先于依赖它们的服务启动。

2. 启动阶段

不是所有的服务都应该在同一时间启动。有些可以在`app.whenReady()`前做，有的需要等Electron建立后才能做，而有的是完全独立的，可以在后台异步执行

3. 依赖管理问题

谁依赖谁，不再通过手动`import`顺序来管理，而是有容器和phase规则保持统一

4. 运行时控制问题

服务不是启动一次就结束了，还可能需要`pause、resume、stop、restart`

5. 资源回收问题

像定时器、IPC handler、事件监听、订阅、signal 这些资源，都需要在服务停止时统一释放，避免泄漏或残留副作用。

### 3个phase应该如何区分？
目前Cherry Studio中的lifecycle分为三个阶段: `BeforeReady`, `WhenReady`, `Background`

![Cherry Studio lifecycle 3 phases decision](/images/cherry.lifecycle.1.png)

- BeforeReady
  - 与`app.whenReady()`并行运行
  - 不能使用任何 `Electron API`（此时 app 还没 ready）
  - 只能依赖其他`BeforeReady` 服务
  - 适合：数据库连接、配置加载、数据迁移、schema 校验，以及所有 `WhenReady` 服务会依赖的前置工作。

- WhenReady
  - 只有在 `BeforeReady` 和 `app.whenReady()` 都完成后才运行。
  - 可以完整使用 Electron API（`BrowserWindow`、`Tray`、`screen`、`nativeTheme`、`dialog`、`globalShortcut` 等）。
  - 可以依赖其他 `WhenReady` 服务。
  - 适合：窗口管理、托盘、系统快捷键、主题管理、需要 Electron API 的 IPC handler。

- Background
  - 会立刻启动，但完全独立运行，绝不阻塞其他 phase。
  - 其他 phase 的服务**不能**依赖 `Background` 服务，反过来也一样。
  - 适合：遥测上报、非关键数据预取、后台清理任务。

### hook的顺序是什么？

生命周期服务的hook顺序如图所示

![Cherry Studio lifecycle hook order](/images/cherry.lifecycle.2.png)

### `onAllReady()`的意义是什么？

每个服务完成后都会调用各自的`onReady`，当所有服务都`onReady`后就会调用一次`onAllReady()`，此时就标明整个系统的service都是可用的，可以放心使用。

## Chapter2

本章节会解决以下四个问题。
1. 什么服务需要使用lifecycle？
2. `@Conditional`、`Pausable`、`Activatable`

### 什么服务需要使用lifecycle？
这个问题正好对应了chapter1的第一个问题，lifecycle解决了什么问题，因此这里也非常好理解。

1. **持有长生命周期的资源**: 这些资源在初始化时创建，会跨多次调用且持续存在，并且需要显式清理

| 类别                | 示例                                                     |
| ------------------- | -------------------------------------------------------- |
| 数据库连接          | SQLite / LibSQL、Drizzle ORM                             |
| 网络服务            | HTTP server、mDNS browser、WebSocket server              |
| 文件系统            | `chokidar` watcher、Winston DailyRotateFile transport    |
| 定时器              | `setInterval`（GC、轮询）                                |

2. **注册持有副作用**: 它在初始化时修改全局状态，并在整个生命周期中持续生效，需要在退出时清理

| 类别                | 示例                                                               |
| ------------------- | ------------------------------------------------------------------ |
| 事件监听器          | `nativeTheme.on()`、`powerMonitor.on()`、`autoUpdater.on()`        |
| 全局快捷键          | `globalShortcut.register()`                                        |
| 订阅                | `preferenceService.subscribeChange()`、`configManager.subscribe()|
| IPC handler         | `ipcMain.handle()` 注册（见下文）                                  |
| 全局 API 修改       | monkey-patch 全局 API                                              |

那么在什么情况下不需要使用lifecycle呢？

- **无状态编排逻辑**：只是调用其他服务、拼装结果，自己不持有任何资源。
- **DataApi 业务逻辑服务**：比如 repository、数据访问封装，内部只是查询 `DbService`（例如 `MessageRepository`、`TopicService`）。数据库连接由 `DbService` 管理，这些类本身只是对查询逻辑做封装，应该用 direct-import singleton。
- **请求作用域资源**：资源在单次方法调用内创建并释放，例如 `BackupManager.backup()` 内部临时建立的 S3 连接。
- **没有 init，也没有 cleanup**：如果继承 `BaseService` 后既不会重写 `onInit()`，也不会重写 `onStop()`，那通常就不该进 lifecycle。
- **纯工具类**：没有运行时状态的函数集合或 SDK wrapper。

![Cherry Studio lifecycle service decision](/images/cherry.lifecycle.3.png)

### `@Conditional`、`Pausable`、`Activatable`
当一个服务确定需要使用lifecycle后，可能有一些可选的行为可以添加：
  - `@Conditional`: 启动时就不该存在
  - `Pausable`: 只是临时停一下，资源别释放
  - `Activatable`: 运行时可开可关，重资源要按需加载/释放

#### Activatable 和 Pausable 的区别

| | Activatable | Pausable |
|---|------------|---------|
| 目的 | 按需加载 / 释放资源 | 临时暂停执行 |
| 状态维度 | 独立于 `LifecycleState` 之外 | 会改变 `LifecycleState` |
| IPC handlers | 始终可用（在 `onInit()` 中注册） | 暂停时保留，只有 stop 时才移除 |
| 资源 | inactive 时不分配 | paused 时仍保留 |
| 触发方式 | service 自己决定，或通过 `application.activate` 从外部触发 | 由 `LifecycleManager` 统一触发，可级联 |
| 级联 | 不级联 | 会级联到依赖它的服务 |
| 是否支持重复切换 | 支持重复 activate/deactivate | 支持重复 pause/resume |

## Chapter3
本章节将会深入研究 `src/main/core/application` 中的代码，记录学习到的新知识。

### Application Proxy

application的导出单例通过 `new Proxy` 对象来实现懒加载单例的功能。

`Proxy`是 `JavaScript` 的原生特性，用于拦截对象访问，也就是说，调用方在调用时 `application` 是一个普通对象，而通过 `application.xxx` 时, 会被拦截进入 `get()` 方法，从内部 `Application.getInstance()` 获取到真实单例后返回给调用方，再调用对应的方法

例如 `application.bootstrap()`:
1. 你先访问 `application.bootstrap()`
2. 这个访问被 `Proxy` 拦下来
3. `Proxy` 内部去拿真正的单例：`Application.getInstance()`
4. 再把真正实例上的 `bootstrap` 方法返回给你
5. 然后这个方法才执行

> 所以这里的 application 不是“真正的 Application 实例”，而是“一个代你转发请求的壳”。

![Cherry Studio application proxy bootstrap flow](/images/cherry.lifecycle.4.png)

使用 `Proxy` 有几个好处:
1. 不需要每次手写 `const app = Application.getInstance()`
2. 可以直接统一写 `application.bootstrap()`、`application.get(...)`
3. 模块顶层 `import` 很安全，不会因为过早初始化而出问题
4. 仍然保持"全局唯一实例"的语义

那么在什么情况下会使用到 `Proxy` 这个特性呢？

1. 延迟初始化(对象创建成本高)
2. 访问控制(限制外部访问或修改某些属性)
3. 自动兜底/默认值(i18n)
4. 日志、埋点、调试
5. API适配器/语法糖(facade, 动态代理, SDK包装层)
6. 响应式系统(Vue)

### ServiceRegistry
`ServiceRegistry`通过注册模式对所有纳入生命周期的service进行注册。

其中，`services` 对所有的类进行统一管理，实际上就会获得`services=[WindowManager, DbService, ...]`

`type ServiceRegistry` 将services映射到对应的实例类型
```ts
/** Auto-derived service name to instance type mapping */
export type ServiceRegistry = {
  [K in keyof typeof services]: InstanceType<(typeof services)[K]>
}
```

而`serviceList`才是注册时真正调用的对象。而注册时并不关心具体service类，使用抽象的`ServiceConstructor`，其中`(...args: unknown[])` 传入的`args`则是各个service的互相依赖传入的实例。

```ts
/** Service list for Application.registerAll() */
export const serviceList = Object.values(services) as ServiceConstructor[]

/**
 * Service constructor type
 */
export type ServiceConstructor<T = unknown> = new (...args: unknown[]) => T
```

ServiceRegistry将这三件事分开了:
- 注册清单: `services`
- 统一抽象: `ServiceConstructor`
- 类型推断: `type ServiceRegistry`
- 调用对象: `serviceList`

### Application

Application 是架构中最上层的编排器，用来将各种独立的系统和 Electron 应用串联起来。

![Cherry Studio application structure](/images/cherry.lifecycle.5.png)

#### bootstrap()

这是应用的引导程序，目前声明周期的manager在这里进行初始化。将会按照以下顺序进行：
- Path registry必须要在`bootstrap()`之前由index.ts进行注册，而不是在`bootstrap()`中进行
- 注册 `quit`和`signal` handlers，这样即使在启动阶段`Ctrl+C` 和应用退出，也能被正常处理，避免进程残留
- 生命周期初始化，按照 `Background`, `BeforeReady`, `WhenReady`的顺序进行，完成后发出`allReady()`信号

#### ServiceContainer 和 LifecycleManager

Application 是应用级编排入口；ServiceContainer 负责 service 的注册与实例化；LifecycleManager 负责 service 生命周期的执行与调度。
