---
title: Rust in Depth - Chapter 2
date: 2025-01-22 14:49:24
lang: en
duration: 10min
type: blog
inperson: true
---

## Monomorphization

Today, we are going to talk about monomorphization. It is an important concept in Rust, which is used to optimize the performance of the code.

Let's show the example:

```rust
pub fn strlen(s: impl AsRef<str>) -> usize {
    s.as_ref().len()
}

fn main() {
    strlen("Hello");
    strlen(String::from("hello"));
}
```

In this example, `strlen` function have a parameter which implements the `AsRef<str>` trait. When `main` function calls it in two different ways, the Rust compiler will generate two different functions for each call. It is different from other languages, such as C/C++.

Monomorphization actually helps the Rust compiler to improve the performance of the code. But it have a problem in distributing the binary file. The binary file will be larger than other languages, and the most important is the compile function **only** can be generated **when the function is called**.

## Static Dispatch

Static dispatch means Rust compiler can generate the code at compile time.

```rust
pub trait Hei{
    fn hei(&self);
}
impl Hei for &str{
  fn hei(&self){
    println!("Hei, {}", self);
  }
}
pub fn foo(h: impl Hei){
  h.hei();
}
```

In this example, the `foo` function have a parameter which implements the `Hei` trait. This is a generic function, and the Rust compiler will generate the code at compile time. Actually, the compiler do not know the type of `h` at compile time, and this is where _monomorphization_ comes into play.

such as this:

```rust
// compiler generate
pub fn foo_str(h: &str){
  h.hei();
}

fn main(){
  foo("world");
}
```

So, this is Static Dispatch.

## Dynamic Dispatch

Here we have an idea.

```rust
fn bar(s: &[dyn Hei]){
  for i in s{
    i.hei();
  }
}
fn main(){
  let v = vec!["world", "hello"];
  bar(&v);
  let error = vec![String::from("world"), "hello"]; // This will cause an error
}
```

Imagine that we have a multiple elements implements the `Hei` trait, and we want to use `bar` function to call the `hei` function. But the Rust compiler will cause an error, because the `s` parameter don't have `Sized`.

Why? Static Dispatch don't need to Sized the type of parameter, but Dynamic Dispatch need to Sized the type of parameter.

Here is an example i think it can well explain the difference between Static Dispatch and Dynamic Dispatch.

```rust
trait Plugin {
    fn execute(&self);
}

struct PluginA;
impl Plugin for PluginA {
    fn execute(&self) {}
}

struct PluginB;
impl Plugin for PluginB {
    fn execute(&self) {}
}

fn run_plugin(plugin: &dyn Plugin) {
    plugin.execute();
}

fn main() {
    let plugin_a = PluginA;
    let plugin_b = PluginB;

    run_plugin(&plugin_a);
    run_plugin(&plugin_b);
}
```

The Plugin System is a good example to show why we need Dynamic Dispatch. Because we actually don't know the size of the plugin at compile time. And Rust compiler must know all the size of the type at compile time.

So, how to fix the error of the first example? Here are two ways:

```rust
// use `&`
fn bar(s: &[&dyn Hei]){
  for i in s{
    i.hei();
  }
}

// use `Box`
fn bar(s: &[Box<dyn Hei>]){
  for i in s{
    i.hei();
  }
}
fn main(){
let v = vec![String::from("world"), "hello"];
bar(&v);
}

```

## Fat Pointer(VTables)

Next, I want to show you how the Rust compiler find the function of the trait.

```rust
pub trait Hei{
    fn hei(&self);
}
impl Hei for &str{
  fn hei(&self){
    println!("Hei, {}", self);
  }
}

fn main(){
  let s = "world";
  s.hei();
}
```

Here is an example. The Rust compiler will generate a _Fat Pointer_ for the `&str` type. The _Fat Pointer_ contains two parts: the first part is the pointer to the data, and the second part is the pointer to the VTable.

```rust
// compiler generate
// &str -> &dyn Hei
// 1. pointer to the &str
// 2. &HeiVtable{
//  hei: &<str as Hei>::hei
// }

fn main(){
  let s = "world";
  s.hei();
  // s.vtable.hei(s.pointer);
}
```

### Multiple Traits

If we want to use multiple traits, did the Rust compiler generate multiple VTables?

The answer is _Yes_.

```rust
// ignore this bug
pub fn baz(s: &dyn Hei + dyn Hei2){
  s.hei();
  s.hei2();
}
```

The Rust compiler will generate two VTables for the `s`.

```rust
// compiler generate
// &str -> &dyn Hei + dyn Hei2
// 1. pointer to the &str
// 2. &HeiVtable{
//  hei: &<str as Hei>::hei
// }
// 3. &Hei2Vtable{
//  hei2: &<str as Hei2>::hei2
// }
```

And Rust give us a way to optimize the VTables which means make them into one VTable.

```rust
pub trait HeiAsRef: Hei + Hei2 {}
pub fn barz<T: HeiAsRef>(s: &T) {
  s.hei();
  s.hei2();
}
```
