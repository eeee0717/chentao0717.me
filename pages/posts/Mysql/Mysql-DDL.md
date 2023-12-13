---
title: DDL
date: 2023-12-06T16:00:00.000+00:00
lang: zh
duration: 10min
type: note
---
## 数据库操作
### 查询
``` sql
show databases;

select database();
```

### 创建
``` sql
create database [if not exists] 数据库名;
```

### 删除
``` sql
drop database [if exists] 数据库名;
```

### 使用
``` sql
use 数据库名;
```

## 数据表操作
### 查询
```sql
show tables;
```

### 查询表结构
```sql
desc 表名;
```

### 查询指定表的建表语句
```sql
show create table 表名;
```

### 创建表
```sql
create table 表名(
    列名1 数据类型1[ Comment '注释' ],
    列名2 数据类型2[ Comment '注释' ],
    ...
    列名n 数据类型n[ Comment '注释' ]
);
```
> 数据类型：数值类型、字符串类型、日期时间类型
https://www.runoob.com/mysql/mysql-data-types.html

### 修改表
#### 添加字段
```sql
alter table 表名 add 列名 数据类型 [Comment '注释'] [first|after 列名];
```

#### 修改数据类型
```sql
alter table 表名 modify 列名 新数据类型;
```

#### 修改字段名
```sql
alter table 表名 change 旧列名 新列名 数据类型;
```

#### 删除字段
```sql
alter table 表名 drop 列名;
```

#### 修改表名
```sql
alter table 表名 rename to 新表名;
```

### 删除表
```sql
drop table[if exists] 表名;
```
