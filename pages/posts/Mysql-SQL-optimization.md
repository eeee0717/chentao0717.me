---
title: Mysql SQL优化
date: 2023-12-09T16:00:00.000+00:00
lang: zh
duration: 10min
type: note
---
## 插入数据优化
### 批量插入
```sql
INSERT INTO table_name (column1, column2, column3, ...)
```
### 手动提交事务
```sql
start transaction;
INSERT INTO table_name (column1, column2, column3, ...);
commit;
```
### 主键顺序插入

### 大批量插入数据
```sql
load data local infile 'file_name' into table table_name; fields terminated by ',' lines terminated by '\n';
```
## 主键优化
### 页分裂
页分裂是指当插入一条记录时，页已满，需要分裂成两页，这个过程是需要消耗资源的，所以我们可以通过设置主键的自增长来避免页分裂。
### 页合并
页合并是指当删除一条记录时，页的记录数过少，需要合并到相邻页，这个过程是需要消耗资源的，所以我们可以通过设置主键的自增长来避免页合并。

### 主键设计原则
- 尽量降低主键长度
- 插入时使用自增主键
- 尽量不要使用UUID做主键
- 尽量避免对主键进行更新
## order by优化
1. using filesort：通过表的索引或全表扫描来获取数据，然后再进行排序，这种方式称为“文件排序”，效率较低。
2. using index：通过索引来获取数据，不需要额外排序，这种方式称为“索引排序”，效率较高。
### order by设计原则
- 根据排序字段建立合适索引，多字段排序时符合最左前缀法则
- 尽量使用覆盖索引
- 多字段排序时，一个升序一个降序，注意联合索引创建时的规则
- 如果不可避免出现filesort，可以增大缓冲取得大小sort_buffer_size
## group by优化
同order by优化
## limit优化
通过覆盖索引+子查询的形式
```sql
select * from table_name where id in (select id from table_name limit 1000, 10);
```
## count优化
MyISAM引擎会将一个表的总行数存储在磁盘上，因此使用Count(*)时，只需要读取该值即可，效率较高。

InnoDB引擎没有将总行数存储在磁盘上，因此使用Count(*)时，需要遍历整个表，效率较低。

优化思路：自己计数

效率排序：count（字段）< count（主键）< count（*）
## update优化
尽量根据主键/索引字段进行数据更新。
