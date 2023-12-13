---
title: DQL
date: 2023-12-06T16:00:00.000+00:00
lang: zh
duration: 10min
type: note
---
## SELECT关键字
### 范围查询
```sql
select * from 表名 between 值1 and 值2;
```
### 模糊查询
```sql
select * from 表名 like '%值%';
```
## From关键字
```sql
select * from 表名;
```
## Where关键字
```sql
select * from 表名 where 条件;
```
## Group By关键字
```sql
select * from 表名 group by 字段;
```
## Having关键字
```sql
select * from 表名 group by 字段 having 条件;
```
## Order By关键字
```sql
select * from 表名 order by 字段 [asc|desc];
```
## Limit关键字
```sql
select * from 表名 limit 10;
```



