---
title: CSharp-Nunit单元测试
date: 2023-08-24T16:00:00.000+00:00
lang: zh
duration: 10min
type: note
---

## 创建一个类

```cs
namespace ClassLibrary1;

public class BankAccount
{
    private double balance;

    public BankAccount()
    {
    }

    public BankAccount(double balance)
    {
        this.balance = balance;
    }

    public double Balance
    {
        get { return balance; }
    }

    public void Add(double amount)
    {
        if (amount < 0)
        {
            throw new ArgumentOutOfRangeException(nameof(amount));
        }

        balance += amount;
    }

    public void Withdraw(double amount)
    {
        if (amount > balance)
        {
            throw new ArgumentOutOfRangeException(nameof(amount));
        }

        if (amount < 0)
        {
            throw new ArgumentOutOfRangeException(nameof(amount));
        }

        balance -= amount;
    }

    public void TransferFundsTo(BankAccount? otherAccount, double amount)
    {
        if (otherAccount is null)
        {
            throw new ArgumentNullException(nameof(otherAccount));
        }

        Withdraw(amount);
        otherAccount.Add(amount);
    }
}
```

## 编写单元测试代码

```cs
using ClassLibrary1;

namespace TestProject1;

public class Tests
{
    public class BankAccountTests
    {
        private BankAccount _account;

        [SetUp]
        public void Setup()
        {
            // ARRANGE
            _account = new BankAccount(1000);
        }

        [Test]
        public void Adding_Funds_Updates_Balance()
        {
            // ACT
            _account.Add(500);

            // ASSERT
            Assert.That(_account.Balance, Is.EqualTo(1500));
        }

        [Test]
        public void Adding_Negative_Funds_Throws()
        {
            // ACT + ASSERT
            Assert.Throws<ArgumentOutOfRangeException>(() => _account.Add(-500));
        }

        [Test]
        public void Withdrawing_Funds_Updates_Balance()
        {
            // ACT
            _account.Withdraw(500);

            // ASSERT
            Assert.AreEqual(500, _account.Balance);
        }

        [Test]
        public void Withdrawing_Negative_Funds_Throws()
        {
            // ACT + ASSERT
            Assert.Throws<ArgumentOutOfRangeException>(() => _account.Withdraw(-500));
        }

        [Test]
        public void Withdrawing_More_Than_Balance_Throws()
        {
            // ACT + ASSERT
            Assert.Throws<ArgumentOutOfRangeException>(() => _account.Withdraw(2000));
        }

        [Test]
        public void Transfering_Funds_Updates_Both_Accounts()
        {
            // ARRANGE
            var otherAccount = new BankAccount();

            // ACT
            _account.TransferFundsTo(otherAccount, 500);

            // ASSERT
            Assert.That(_account.Balance, Is.EqualTo(500));
            Assert.That(otherAccount.Balance, Is.EqualTo(500));
        }

        [Test]
        public void Transfer_To_Non_Existing_Account_Throws()
        {
            Assert.Throws<ArgumentNullException>(() => _account.TransferFundsTo(null, 2000));
        }
    }
}
```

