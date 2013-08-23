


# masync


Statically-typed Monadic Asynchronous Control Flow Library for JavaScript/TypeScript/AltJSs




## Abstract

**masync** is an asynchronous control flow library for JavaScript, TypeScript and other AltJSs. masync shares the goal with [jQuery.deferred](http://api.jquery.com/category/deferred-object/) or [async.js](https://github.com/caolan/async) but masync is **not** based on any [Promises or Deferreds](http://wiki.commonjs.org/wiki/Promises). masync is simpler than Promise but more flexible and powerful. You are no longer bothered by *Callback Hell* because you can write asynchronous codes like a syncronous codes with masync. 

masync is standalone so it doesn't need other libraries such as jQuery or async.js. Furthermore you can exchange Promises, Node-style callback functions and Generators with asynchronous data of masync.

masync doesn't need any special features of JavaScript such as [generators](http://wiki.ecmascript.org/doku.php?id=harmony:generators), [Web Workers](http://www.w3.org/TR/workers/) or [fibers](https://github.com/laverdet/node-fibers). You can use masync everywhare JavaScript runs.

Statically-typed APIs are an exclusive property of masync. Whole of masync is written in [TypeScript](http://www.typescriptlang.org/) and you can statically verify type consistency of your TypeScript source code, however you can also use it from JavaScript or [other AltJSs](http://altjs.org/).


A framework of masync is based on [Monad](http://www.haskell.org/haskellwiki/All_About_Monads) and masync is inspired by IO Monad in Haskell. A synchronous object of masync is Monad. This framework is very simple, though, thus flexible and powerful. 

## Examples

Let's see a first example. Create a HTML file that has following codes. 

    <script type="text/javascript" src="https://rawgithub.com/kontan/masync/master/masync.js"></script>
    <script type="text/javascript">
    masync.run(
        masync.log("Hello, "),
        masync.wait(3),
        masync.log("asynchronous world!")
    );
    </script>

Create a new tab and open JavaScript developer's console. Then drag and drop the HTML file to the empty tab to execute the code. At first you will see "Hello, " in your console, then you will get "asynchronous world!" **three seconds later**. `masync.wait` stops execution in the specified milliseconds. `masync.log` prints a text like `console.log` in console. `masync.run` begin those tasks sequentially. However, don't mistake asynchronous for synchronous. **These codes run in asynchronous.**

Here's next example. `masync.get` send XMLHttpRequest and return the data **in asynchronous**. You can pass the result data to `masync.log` directly. You don't need to use your callback function to finish the task. The following code requests *first.txt* and prints contents of the text file, then requests *second.txt* and print it in console. It's looks like synchronous, but asynchronous.

    masync.run(
        masync.log(masync.get("first.txt")),
        masync.log(masync.get("second.txt"))        
    );

If you want to process those tasks in parallel, you can use `parallel` function as below:

    masync.run(
        masync.parallel(
            masync.log(masync.get("first.txt")),
            masync.log(masync.get("second.txt"))
        )
    );

Both of requests begin in parallel. If *first.txt* is much larger than *seconds.txt*, you will see the content of *second.txt* in advance of *first.txt* in the console. You can combine parallel and sequential tasks at will.

### sequential and parallel process 

You can freely combinate sequential tasks and parallel task. For example, let `a`, `b` ... `h` are synchronous task,
 
    masync.run(
        a,
        masync.parallel(b, masync.series(c, d)),
        masync.parallel(e, masync.series(f, g)),
        h
    );

In a diagram:

      --------------------------------------------> time 
    a ===>
    b     =============>
    c     ====>
    d          ====>
    e                   ========>
    f                   =====>
    g                         ======>
    h                                ====>
 
### statelessness

Most of asynchronous objects are stateless. It means you can reuse a asynchronous object in a variety of positions all you want. This code prints "Hey!" thrice in console. You are not a cause for concern about how many event handlers the asynchronous object has. 

    var hey = masync.log("Hey!");
    masync.run(
        hey,
        masync.wait(1),
        hey,
        masync.wait(0.5),
        hey
    );

### Function Application to Asynchronous Objects

You can apply a asynchronous function to asynchronous data. The following code prints "HELLO!". 

    var hello = masync.pure("Hello!");
    masync.run(masync.log(masync.toUpperCase(hello)));

### Raw Data Access

If you want to access a raw result of an asynchronous task in the worst way, `cache` and `inject` is useful. You can get a raw value from a cached asynchronous object by `()` after evaluation in callback function of `inject`.

    var a = masync.cache(masync.get("a.txt"));
    masunc.run(
        a,  // evaluate a
        masync.inject(function(){
            console.log(a().toUpperCase()); // a() is a raw string value
        });
    );

### Events Handling Without Callback

Also in event handling, callbacks are not needed. All you got to do is wait for an event to happen. For example, if you want to print a message "Button pressed!" when a button is pressed:

    masync.run(
        masync.waitForMouseDown(button),
        masync.log("Button pressed!")
    );

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

#### series

    series(a: Async<A>, b: Async<B>, ...., z: Async<Z>): Async<Z>

Do those tasks sequentially in asynchronous. Example:

    maysync.run(
        masync.parallel(
            masync.series(
                masync.wait(1), 
                masync.log("Hello, ")
            ),
            masync.series(
                masync.wait(2), 
                masync.log("World!")
            )
        )
    );

This prints "Hello, " a seconds later and "World!" prints two seconds later.


      series(a, b, c)

      |Start                            |Finish
      |------------------------------------------------> time
    a |==============>                  |
    b |               =======>          |
    c |                       =========>|

----

#### parallel

    parallel(a: Async<A>, b: Async<B>, ...., z: Async<Z>): Async<void>

Do tasks in parallel. Return values are discard. If you need to the return value, you can `cache` function.

    var hoge = masync.cache(masync.get("hoge.txt"));
    var piyo = masync.cache(masync.get("piyo.txt"));
    maysync.run(
        masync.parallel(hoge, piyo),
        masync.log(masync.strcat(hoge, piyo))
    );

This code begin both of XHR requests at the same time. In second evaluation of `hoge` and `piyo`, it does't request and returns cached value.

      parallel(a, b, c)

      |Start                          |Finish
      |------------------------------------------------> time
    a |==============================>|
    b |=============>                 |
    c |=====================>         |

----

#### fastest

    fastest(a: Async<T>, b: Async<T>, ...., z: Async<T>): Async<T>

Do tasks in parallel but finish when at least one task finished. It's useful for handling a timeout.

    masync.log(
        masync.fastest(
            masync.get("a.txt"),
            masync.seq(
                masync.wait(10),
                masync.pure("Error: timeouted.")
            )
        )
    )

In a diagram:

      fastest(a, b, c)

      |Start               |Finish
      |------------------------------------------------> time
    a |===========================>
    b |===================>|
    c |===================================>

----

#### branch

    branch(primal: Async<T>, sub: Async<any>): Async<T>

Runs sub task repeatedly until main finish.

    branch(a, b)

      |Start                            |Finish
      |------------------------------------------------> time
    a |================================>|    
    b |=======>=====>=======>======>=======>


----

#### repeat

    repeat(a: Async<any>, ..., z: Async<any>): Async<void>

Repeats tasks forever. This task never finish.

    repeat(a, b, c)

      |Start                      
      |------------------------------------------------> time
    a |====>             =====>             ======>
    b |     =====>             ==>                 =====...
    c |           ======>         =========>

----

#### when

    when(x: Async<boolean>, ifthen: Async<T>, ifelse?: Async<T>): Async<T> 

if-then-else control flow.

----

#### wait

    wait(seconds: Async<number>): Async<void>;
    wait(seconds:       number ): Async<void>;    

Wait in the specified time span. **The parameter is in seconds, not milliseconds**.

----

#### run

    run(a: Async<A>, b: Async<B>, ..., z: Async<Z>): void

Begin a asynchronous task in effect. Those tasks of parameters executes sequentially like `series` function. You need to use this function at least once in your code.

----

### Error Handling

----

#### fail

    fail(): Async<void>

Cause a failure state. Failure state spreads to upper level of calling stack. If Failure state reaches the top level(`masync.run`), an error is thrown. You can't send a Error object with `fail` function. You should focus **where the error caused** but **what is the error**.

This function doesn't change any state of a Async object. It changes only flow.


Example:

    masync.run(
        masync.log("before"),   
        masync.fail(),
        masync.log("after")
    );

It will prints "before" and throws error. "after" will not be printed. 

----

#### recover

    recover(defaultValue: Async<T>, x: Async<T>): Async<T>

Recover a failure state.

    var failureTask = masync.series(
        masync.fail(), 
        masync.pure(10)
    );

    masync.run(
        masync.log(masync.recover(20, failureTask))   // prints "20"
    );


----

#### capture

    capture(xs: Async<T>, callback: (message?: string)=>T): Async<T>

Capture a failure state and call the callback. 

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

    get(url: Async<string>): Async<string>
    get(url:       string ): Async<string>

Send XMLHttpRequest in *GET* method and return the data.

    masync.run(masync.log(masync.get("foo.txt")));     // prints the content of foo.txt

----

#### getImage

    getImage(url: Async<string>): Async<HTMLImageElement>
    getImage(url:       string ): Async<HTMLImageElement>

----
    
#### loadScript

    loadScript(url: Async<string>): Async<HTMLScriptElement>
    loadScript(url:       string ): Async<HTMLScriptElement>

----

#### inject

    inject(f: ()=>T): Async<T>

Call the parameter function and return a value as Async object. This function looks like just a functional version of `pure` but `pure(f())` is not equal to `inject(f)` because `f` is called each time when `inject(f)` is evaluated. 

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

    cache(x: Async<T>): Cached<T>

where: 

    interface Cached<T> extends Async<T> {
        (): T;
    }

Caches a Async object. `cache` is a very special function in masync because it is **stateful**. When a asynchronous object is evaluated, the task is executed every time. However, when a cached one is evaluated, the task is executed at the only first evaluation. A cached asynchronous object has it's state, evaluated or not.

A cached object is also a function that has no parameters. When it's called with no params, it returns the cached value. If the object isn't evaluated, it throws an error. You can use `series` or `parallel` to evaluate expressly.

    var a = masync.cache(masync.get("a.txt"));
    var b = masync.cache(masync.get("b.txt"));
    masync.run(
        
        masync.inject(()=>{
            try{
                // throws an error because a and b are not evaluated yet. 
                console.log(a() + b()); 
            }catch(e){
                // This error is expected.
            }
        }),

        // evaluate a and b in parallel.
        masync.parallel(a, b),
    
        // prints "ab".
        masync.inject(()=>{
            console.log(a() + b());
        })
    );  

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

### Interaction

----

#### resolve

    resolve(promise: Promise<T>): Async<T>

Converts a promise into a Async object. It's the inverse function of `promise`.

----

#### promise

    promise(a: Async<T>): Promise<T>

Converts a Async object into a promise. It's the inverse function of `resolve`.

----

#### wrap

    wrap(f: (a: A, ..., y: Y, callback: (err: Error, z: Z)=>void)=>void): (a: Async<A>, ..., y: Async<Y>) => Async<Z>

Converts a Node-style asynchronous function into a Async function. It's the inverse function of `peel`.

----

#### peel

    peel(f: (a: Async<A>, ..., y: Async<Y>)=>Async<Z>): (a: A, ..., y: Y, (err: Error, z: Z) => void) => void ;

Converts a Async function into a Node-style asynchronous function. It's the inverse function of `wrap`.

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

#### worker

    worker(path: Async<string>, arg: Async<T>): Async<S>
    worker(path:       string , arg: Async<T>): Async<S>

Create Web Worker, post a message and recieve a result.

----

### Lifted Functions

----

I'm planning to provide following functions as asynchronous functions in `masync` module:

* string: toString, strcat, toUpperCase, toLowerCase, 
* number: add, sub, mul, div, abs, max, min, parseFloat, parseInteger
* boolean: and, or, not, xor

----

### DOM Events 

----

### waitForMouseDown

    waitForMouseDown(element: HTMLElement): Async<void>

Wait until a element is mouse-clicked.

----

### setTextContent

    setTextContent(element: HTMLElement, text:  Async<string>): Async<void>
    setTextContent(element: HTMLElement, text:        string ): Async<void>

Set textContent property of a element.

----

## How to implement your own Async objects?

**You need not any external libraries to implement your own Async object.** Even if you don't use *masync.js*, you can write a Async object because a masync-style asynchronous object is very simple. Your Async task must have the following type signature:

    interface Async<T> {
        (succ: (t: T)=>void, fail: ()=>void): void;
    } 

It means Async task is just a **function** that have two parameters: `succ` and `fail`. Those parameters are **function** too. When an other Async task needs to get a value from this Async object, this Async object is called. When your task finished it's own action successfully, the task call the `succ` function with the result, or call the `fail` function if the task failed. It's also known as *Continuation-passing style*.

As first example, let't implements a simple Async object. The following function `wait1second` is a Async object. This task waits in a seconds then prints "Hellow, world!", and then returns "result".

    function wait1second(succ, fail){
        setTimeout(function(){ 
            console.log("Hello, world!");
            succ("result");
        }, 1000);
    }


Don't confuse, `wait1second` is Async task but `wait1second(s, f)` is *not*. Async task is a *function*. 

`wait1second` have two parameters, `succ` and `fail`. An asynchronous functions will call those parameter functions when their asynchronous task is over or failed. `wait1second` also calls it when it finish it's own task. This task always success, but when your task fail, it must call `fail` function. You can always begin the task with calling the function with two parameters, `succ` and `fail`. Now you have no interest to the result of the task so you have to pass empty functions as parameters:

    wait1second(function(result){}, function(){});

Execute it. You will got a message "Hello, world!" from your first asynchronous task in your console. It's all about the asynchronous framework of masync. You can combine those your own task with other tasks by masync functions. You can use `masync.run` instead of last example as below:

    masync.run(wait1second);

This code is valid. If you run the script, you will get "Hello, world!" a seconds later in your console.

## Design Concept

* Statically-typed
* Function-oriented
* `this` context independent
* `new` free
* Stateless 
* Standalone but interactive with other library

## Licensing

MIT License!

## Versions

* 0.1.0 (2013/8/16)

Now masync is in very early-stage!

----

Copyright 2013 Kon