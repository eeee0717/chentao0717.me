---
title: 重构—第九章 简化函数调用
date: 2023-09-28T16:00:00.000+00:00
lang: zh
duration: 10min
type: note
---

## 重新命名函数

函数的名称未能解释函数的用途

## 添加参数

某个函数需要从调用端得到更多的信息

## 移除参数

函数本体不再需要某个参数

## 将查询函数和修改函数分离

某个函数几返回对象状态值，又修改对象状态

建立两个不同的函数，一个负责查询，另一个负责修改

将查询所得到的结果高速缓存于某个值域中，这样后续的重复查询就可以大大加快速度

## 令函数携带参数

若干个函数做了类似的工作，但函数本体却包含了不同的值

建立单一函数，以参数表达那些不同的值

## 以明确的函数取代参数

你有一个函数，其内完全取决于参数值而采取不同的反应

针对该参数的每一个可能值，建立一个函数

```cs
void setValue (String name, int value) {
  if (name.equals("height"))
    _height = value;
  if (name.equals("width"))
    _width = value;
  Assert.shouldNeverReachHere();
}
```

=>

```cs
void setHeight(int arg) {
  _height = arg;
}
void setWidth (int arg) {
  _width = arg;
}
```

## 保持对象完整

你从某个对象中取出若干值，将他们作为某一次函数调用的参数

改为使用传递整个对象

```cs
int low = daysTempRange().getLow();
int high = daysTempRange().getHigh();
withinPlan = plan.withinRange(low, high);
```

=>

```cs
withinPlan = plan.withinRange(daysTempRange());
```

## 以函数取代参数

缩减参数列

```cs
int basePrice = _quantity * _itemPrice;
discountLevel = getDiscountLevel();
double finalPrice = discountedPrice (basePrice, discountLevel);
```

=>

```cs
int basePrice = _quantity * _itemPrice;
double finalPrice = discountedPrice (basePrice);
```

## 引入参数对象

某些参数总是很自然的同时出现

以一个对象取代这些参数

![](https://raw.githubusercontent.com/eeee0717/chentaoImg/master/重构-9-1.png)

## 移除设置函数

你的class中的某个值域，应该在对象初创时被设值，然后就不再改变

去掉该值域的所有设值函数

```cs
class Account {
  private String _id;
  Account (String id) {
    setId(id);
  }
  void setId (String arg) {
    _id = arg;
  }
```

=>

```cs
class Account {
  private final String _id;
  Account (String id) {
    _id = id;
  }
```

## 隐藏某个函数

有一个函数从来没被其他class调用

将其修改为private

## 以「工厂函数」取代「构造函数」

```cs
class Employee {
  private int _type;
  static final int ENGINEER = 0;
  static final int SALESMAN = 1;
  static final int MANAGER = 2;
  Employee (int type) {
    _type = type;
}
```

```cs
static Employee create(int type) {
  switch (type) {
    case ENGINEER:
      return new Engineer();
    case SALESMAN:
      return new Salesman();
    case MANAGER:
      return new Manager();
    default:
      throw new IllegalArgumentException("Incorrect type code value");
  }
}
```

## 封装「向下转型」动作

某个函数返回的对象，需要由调用者执行「向下转型」的动作

将「向下转型」动作移动到函数中

```cs
Object lastReading() {
  return readings.lastElement();
}
```

=>

```cs
Reading lastReading() {
  return (Reading) readings.lastElement();
}
```

## 用异常取代错误码

```cs
int withdraw(int amount) {
  if (amount > _balance)
    return -1;
  else {
    _balance -= amount;
    return 0;
  }
}
```

=>

```cs
void withdraw(int amount) throws BalanceException {
  if (amount > _balance) throw new BalanceException();
  _balance -= amount;
}
```

## 以测试取代异常

面对一个「调用者可以预先加以检查」的条件，你抛出一个异常。

修改调用者，使他们在调用函数之前就检查

```cs
double getValueForPeriod (int periodNumber) {
  try {
    return _values[periodNumber];
  } catch (ArrayIndexOutOfBoundsException e) {
    return 0;
  }
}
```

=>

```cs
double getValueForPeriod (int periodNumber) {
  if (periodNumber >= _values.length) return 0;
  return _values[periodNumber];
}
```

