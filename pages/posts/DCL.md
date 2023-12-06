---
title: DCL
date: 2023-12-06T16:00:00.000+00:00
lang: zh
duration: 10min
type: note
---
## 管理用户
### 1. 查询用户
```sql
use mysql;
select * from user;
```
### 2. 创建用户
```sql
create user '用户名'@'主机名' identified by '密码';
```
### 3. 修改用户密码
```sql
alter user '用户名'@'主机名' identified with mysql_native_password by '新密码';
```

### 4. 删除用户
```sql
drop user '用户名'@'主机名';
```
## 权限控制
### 1. 查询权限
```sql
show grants for '用户名'@'主机名';
```
### 2. 授权
```sql  
grant 权限 on 数据库.表名 to '用户名'@'主机名';
```
### 3. 撤销权限
```sql
revoke 权限 on 数据库.表名 from '用户名'@'主机名';
```



