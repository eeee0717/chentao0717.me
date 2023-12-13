---
title: Notes - Chen Tao
plum: true
display: ''
wrapperClass: 'text-center'
pinned:
  Pinned:
  - name: 'MySql基础'
    link: '/posts/Mysql/MysqlBase'
    desc: '基础的SQL语法与Mysql函数'
  - name: 'MySql进阶'
    link: '/posts/Mysql/MysqlAdvance'
    desc: '存储引擎、索引、SQL优化相关'
  - name: '《重 构》'
    link: '/posts/Refactor/Refactor'
    desc: '重构阅读笔记'
  - name: '《设计模式》'
    link: '/posts/DesignPattern/DesignPattern'
    desc: '设计模式阅读笔记'
  - name: 'CLR via C#'
    link: '/posts/CLR/CLR'
    desc: 'CLR via C#阅读笔记'
  - name: 'C#'
    link: '/posts/CSharp/CSharp'
    desc: 'C#学习笔记'
  - name: 'Dotnet'
    link: '/posts/Dotnet/Dotnet'
    desc: 'Dotnet学习笔记'
---

<SubNav />
<ListPinned :pinned="frontmatter.pinned" />
<ListPosts only-date type="note" />
