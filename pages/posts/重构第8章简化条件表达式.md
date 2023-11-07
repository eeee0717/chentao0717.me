---
title: 重构—第八章 简化条件表达式
date: 2023-09-27T16:00:00.000+00:00
lang: zh
duration: 10min
type: note
---

## 分解条件式

```cs
if (date.before (SUMMER_START) || date.after(SUMMER_END))
  charge = quantity * _winterRate + _winterServiceCharge;
else charge = quantity * _summerRate;
```

=>

```cs
if (notSummer(date))
  charge = winterCharge(quantity);
else charge = summerCharge (quantity);
```

## 合并条件式

```cs
double disabilityAmount() {
  if (_seniority < 2) return 0;
  if (_monthsDisabled > 12) return 0;
  if (_isPartTime) return 0;
// compute the disability amount
}
```

=>

```cs
double disabilityAmount() {
  if (isNotEligableForDisability()) return 0;
  // compute the disability amount
```

## 合并重复的条件片段

```cs
if (isSpecialDeal()) {
  total = price * 0.95;
  send();
}
else {
  total = price * 0.98;
  send();
}
```

=>

```cs
if (isSpecialDeal())
  total = price * 0.95;
else
  total = price * 0.98;
send();
```

## 移除控制标记

```cs
boolean found = false;
for (int i = 0; i < people.length; i++) {
  if (! found) {
    if (people[i].equals ("Don")){
      sendAlert();
      found = true;
    }
    if (people[i].equals ("John")){
      sendAlert();
      found = true;
    }
  }
}
```

=>

```cs
void checkSecurity(String[] people) {
  for (int i = 0; i < people.length; i++) {
    if (people[i].equals ("Don")){
      sendAlert();
      break;
    }
    if (people[i].equals ("John")){
      sendAlert();
      break;
    }
  }
}
```

## 以卫语句取代嵌套条件式

```cs
double getPayAmount() {
  double result;
  if (_isDead) result = deadAmount();
  else {
    if (_isSeparated) result = separatedAmount();
    else {
      if (_isRetired) result = retiredAmount();
      else result = normalPayAmount();
    };
  }
return result;
};
```

=>

```cs
double getPayAmount() {
  if (_isDead) return deadAmount();
  if (_isSeparated) return separatedAmount();
  if (_isRetired) return retiredAmount();
  return normalPayAmount();
};
```

## 以多态取代条件式

```cs
double getSpeed() {
  switch (_type) {
    case EUROPEAN:
      return getBaseSpeed();
    case AFRICAN:
      return getBaseSpeed() - getLoadFactor() * _numberOfCoconuts;
    case NORWEGIAN_BLUE:
      return (_isNailed) ? 0 : getBaseSpeed(_voltage);
    }
    throw new RuntimeException ("Should be unreachable");
}
```

![Image.png](/img/重构-8-1.png)

## 引入null对象

你需要再三检查「某物是否为null value」

```cs
if (customer == null) plan = BillingPlan.basic();
else plan = customer.getPlan();
```

## 引入断言

```cs
double getExpenseLimit() {
  // should have either expense limit or a primary project
  return (_expenseLimit != NULL_EXPENSE) ?
    _expenseLimit:
    _primaryProject.getMemberExpenseLimit();
}
```

=>

```cs
double getExpenseLimit() {
  Assert.isTrue (_expenseLimit != NULL_EXPENSE || _primaryProject != null);
  return (_expenseLimit != NULL_EXPENSE) ?
    _expenseLimit:
    _primaryProject.getMemberExpenseLimit();
}
```

Assert class应该有多个函数，函数名称应该帮助程序员理解其功用。除了isTrue() 之外，你还可以为它加上equals() 和shouldNeverReachHere() 等函数。

