---
title: 重构—第六章 在对象之间搬移特性
date: 2023-09-25T16:00:00.000+00:00
lang: zh
duration: 10min
type: note
---

## 搬移函数

如果一个class有太多行为，或者一个class与另一个class有太多合作而形成高度耦合，则需要搬移函数。

```cs
class Account...
double overdraftCharge() { //译注：透支金计费，它和其他class的关系似乎比较密切。
  if (_type.isPremium()) {
    double result = 10;
    if (_daysOverdrawn > 7) result += (_daysOverdrawn - 7) * 0.85;
    return result;
  }
  else return _daysOverdrawn * 1.75;
  }
}
```

=>

```cs
class AccountType...
double overdraftCharge(Account account) {
  if (isPremium()) {
    double result = 10;
    if (account.getDaysOverdrawn() > 7)
      result += (account.getDaysOverdrawn() - 7) * 0.85;
    return result;
  }
  else return account.getDaysOverdrawn() * 1.75;
}
```

## 搬移值域

如果一个class的值域有另外一个class频繁的使用，则需要搬移值域。

```cs
class Account...
  private AccountType _type;
  private double _interestRate;
  double interestForAmount_days (double amount, int days) {
    return _interestRate * amount * days / 365;
  }
```

=>

```cs
class Account... 添加get set方法
double interestForAmountAndDays (double amount, int days) {
  return getInterestRate() * amount * days / 365;
}
private void setInterestRate (double arg) {
  _type.setInterestRate(arg);
}
private double getInterestRate () {
  return _type.getInterestRate();
}
```

## 提炼类

如果一个class做了应该由两个class做的事，则需要提炼。

![Image.png](/img/重构-6-1.png)

## 将类内联化

某个类没有做太多的事情，把这个类的所有特性搬到另一个类中。

![Image.png](/img/重构-6-2.png)

## 隐藏「委托关系」

在server端建立客户所需的所有函数，用于隐藏委托关系

![Image.png](/img/重构-6-3.png)

## 移除中间人

某个class做了过多的简单委托动作

让客户直接调用delegate

```cs
class Person...
  Department _department;
  public Person getManager() {
    return _department.getManager();
  }
class Department...
  private Person _manager;
  public Department (Person manager) {
    _manager = manager;
  }

manager = john.getManager();
```

=>

```cs
class Person...
public Department getDepartment() {
  return _department;
}

manager = john.getDepartment().getManager();
```

## 引入外加函数

使用的api中不存在该函数，但你无法修改源代码。

```cs
Date newStart = new Date (previousEnd.getYear(),
                      previousEnd.getMonth(), previousEnd.getDate() + 1);
```

=>

```cs
Date newStart = nextDay(previousEnd);
private static Date nextDay(Date arg) {
// foreign method, should be on date
  return new Date (arg.getYear(),arg.getMonth(), arg.getDate() + 1);
}
```

## 引入本地扩展

![Image.png](/img/重构-6-4.png)

