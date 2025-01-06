---
title: Rust in Depth - Chapter 1
date: 2025-01-06 09:31:52
lang: en
duration: 10min
type: blog
---

## Variables in Depth

When encountering more complex code, the basic definition of variables is not accurate enough. There are two important models in Rust.

### High-level Model

In the high-level model, the variable is just a **name** of the value.You can _Initiate_, _Move_ and _use_ in the program.

```rust
let mut x;
// Error❌: use of possibly-uninitialized `x`
// assert_eq!(x, 0);
x = 42;
// Ok✅
let y = &x;
x=43;
// Error❌: cannot assign to `x` because it is borrowed
assert_eq!(*y, 43);
```

### Low-level Model

In the low-level model, the variable is a **memory slot**. You can _Fill_ it with value.

Here is an example: `let x: usize`. It means that the variable `x` is a memory slot that can store a `usize` value.

Then `x=42` means that the value `42` is stored in the memory slot `x`. But the value of `&x` doesn't change.

> Using these two models can help us understand more complex code.

> This is the first time I try to write a blog in English, so maybe there are some grammatical errors. If you find any, please let me know. Thank you!
