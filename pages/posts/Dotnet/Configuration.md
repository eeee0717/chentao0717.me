---
title: 配置文件
date: 2023-12-16T16:00:00.000+00:00
lang: zh
duration: 10min
type: note
---
## 说明
1. 传统Web.config的缺点，需要在项目中引用System.Configuration，而且需要在项目中添加Web.config文件，不利于项目的分层。在DI项目中不利于配置的管理。
2. 为了兼容，仍然可以使用Web.config和ConfigurationManager类，但是不推荐使用。
3. .NET中的配置系统支持丰富的配置源，包括JSON、XML、INI、环境变量、命令行参数、内存、自定义配置源等。

## Microsoft.Extension.Options
###  IOptionsMonitor和IOptionsSnapshot
1. IOptionsMonitor用于获取配置的实例，当配置发生变化时，IOptionsMonitor会自动更新配置实例。
2. IOptionsSnapshot用于获取配置的实例，当配置发生变化时，IOptionsSnapshot不会自动更新配置实例，需要手动调用IOptionsSnapshot的Update方法更新配置实例。（推荐使用）
