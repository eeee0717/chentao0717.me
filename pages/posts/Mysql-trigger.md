---
title: Mysql触发器
date: 2023-12-10T16:00:00.000+00:00
lang: zh
duration: 10min
type: note
---
## 概述
触发器是与表有关的数据库对象，在插入、更新或删除表中的数据时触发触发器，触发器可以由用户定义，也可以由系统自动定义。触发器是一种特殊的存储过程，它是一段与表有关的sql语句集合，当满足触发条件时，触发器会自动执行sql语句。

## 语法
### 创建
```sql
CREATE TRIGGER trigger_name
BEFORE|AFTER INSERT|UPDATE|DELETE ON table_name FOR EACH ROW //行级触发器
BEGIN
    -- sql语句
END
```
### 查看
```sql
show triggers;
```
### 删除
```sql
drop trigger trigger_name;
```

