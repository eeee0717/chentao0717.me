---
title: Mysql事务
date: 2023-12-08T19:20:00.000+00:00
lang: zh
duration: 5min
type: note
---
### 事务的简介
事务是一组操作和集合，这些操作要么全部成功，要么全部失败。事务将所有操作作为一个整体向系统提交或撤销。

### 事务操作
- 设置事务
```sql
select @@autocommit; -- 查看当前事务状态
set @@autocommit = 0; -- 手动提交事务
```
- 提交事务
```sql
commit;
```
- 回滚事务
```sql
rollback;
```
- 开启事务
```sql
start transaction;
```
### 事务的四大特性ACID
- 原子性（Atomicity）：事务是一个不可分割的工作单位，事务中的操作要么全部成功，要么全部失败回滚。
- 一致性（Consistency）：事务必须使数据库从一个一致性状态变换到另一个一致性状态。
- 隔离性（Isolation）：一个事务的执行不能被其他事务干扰，即一个事务内部的操作及使用的数据对其他并发事务是隔离的，并发执行的各个事务之间不能互相干扰。
- 持久性（Durability）：持久性也称永久性（Permanence），指一个事务一旦被提交，它对数据库中数据的改变就是永久性的，接下来的其他操作和数据库故障不应该对其有任何影响。

### 并发事务问题
- 脏读：一个事务读取到另一个事务未提交的数据。
- 不可重复读：一个事务读取到另一个事务已提交的update数据。
- 幻读：一个事务读取到另一个事务已提交的insert数据。

### 事务隔离级别
| 隔离级别 | 脏读 | 不可重复读 | 幻读 |
| :---: | :---: | :---: | :---: |
| Read Uncommitted | √ | √ | √ |
| Read Committed | × | √ | √ |
| Repeatable Read(默认) | × | × | √ |
| Serializable | × | × | × |

> 查看事务隔离级别
```sql
select @@TRANSACTION_ISOLATION; -- 查看当前事务隔离级别
```
> 设置事务隔离级别
```sql
set TRANSACTION ISOLATION LEVEL READ UNCOMMITTED; -- 设置事务隔离级别
```


