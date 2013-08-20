


# masync


Statically-typed Monadic Asynchronous Control Flow Library for JavaScript/TypeScript/AltJSs




## Abstract

**masync** is an asynchronous control flow library for JavaScript, TypeScript and other AltJSs. masync shares the goal with [jQuery.deferred](http://api.jquery.com/category/deferred-object/) or [async.js](https://github.com/caolan/async) but masync is **not** based on any [Promises or Deferreds](http://wiki.commonjs.org/wiki/Promises). masync is simpler than Promise but more flexible and powerful. You are no longer bothered by *Callback Hell* because you can write asynchronous codes like a syncronous codes with masync. Furthermore you can exchange Promises, Node-style callback functions and Generators with asynchronous data of masync.

Let's see a first example. Create a HTML file that has following codes. 

    <script type="text/javascript" src="masync.js"></script>
    <script type="text/javascript">
    masync.run(
        masync.log("Hello, ")
        masync.wait(3000),
        masync.log("asynchronous world!")
    );
    </script>

Create a new tab and open JavaScript developer's console. Then drag and drop the HTML file to the empty tab to execute the code. You will get "Hello, asynchronous world!" in your console **three seconds later**. `masync.wait` stops execution in the specified milliseconds. `masync.log` prints a text like `console.log` in console. `masync.run` begin those tasks sequentially. But don't mistake asynchronous for synchronous. **These codes run in asynchronous.**

Here's next example. `masync.wget` send XMLHttpRequest and return the data **in asynchronous**. You can pass the result data to `masync.log` directly. You don't need to use your callback function to finish the task. The following code requests *first.txt* and prints contents of the text file, then requests *second.txt* and print it in console. It's looks like synchronous, but asynchronous.

    masync.run(
        masync.log(masync.wget("first.txt")),
        masync.log(masync.wget("second.txt"))        
    );

If you want to process those tasks in parallel, you can use `parallel` function as below:

    masync.run(
        masync.parallel(
            masync.log(masync.wget("first.txt")),
            masync.log(masync.wget("second.txt"))
        )
    );

Both of requests begin in parallel. If *first.txt* is much larger than *seconds.txt*, you will see the content of *second.txt* in advance of *first.txt* in the console.

You can combine parallel and sequential tasks at will. You can apply a asynchronous function to asynchronous data and *Callback Hell* will be expelled. A framework of masync is based on [Monad](http://www.haskell.org/haskellwiki/All_About_Monads) and masync is inspired by IO Monad in Haskell. This framework is very simple, though, thus flexible and powerful. 

## API Reference

### Primitive Functions

--------------------

#### pure

    pure(v: T): Async<T>

Construct a Async object from a regular value. For example, `pure(42)` is Async object that do nothing but returns just `42` in asynchronous.

----

#### lift

    lift(f: (a: A, ..., y: Y) => Z): (a: Async<A>, ..., y: Async<Y>) => Async<Z>

Lift a regular function up to a Async function. CAUTION: `lift` takes no thought for `this`. So `lift(console.log)` is invalid because `console.log` needs `console` as `this` when it's be called. You need to write as `lift(console.log.bind(console))`.
 
----

#### fmap

    fmap(f: (a: A) => B, a: Async<A>) => Async<B>

Apply a regular function `f` to a Async object `a`. If the parameter function have 2 or more parameters, you should use `lift` instead of `fmap`. 

    function toUpperCase(str){
        return str.toUpperCase();
    }

    masync.run(
        masync.log(masync.fmap(toUpperCase, masync.get("hoge.txt")))
    );

This function is also useful when you want to access the raw result value of an asynchronous task.

    masync.run(
        masync.fmap(function(hoge){
            console.log(hoge);
        }, masync.get("hoge.txt"));
    );

----

#### ap

    ap(f: Async<(a: A) => B>, a: Async<A>) => Async<B>

Apply a Async function to a Async object. You will not use it.

----

#### bind

    bind(x: Async<A>, f: (a: A)=>Async<B>) => Async<B>

Bind a Async object and a function. The function `f` receives a value from `x`. Example:

    masync.run(
        masync.bind(masync.get("hoge"), masync.log)
    )

----

### Control Flow

------------

#### wait

    function wait(milliseconds: Async<number>): Async<void>;
    function wait(milliseconds:       number ): Async<void>;    

Wait in the specified time span.

----

#### series

    function series(a: Async<A>, b: Async<B>, ...., z: Async<Z>): Async<Z>

Do those tasks sequentially in asynchronous. Example:

    maysync.run(
        masync.parallel(
            masync.series(
                masync.wait(1000), 
                masync.log("Hello, ")
            ),
            masync.series(
                masync.wait(2000), 
                masync.log("World!")
            )
        )
    );

This prints "Hello, " a seconds later and "World!" prints two seconds later.

----

#### parallel

    function parallel(a: Async<A>, b: Async<B>, ...., z: Async<Z>): Async<void>

Do tasks in parallel. Return values are discard. If you need to the return value, you can `cache` function.

    var hoge = masync.cache(masync.get("hoge.txt"));
    var piyo = masync.cache(masync.get("piyo.txt"));
    maysync.run(
        masync.parallel(hoge, piyo),
        masync.log(masync.strcat(hoge, piyo))
    );

This code begin both of XHR requests at the same time. In second evaluation of `hoge` and `piyo`, it does't request and returns cached value.



----

#### run

    function run(a: Async<A>, b: Async<B>, ..., z: Async<Z>): void

Begin a asynchronous task in effect. Those tasks of parameters executes sequentially like `series` function. You need to use this function at least once in your code.

----

#### fail

    function fail(): Async<void>

Cause a failure state. Failure state spreads to upper level of calling stack. If Failure state reaches the top level(`masync.run`), an error is thrown. You can't send a Error object with `fail` function. You should focus **where the error caused** but **what is the error**.



Example:

    masync.run(
        masync.log("before"),   
        masync.fail(),
        masync.log("after")
    );

It will prints "before" and throws error. "after" will not be printed. 

----

#### recover

    function recover(defaultValue: Async<T>, x: Async<T>): Async<T>

Recover a failure state.

    var failureTask = masync.series(
        masync.fail(), 
        masync.pure(10)
    );

    masync.run(
        masync.log(masync.recover(20, failureTask))   // prints "20"
    );

----

### Utilities

----------

#### log

    log(text: Async   <string>): Async<void>
    log(text:          string ): Async<void>
    log(text: Promise <string>): Async<void>

Prints a string in console. This is a lifted function of `console.log`.

----

#### get

    wget(url: Async<string>): Async<string>
    wget(url:       string ): Async<string>

Send XMLHttpRequest in *GET* method and return the data.

    masync.run(masync.log(masync.get("foo.txt")));     // prints the content of foo.txt

----

#### inject

    inject(f: ()=>T): Async<T>

Call the parameter function and return a value as Async object. This function is just a functional version of `pure`. `pure(f())` is not equal to `inject(f)`.

    var counter = 0;
    function count(){
        return counter++;
    }

    masync.run(
        masync.log(masync.inject(count)),
        masync.log(masync.inject(count)),
        masync.log(masync.inject(count))
    );

This code prints "0", "1", "2".

----

#### cache

    cache(x: Async<T>): Async<T>

Cache the return value of the Async object. 

----

### Array Operations

----

#### array

    array(a: Async<T>, b: Async<T>, ...): Async<T[]>

----

#### collect

    collect(xs: Async<T>[]): Async<T[]>

----

#### map

    map(f: (t: T) => S, xs: Async<T[]>): Async<S[]>

----

#### foldl

    foldl(f: (t: T, s: S) => S, x: Async<T>, xs: Async<T[]>): Async<S[]>

`... f(f(f(x, xs[0]), xs[1]), xs[2]) ...` In other words, let @ as infix operator of `f`, `x @ xs[0] @ xs[1] @ xs[2] ...`

----

### Casting

----

#### resolve

    resolve(promise: Promise<T>): Async<T>

----

#### promise

    promise(a: Async<T>): Promise<T>

----

#### wrap

    wrap(f: (a: A, ..., y: Y, callback: (err: Error, z: Z)=>void)=>void): (a: Async<A>, ..., y: Async<Y>) => Async<Z>

Converts a Node-style asynchronous function into a Async function.

----

#### peel

    peel(f: (a: Async<A>, ..., y: Async<Y>)=>Async<Z>): (a: A, ..., y: Y, (err: Error, z: Z) => void) => void ;

Converts a Async function into a Node-style asynchronous function.

----

#### generate

    function generate<T>(generator: Generator, a: Async<T>): Yieldable<T>

Converts a Async object into *a yieldable object*. For example, 

    var task = masync.get("hoge.txt");

    function* main(){
        var hoge = yield masync.generate(generator, task);
        console.log(hoge);  // prints the content of hoge.txt
    }

    var generator = main();
    generator.next();

----

### Lifted Functions

----

I'm planning to provide following functions as asynchronous functions in `masync` module:

* string: toString, strcat, toUpperCase, toLowerCase, 
* number: add, sub, mul, div, abs, max, min, parseFloat, parseInteger
* boolean: and, or, not, xor
* setTimeout, clearTimeout, setInterval, clearInterval





## How to implement your own Async objects?

You need not any external libraries to implement your own Async object. Your task must have the following type signature:

    interface Async<T> {
        (succ: (t: T)=>void, fail: ()=>void): void;
    } 

It means Async task is just a **function** that have two parameters: `succ` and `fail`. Those parameters are **function** too. When an other Async task needs to get a value from this Async object, this Async object is called. When your task finished it's own action successfully, the task call the `succ` function with the result, or call the `fail` function if the task failed. It's also known as *Continuation-passing style*.

As first example, let't implements a simple Async object. The following function `wait1000` is a Async object. This task waits in a seconds then prints "Hellow, world!", and then returns "result".

    function wait1000(succ, fail){
        setTimeout(function(){ 
            console.log("Hello, world!");
            succ("result");
        }, 1000);
    }


Don't confuse, `wait1000` is Async task but `wait1000(s, f)` is *not*. Async task is a *function*. 

`wait1000` have two parameters, `succ` and `fail`. An asynchronous functions will call those parameter functions when their asynchronous task is over or failed. `wait1000` also calls it when it finish it's own task. This task always success, but when your task fail, it must call `fail` function. You can always begin the task with calling the function with two parameters, `succ` and `fail`. Now you have no interest to the result of the task so you have to pass empty functions as parameters:

    wait1000(function(result){}, function(){});

Execute it. You will got a message "Hello, world!" from your first asynchronous task in your console. It's all about the asynchronous framework of masync. You can combine those your own task with other tasks by masync functions.

## Design Concept

* Statically-typed
* Function-oriented
* `this` context independent
* `new` free
* Stateless 

## Licensing

MIT!

## Versions

* 0.1.0 (2013/8/16)

Now masync is in very early-stage!

----

Copyright 2013 Kon