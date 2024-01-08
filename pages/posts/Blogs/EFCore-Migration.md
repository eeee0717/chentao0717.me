---
title: EFCore Mysql多层级项目数据库迁移
date: 2024-01-08T20:20:00.000+00:00
lang: zh
duration: 10min
type: blog
---
记录一下今天新开的项目中遇到的问题，VNext是新开的英语听力网站项目，在使用EFCore对Mysql数据迁移的过程中目前遇到两个问题。

1. Mysql版本为8.0时，EFCore迁移报错，StackOverflow上说目前Pomelo.EntityFrameworkCore.MySql还有些bug，可以等待正式版，所以将数据库降级为5.7版本，问题解决。
2. 在多层级项目中，首次迁移会遇到不能识别`IdDbContext`，目前这个问题还不知道为什么，重新建立项目后，问题解决。

> 建议开始项目的时候先完成数据迁移再进行代码编写任务。。。
