---
title: 重构—第五章 重新组织你的函数
date: 2023-09-24T16:00:00.000+00:00
lang: zh
duration: 10min
type: note
---

## 提炼函数

```cs
void printOwing(double amount) {
  printBanner();
  //print details
  System.out.println ("name:" + _name);
  System.out.println ("amount" + amount);
}
```

=>

```cs
void printOwing(double amount) {
  printBanner();
  printDetails(amount);
}
void printDetails (double amount) {
  System.out.println ("name:" + _name);
  System.out.println ("amount" + amount);
}
```

## 函数内联化

```cs
int getRating() {
  return (moreThanFiveLateDeliveries()) ? 2 : 1;
}
boolean moreThanFiveLateDeliveries() {
  return _numberOfLateDeliveries > 5;
}
```

=>

```cs
int getRating() {
  return (_numberOfLateDeliveries > 5) ? 2 : 1;
}
```

## 临时变量内联化

如果有一个临时变量只被表达式赋值一次，应该替换掉。

```cs
double basePrice = anOrder.basePrice();
return (basePrice > 1000)
```

=>

```cs
return (anOrder.basePrice() > 1000)
```

## 以查询取代临时变量

局部变量会使代码难以被提取，尽可能替换成查询式

```cs
double basePrice = _quantity * _itemPrice;
if (basePrice > 1000)
  return basePrice * 0.95;
else
  return basePrice * 0.98;
```

=>

```cs
if (basePrice() > 1000)
  return basePrice() * 0.95;
else
  return basePrice() * 0.98;
...
double basePrice() {
  return _quantity * _itemPrice;
}
```

## 引入解释性变量

```cs
if ( (platform.toUpperCase().indexOf("MAC") > -1) && 
    (browser.toUpperCase().indexOf("IE") > -1) &&
    wasInitialized() && resize > 0 )
{
  // do something
}
```

=>

```cs
final boolean isMacOs = platform.toUpperCase().indexOf("MAC") > -1;
final boolean isIEBrowser = browser.toUpperCase().indexOf("IE") > -1;
final boolean wasResized = resize > 0;
if (isMacOs && isIEBrowser && wasInitialized() && wasResized) 
{
  // do something
}
```

## 分解临时变量

每次赋值创建一个独立的对应的临时变量

```cs
double temp = 2 * (_height + _width);
System.out.println (temp);
temp = _height * _width;
System.out.println (temp);
```

=>

```cs
final double perimeter = 2 * (_height + _width);
System.out.println (perimeter);
final double area = _height * _width;
System.out.println (area);
```

## 移除对参数的赋值动作

```cs
int discount (int inputVal, int quantity, int yearToDate) {
  if (inputVal > 50) inputVal -= 2;
```

=>

```cs
int discount (int inputVal, int quantity, int yearToDate) {
  int result = inputVal;
  if (inputVal > 50) result -= 2;
```

## 以函数对象取代函数

```cs
class Order...
double price() {
  double primaryBasePrice;
  double secondaryBasePrice;
  double tertiaryBasePrice;
  // long computation;
  ...
}
```

## 替换你的算法

```cs
String foundPerson(String[] people){
  for (int i = 0; i < people.length; i++) {
    if (people[i].equals ("Don")){
      return "Don";
    }
    if (people[i].equals ("John")){
      return "John";
    }
    if (people[i].equals ("Kent")){
      return "Kent";
    }
  }
  return "";
}
```

=>

```cs
String foundPerson(String[] people){
  List candidates = Arrays.asList(new String[] {"Don", "John", "Kent"});
  for (int i=0; i<people.length; i++)
    if (candidates.contains(people[i]))
    return people[i];
  return "";
}
```

