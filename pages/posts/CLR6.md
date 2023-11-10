---
title: CLR-属性
date: 2023-07-25T16:00:00.000+00:00
lang: zh
duration: 10min
type: note
---

## 属性与字段

```cs
// AIP
public String Name{get;set;}

// 字段
private String name;
public String Name{
  get{}
  set{}
}
```

·属性不能作为ref与out参数传递给方法，但是字段可以

·属性方法可以抛出异常，但是字段不行

·要线程同步就不要属性，而是方法（通过同步锁可以实现线程安全）

```cs
public class BankAccount
{
    private decimal balance;
    private object lockObject = new object();

    public decimal GetBalance()
    {
        lock (lockObject)
        {
            return balance;
        }
    }

    public void SetBalance(decimal value)
    {
        lock (lockObject)
        {
            balance = value;
        }
    }
}
```

