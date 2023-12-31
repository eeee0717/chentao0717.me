---
title: Mysql锁
date: 2023-12-08T16:00:00.000+00:00
lang: zh
duration: 10min
type: note
---
## 概述
锁是数据库管理系统为了保证数据库事务并发控制而提出的一种机制，当多个事务同时对数据库进行操作时，可能会产生一些并发问题，比如脏读、不可重复读、幻读等，锁的作用就是为了解决这些并发问题。
## 全局锁
全局锁是对整个数据库实例加锁，加锁后整个实例处于只读状态，后续的DML的写语句，DDL语句，已经更新操作的事务提交语句都将被阻塞
### 加锁
```sql
flush tables with read lock;
```
### 解锁
```sql
unlock tables;
```
### 特点
- 如果在主库上备份，那么备份期间都不能执行更新
- 如果在从库上备份，那么在备份期间从库不能执行主库同步的文件，导致主从延迟

## 表级锁
表级锁，每次操作锁住整张表。锁定粒度大，发生锁冲突的概率最高，并发度最低。

### 表级锁分类
1. 表锁
2. 元数据锁
3. 意向锁

#### 表锁分类
1. 表共享读锁（read lock）
2. 表独占写锁（write lock）

语法
```sql
// 加锁
lock tables table_name read|write;
// 释放锁
unlock tables;
```
> 读锁不会阻塞其他客户端的读，但是会阻塞写操作。写锁会阻塞其他客户端的读和写操作。

#### 元数据锁 MDL
MDL锁的主要作用是维护表原数据的数据一致性，在表上有活动事务时，不可以对元数据进行写入操作。为了避免DML与DDL冲突，保证读写的正确性。

在对一张表进行增删改查的时候，加MDL读锁（共享）；对表结构进行变更时，加MDL写锁（独占）。

|对应SQL|锁类型|说明|
|:---:|:---:|:---:|
|lock tables xxx read/write|shared_read_only/shared_no_read_write||
|select|shared_read|与shared_read, shared_write兼容，与exclusive互斥|
|insert/delete/update|shared_write|与shared_read, shared_write兼容，与exclusive互斥|
|alter table|exclusive|与shared_read, shared_write, exclusive互斥|

#### 意向锁
为了避免DML在执行时，加的行锁与表锁的冲突，在InnoDB中引入了意向锁，使得表锁不用检查每行数据是否加锁，使用意向锁来减少表锁的检查。

1. 意向共享锁（IS）：由select...lock in share mode添加【与read兼容，write互斥】
2. 意向排他锁（IX）：由insert、update、delete、select...for update添加【与read，write都互斥】

## 行级锁
行级锁，每次操作锁住对应的行数据。锁定粒度最小，发生锁冲突的概率最低，并发度最高。

InnoDB的数据是基于索引组织的，行锁是通过对索引上的索引项加锁来实现的，而不是记录加的锁。

### 行级锁的分类
1. 行锁：锁定单个行记录的锁，防止其他事务进行update和delete。在RC,RR隔离级别下都支持
2. 间隙锁：锁定索引记录间隙，保证索引记录间隙不变，防止insert，产生幻读。在RR隔离级别下支持
3. 临键锁：行锁和间隙锁的组合，同时锁住数据和间隙。在RR隔离下支持

#### 行锁
1. 共享锁（S）：允许一个事务去读一行，阻止其他事务获得相同数据集的排他锁
2. 排他锁（X）：允许获得排他锁的事务更新数据，阻止其他事务取得相同数据集的共享读锁和排他写锁

![](https://raw.githubusercontent.com/eeee0717/chentaoImg/master/行锁.png)

> InnoDB的行锁是针对索引加的锁，如果不同通过索引，则会升级为表锁。

#### 间隙锁
默认情况下，在RR隔离级别运行，使用临键锁进行搜索和扫描，防止幻读。
1. 等值查询（唯一索引），给不存在的记录加锁，优化为间隙锁。
2. 等值查询（普通索引），向右遍历时最后一个值不满足查询需求时，退化为间隙锁。
3. 范围查询（唯一索引），会访问到不满足条件的第一个值为止。
