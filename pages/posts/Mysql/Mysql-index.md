---
title: Mysql索引
date: 2023-12-08T16:00:00.000+00:00
lang: zh
duration: 10min
type: note
---
## 索引的概述
索引是帮助Mysql高效获取数据的数据结构。

### 优缺点
| 优点 | 缺点 |
| --- | --- |
| 提高查询效率 | 占用磁盘空间 |
| 降低写操作效率 |索引大大提高的查询效率，但降低了表更新的速度 |

## 索引结构
| 索引类型 | 说明 |
| --- | --- |
|B+Tree|最常见的索引类型|
|Hash|底层数据结构使用哈希表实现的|
|Full-text|全文索引，建立倒排索引，快速匹配文档|
|R-Tree|空间索引，只能在MyISAM上使用|

### 二叉树
二叉树的缺点：顺序插入时，二叉树会退化成链表，查询效率会降低。

### 红黑树
大数据量的情况下，层级较深，检索速度慢。

### B-Tree
B-Tree是一种平衡的多路搜索树，能够保持数据有序。B-Tree的每个节点最多包含k个孩子，k被称为B-Tree的阶。k的大小取决于磁盘页的大小。
> https://www.cs.usfca.edu/~galles/visualization/Algorithms.html

### B+Tree
B+Tree是B-Tree的变体，也是一种平衡的多路搜索树，能够保持数据有序。B+Tree的每个节点最多包含k个孩子，k被称为B+Tree的阶。k的大小取决于磁盘页的大小。

Mysql对经典的B+Tree做了一些优化，在原B+Tree的基础上，增加一个指向兄弟节点的指针，使得B+Tree的所有叶子节点构成一个有序链表，便于范围查询。

### Hash
采用一定的hash算法，将索引值和数据的存储地址关联起来，这样就可以根据索引值找到数据的存储地址，从而快速查询到数据。

---
为什么InnoDB引擎选择B+Tree？
> 相对于二叉树，层级更少，搜索效率更高

> 对于B-Tree，无论叶子结点或者非叶子节点，都存储数据，而B+Tree只有叶子节点存储数据，这样可以存储更多的数据。

> 对于Hash索引，只能进行等值查询，无法进行范围查询。

## 索引的分类
| 索引类型 | 说明 |特点|关键字|
| --- | --- | --- | --- |
|主键索引|针对表中主键创建的索引|默认自动创建，只能有一个|PRIMARY KEY|
|唯一索引|避免同一个表中某数据列中的值重复|可以有多个|UNIQUE|
|普通索引|快速定位特定数据|可以有多个||
|全文索引|查找的是文本中的关键词|可以有多个|FULLTEXT|

根据索引的存储形式，可以分为两种。
| 索引类型 | 说明 |特点|
| --- | --- | --- |
|聚集索引|将数据与索引放在一个块，保存行数据|必须有一个|
|二级索引|叶子节点关联的是主键|可以有多个|

---
以下sql语句，那个执行效率高？
```sql
select * from t where id = 1;
select * from t where name = '张三';
```
> 第一个，因为id是主键，主键索引是聚集索引，可以直接定位到数据行。

InnoDB主键索引的B+树高度为多少呢？
假设：一行数据大小为1K，一页可以存储16行。InnoDB的指针占用6个字节空间，主键占用字节数为8.
> 高度为2：n×8+(n+1)×6=16×1024 n=1170

> 高度为3：1170×1170×16=2000w条数据

## 索引语法
### 创建索引
```sql
create index 索引名 on 表名(字段名);
```
### 删除索引
```sql
drop index 索引名 on 表名;
```
### 查看索引
```sql
show index from 表名;
```

## SQL性能分析

- 查看SQL执行频率
```sql
show global status like 'Com_______';
```
- 慢查询日志
```sql
slow_query_log = 1
# 设置慢日志的时间为1秒
long_query_time = 1
# 慢日志的路径
vi /etc/my.cnf
```
- profile详情
```sql
set profiling = 1;
show profiles; # 查看profile
show profile for query_id; # 查看某个profile的详情
```
- explain执行计划
```sql
explain select * from t where id = 1;
```

## 索引的使用
- 查询索引
```sql
show index from 表名;
```
- 最左前缀原则
如果使用了联合索引，要遵守最左前缀原则，即查询条件从左到右依次匹配索引的最左前缀，才能使用到索引。

如果跳跃了某一列，那么这个索引就无法使用。
- sql提示
```sql
use index：
select * from t use index(索引名) where id = 1;
ignore index：
select * from t ignore index(索引名) where id = 1;
force index：
select * from t force index(索引名) where id = 1;
```
- 覆盖索引
尽量不要使用select *，而是使用select 字段名，这样可以减少IO操作，提高查询效率。

- 前缀索引
如果某一列的数据长度较长，可以只取前面的一部分作为索引，这样可以减少索引的大小，提高查询效率。（字符串）
```sql
create index 索引名 on 表名(字段名(长度));
```
