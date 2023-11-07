---
title: CSharp-接口
date: 2023-08-30T16:00:00.000+00:00
lang: zh
duration: 10min
type: note
---

为什么有接口？

1. **方便统一管理.另一个是方便调用**

假设有Dog类 Cat类，都需要实现Bark()的方法，如果是不同的人写，函数名字可能会不一样，因此使用接口来强制管理，方便调用。

2. 方便扩展

假设有一个Program类，需要用同一个方法实现打印不同的话，可以使用接口的方法，将接口作为参数传入类，即可简单实现。

[C#接口作用的深入理解_c#接口的作用_zhruifei的博客-CSDN博客](https://blog.csdn.net/zhruifei/article/details/78486099#:~:text=C%23,%E6%8E%A5%E5%8F%A3%E6%98%AF%E4%B8%80%E4%B8%AA%E8%AE%A9%E5%BE%88%E5%A4%9AC%23%E5%88%9D%E5%AD%A6%E8%80%85%E5%AE%B9%E6%98%93%E8%BF%B7%E7%B3%8A%E7%9A%84%E4%B8%9C%E8%A5%BF%EF%BC%8C%E7%94%A8%E8%B5%B7%E6%9D%A5%E5%A5%BD%E5%83%8F%E5%BE%88%E7%AE%80%E5%8D%95%EF%BC%8C%E5%AE%9A%E4%B9%89%E6%8E%A5%E5%8F%A3%EF%BC%8C%E9%87%8C%E9%9D%A2%E5%8C%85%E5%90%AB%E6%96%B9%E6%B3%95%EF%BC%8C%E4%BD%86%E6%B2%A1%E6%9C%89%E6%96%B9%E6%B3%95%E5%85%B7%E4%BD%93%E5%AE%9E%E7%8E%B0%E7%9A%84%E4%BB%A3%E7%A0%81%EF%BC%8C%E7%84%B6%E5%90%8E%E5%9C%A8%E7%BB%A7%E6%89%BF%E8%AF%A5%E6%8E%A5%E5%8F%A3%E7%9A%84%E7%B1%BB%E9%87%8C%E9%9D%A2%E8%A6%81%E5%AE%9E%E7%8E%B0%E6%8E%A5%E5%8F%A3%E7%9A%84%E6%89%80%E6%9C%89%E6%96%B9%E6%B3%95%E7%9A%84%E4%BB%A3%E7%A0%81%E3%80%82)

