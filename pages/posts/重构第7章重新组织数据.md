---
title: 重构—第七章 重新组织数据
date: 2023-09-26T16:00:00.000+00:00
lang: zh
duration: 10min
type: note
---

## 自封装值域

「间接访问」：可以通过覆写的方法改变获取数据的途径
「直接访问」：代码比较容易阅读

```cs
private int _low, _high;
boolean includes (int arg) {
  return arg >= _low && arg <= _high;
}
```

=>

```cs
private int _low, _high;
boolean includes (int arg) {
  return arg >= getLow() && arg <= getHigh();
}
int getLow() {return _low;}
int getHigh() {return _high;}
```

## 以对象取代数据值

![Image.png](/img/重构-7-1.png)

## 将实值对象改为引用对象

你有一个类，衍生出许多相等的实体，可以转化为单一对象

![Image.png](/img/重构-7-2.png)

## 将引用对象改为实值对象

如果有一个引用对象，很小且不可变，而且不易管理，可以将它变为一个实值对象

![Image.png](/img/重构-7-3.png)

## 以对象取代数组

```cs
String[] row = new String[3];
row [0] = "Liverpool";
row [1] = "15";
```

=>

```cs
Performance row = new Performance();
row.setName("Liverpool");
row.setWins("15");
```

## 复制「被监视的数据」

一个分层良好的系统应该将GUI处理事件和业务逻辑的代码分开

![Image.png](/img/重构-7-4.png)

## 将单向关联改为双向

开发初期，你可能会在两个classes之间建立一条单向连接，使其中一个可以引用另一个class。随着时间推移，你可能发现需要一个反向指针双向连接两个classes。

![Image.png](/img/重构-7-5.png)

## 将双向关联改为单向

两个classes之间有双向关联，但其中一个class不再需要另一个class的特性

## 以符号常量/字面常量取代魔法数

```cs
double potentialEnergy(double mass, double height) {
  return mass * 9.81 * height;
}
```

=>

```cs
double potentialEnergy(double mass, double height) {
  return mass * GRAVITATIONAL_CONSTANT * height;
}
static final double GRAVITATIONAL_CONSTANT = 9.81;
```

## 封装值域

```cs
public String _name
```

=>

```cs
private String _name;
public String getName() {return _name;}
public void setName(String arg) {_name = arg;}
```

## 封装群集

![Image.png](/img/重构-7-6.png)

## 以类取代型别码

![Image.png](/img/重构-7-7.png)

## 以子类取代型别码

![Image.png](/img/重构-7-8.png)

## 以State/Strategy 取代型别码

如果「type code 的值在对象生命期中发生变化」或「其他原因使得宿主类不能被subclassing 」可以使用该方法。

```cs
class Employee...
  void setType(int arg) {
    _type = EmployeeType.newType(arg);
  }
class EmployeeType...
  static EmployeeType newType(int code) {
    switch (code) {
      case ENGINEER:
        return new Engineer();
      case SALESMAN:
        return new Salesman();
      case MANAGER:
        return new Manager();
      default:
        throw new IllegalArgumentException("Incorrect Employee Code");
    }
  }
static final int ENGINEER = 0;
static final int SALESMAN = 1;
static final int MANAGER = 2;
```

## 以值域取代子类

如果各个子类的唯一差别只在「返回常量数据」的函数身上。

![Image.png](/img/重构-7-9.png)

