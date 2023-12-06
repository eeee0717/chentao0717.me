---
title: DML
date: 2023-12-06T16:00:00.000+00:00
lang: zh
duration: 10min
type: note
---
## 添加数据
### 给指定字段添加数据
```sql
insert into 表名(字段1,字段2,字段3) values(值1,值2,值3);
```
### 给所有字段添加数据
```sql
insert into 表名 values(值1,值2,值3);
```
### 给指定字段添加多条数据
```sql
insert into 表名(字段1,字段2,字段3) values(值1,值2,值3),(值1,值2,值3),(值1,值2,值3);
```
## 修改数据
```sql
update 表名 set 字段1=值1,字段2=值2 [where 条件];
```
## 删除数据
```sql
delete from 表名 [where 条件];
```


