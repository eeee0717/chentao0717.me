---
title: Rust in Depth - Chapter 1
date: 2025-02-10 20:06:33
lang: en
duration: 10min
type: blog
art: connections
---

## Variables

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

## Ownership

- When some types implement the `Copy` trait, the value is shallow copied.
- When some types don't implement the `Copy` trait, such as `Box`, `String`, `Vec`(some complex types), the value will be moved or cloned.

```rust
// shallow copy
let x = 42; // `x` is an Integer, which implements the `Copy` trait
let y = x;  // `x` is copied to `y`
println!("x = {}, y = {}", x, y); // x and y still exist

// move
let s1 = String::from("hello");
let s2 = s1; // s1 is moved to s2
// println!("s1 = {}", s1); // Error❌: value moved here

// deep copy
let s1 = String::from("hello");
let s2 = s1.clone(); // s1 is cloned to s2
println!("s1 = {}, s2 = {}", s1, s2); // s1 and s2 still exist
```

so, the question is which types implement the `Copy` trait?

### Copy trait

> `Copy` is only happend on the stack which has a high performance. And `Copy` is everywhere in Rust.

1. Interger(u32, usize, i32, i64...)
2. Float(f64)
3. Boolean
4. Char
5. Tuple((i32, u32)✅, (String, i32)❌)
6. Reference(&T✅, &mut T❌)

Now, let's see why `Box` doesn't implement the `Copy` trait.

```rust
let x = Box::new(42);
let y = x; // x is moved to y
// println!("x = {}", x); // Error❌: value moved here
```

If `y=x` is a shallow copy, it means that these two variables point to the same memory location. When `x` and `y` free the memory, the memory will be freed twice, which is a huge catastrophe.

Here is another example:

```rust
let x = 42;
let y = Box::new(32);
{
  let z = (x, y); // x is copied to z, y is moved to z
}
println!("x = {}, y = {}", x, y); // this will occur an error❌, because y is moved to z
```

## Borrowing and Lifetime

### Shared Reference

A variable can have multiple shared references, but it can't the value of the variable can't be changed.

```rust
fn cache(input: &u32, sum: &mut u32){
  *sum = *input + *input;
  assert_eq!(*sum, 2*(*input)); // This assert will always pass
}
```

> This is the first time I try to write a blog in English, so maybe there are some grammatical errors. If you find any, please let me know. Thank you!
