---
title: Mysql多表查询
date: 2023-12-06T16:00:00.000+00:00
lang: zh
duration: 10min
type: note
---
## 多表关系
- 一对一(实现：外键unique)
- 一对多(实现：外键)
- 多对多(实现：中间表)
> example:
``` select * from student,teacher where student.tid=teacher.id```;

## 多表查询
### 内连接查询
1. 隐式内连接
```sql
select * from student,teacher where student.tid=teacher.id;
```
2. 显式内连接
```sql
select * from student inner join teacher on student.tid=teacher.id;
```
> 区别：隐式连接语法简单；显示连接可以减少字段的扫描

### 外连接查询
1. 左外连接
```sql
select * from student left outer join teacher on student.tid=teacher.id;
```
2. 右外连接
```sql
select * from student right outer join teacher on student.tid=teacher.id;
```
> 一般使用左外连接，右外连接可以转换为左外连接。

### 自连接
```sql
select * from student s1 join student s2 on s1.tid=s2.tid;
```
### 联合查询
```sql
select * from student
union
select * from teacher;
```
> union all 不去重

### 子查询
```sql
select * from student where tid in (select id from teacher);
```
> 子查询可以嵌套，但是不建议嵌套太多，一般不超过三层。

#### 1. 标量子查询

常用的操作符：> < = >= <= != <>

```sql
select * from student where tid = (select id from teacher where name='zhangsan');
```

#### 2. 列子查询
常用的操作符：in not in any all some

```sql
select * from student where tid in (select id from teacher where name='zhangsan');
```

#### 3. 行子查询
常见的操作符：= <> in not in

```sql
select * from student where (tid,name) in (select id,name from teacher);
```

#### 4. 表子查询
常见的操作符：in
```sql
select * from student where (tid,name) in (select id,name from teacher);
```
