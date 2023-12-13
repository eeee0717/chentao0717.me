---
title: Mysql存储过程
date: 2023-12-10T16:00:00.000+00:00
lang: zh
duration: 10min
type: note
---
## 概述
存储过程是事先经过编译并存储在数据库中的一段sql语句的集合，调用存储过程可以简化开发人员的工作，减少数据在数据库和应用服务器之间的传输，对于提高数据处理的效率是有好处的。
### 特点
- 封装，复用
- 可以接收参数，可以返回结果，可以被其他程序调用
- 减少网络交互，效率提升
## 基本用法
### 创建存储过程
```sql
CREATE PROCEDURE procedure_name()
BEGIN
    -- sql语句
END
```
### 调用存储过程
```sql
CALL procedure_name()
```
### 删除存储过程
```sql
DROP PROCEDURE[if exists] procedure_name
```
## 变量
系统变量：是mysql服务器提供，不是用户定义，属于服务器层面。分为全局变量和会话变量。
### 查看系统变量
```sql
show variables;
show variables like 'character%';
```
### 设置系统变量
```sql
set global variable_name = value; 
set session variable_name = value;
```
用户自定义变量：用户根据需求自己定义变量，不需要提前声明，使用时直接@变量名。其作用域是当前会话，会话结束后变量消失。
### 赋值
```sql
set @variable_name := value;
```
### 使用
```sql
select @variable_name;
```
局部变量：在存储过程中定义的变量，作用域是当前存储过程，存储过程结束后变量消失。需要使用declare关键字声明。
### 声明
```sql
declare variable_name type [default value];
```
### 赋值
```sql
set variable_name := value;
```
