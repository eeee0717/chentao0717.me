---
title: 重构—第三章 代码的坏味道
date: 2023-09-23T16:00:00.000+00:00
lang: zh
duration: 10min
type: note
---

1. ## 重复的代码

提炼出重复的代码，用以复用

2. ## 过长的函数
- 分解函数，当需要使用注释时，将说明的东西写进独立函数
- 如果函数内有大量的参数和临时变量，使用Replace Temp with Query（将临时变量转换为函数的形式）
- 如果还是太多可以使用Replace Method with Method Object（将函数转换成函数对象，生成新的类）
3. ## 过大类：单一类具有太多职责

使用extract class将多个相同前后缀的变量提炼到一个组件内。

4. ## 过长参数列

太长的参数列导致函数难以理解，不易使用。

使用Replace Parameter with Method，用函数 [get()] 取代参数。

5. ## 发散式变化

每个对象最好都只因一种变化而修改，也就是说如果新加入一个数据库，只需要修改一个函数。

6. ## 散弹式修改

如果遇到某种变化需要在不同的类做出修改，则很容易忘记某个重要的修改。

这种情况需要将所有需要修改的代码放进同一个类中，通常可以使用内联类的方式。

7. ## 依恋情结

如果一个某个函数为了计算某个值几乎调用了另一个对象的大部分函数，则需要使用move method进行函数的分解

8. ## 数据泥团

将[总是绑在一起出现的数据]放进属于它们自己的对象中，简化函数的调用动作。

9. ## 基本型别偏执

将相关的数据组织成一个类

```cs
// 订单

public class Order {  
private String customName;  
private String customSex;

private Integer orderId;  
private Integer price;

}
----

// 把custom相关字段封装起来，在Order中引用Custom对象

public class Custom {  
private String name;  
private String address;

}

// 订单

public class Order {  
private Custom custom;  
private Integer orderId;  
private Integer price;

}
```

10. ## switch惊悚现身

面向对象的最明显特征就是：少用switch，switch语句的问题在于重复。

使用[多态]来替换，可以使用工厂+策略模式 [https://blog.csdn.net/geniusxi/article/details/78581542](https://blog.csdn.net/geniusxi/article/details/78581542)

11. ## 平行继承体系

每当你为某个类增加一个子类时，必须为另外一个类增加子类，那么就有问题。这种情况我们让一个继承体系的实例去引用另一个继承体系。

12. ## 冗余类

如果一个类没什么价值，应该让他消失。比如父子类之间的差别不大，就可以合并成一个。

13. ## 夸夸其谈未来性

不要去考虑未来将有可能发生的事，如果用不到就不值得。

14. ## 令人迷惑的暂时值域

某个实例变量仅为某种特定情况而设，这样的代码就会不易理解，可以提炼新的对象以适应此种特殊情况。

15. ## 过度耦合的消息链

避免一长串连续的get()函数，减少代码冗余。

16. ## 中间转手人

万事必有反，如果中间人承受的委托过多，就会造成真正负责的类不做事，这种情况要移除中间人，也就是把***Message Chains（过度耦合的消息链）***的处理方式反过来。

17. ## 狎昵关系

说的是两个类过于亲密，例如双向关联，两个类过度依赖。

18. ## 异曲同工的类

是指两个类做的差不多的事，需要根据不同的业务把方法搬移到不同的类中。

19. ## 不完美的程序库类

当你用别人的类库但不能满足需求时，需要扩展可以试试*Introduce Local Extension（引入本地扩展）*进行重构，假设我们有一个Date类，我们在不能修改源码并且需要扩展的时候，可以建立一个子类继承Date类，在子类中进行扩展。

20. ## 纯稚的数据类

简单的说就是把字段用get、set方法封装起来，把私有变量隐藏好。

21. ## 被拒绝的遗赠

意思是子类不想继承父类的接口和方法。

传统方法是通过新建一个兄弟类

但不建议，可以使用Replace Inheritance with Delegation（以委托替代继承）

22. ## 过多的注释

并不是所有注释都是友好的，加入代码足够清晰则不需要注释

