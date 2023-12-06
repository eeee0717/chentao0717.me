---
title: Mysql函数
date: 2023-12-06T16:00:00.000+00:00
lang: zh
duration: 10min
type: note
---
## 字符串函数
1. 字符串拼接
```sql
concat(str1,str2,...)
```
2. 字符串大小写
```sql
upper(str)
lower(str)
```
3. 左填充和右填充
```sql
lpad(str,len,padstr)
rpad(str,len,padstr)
```
4. 字符串去除空格
```sql
trim(str)
```
5. 字符串截取
```sql
substring(str,start,len)
```
## 数值函数
1. 向上和向下取整
```sql
ceil(num)
floor(num)
```
2. 返回模
```sql
mod(num1,num2)
```
3. 返回随机数
```sql
rand()
```
4. 四舍五入
```sql
round(num,len)
```
## 日期函数
1. 返回当前日期
```sql
curdate()
```
2. 返回当前时间
```sql
curtime()
```
3. 返回当前日期和时间
```sql
now()
```
4. 返回指定年份
```sql
year(date)
```
5. 返回指定月份
```sql
month(date)
```
6. 返回指定日期
```sql
day(date)
```
7. 返回一个日期加上指定天数后的日期
```sql
date_add(date,interval num day)
```
8. 返回起始日期与结束日期之间的天数
```sql
datediff(date1,date2)
```
## 流程控制函数
1. if函数
```sql
if(expr1,expr2,expr3)
```
2. ifnull函数
```sql
ifnull(expr1,expr2)
```
3. case函数
```sql
case expr
when expr1 then expr2
when expr3 then expr4
else expr5
end
```





