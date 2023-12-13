---
title: CLR-类型基础
date: 2023-07-29T16:00:00.000+00:00
lang: zh
duration: 10min
type: note
---

## 1、所有类型都从System.Object派生

   new 操作符（CLR要求所有对象都通过new创建）

      1、计算类型及其所有基类（实例所需字节数、每个对象包含**类型对象指针**和**同步块索引**）

      2、从托管堆中分配类型要求的字节数，并初始化内存、自己为0

      3、初始化对象的**类型对象指针**和**同步块索引**成员

      4、调用类型的构造器，初始化实例对象；最终调用Object构造器，该构造器什么都不做，只是return

---

## 2、类型转换

   ·类型安全

   使用is 和 as来转型

   is检查对象是否兼容指定类型，只返回true或false，不抛出异常，返回false

   as类似于强制转换，不抛出异常，如果转型不成功则返回null

---

## 3、运行时的相互关系

   P90

![](https://raw.githubusercontent.com/eeee0717/chentaoImg/master/CLR-2-1.png)

