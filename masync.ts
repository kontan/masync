//
//
// 
//                               masync 
//
//                           version 0.1.0
// 
//             site: https://github.com/kontan/masync/
//             
//
//
//
//                      The MIT License (MIT)
// 
//             Copyright (c) 2013- Kon (http://phyzkit.net/)
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

module masync {
    export interface Async<T> {
        (succ: (t: T)=>void, fail: ()=>void): void; 
    }

    // Functor //
    export function fmap<S,T>(f: (t: T)=>S, x: Async<T>): Async<S> {
        return ap(pure(f), x);
    }

    // Applicative //
    export function pure<T>(t: T): Async<T> {
        return (succ: (r: T)=>void, fail: ()=>void)=>succ(t);
    }

    export function ap<S,T>(f: Async<(t: T)=>S>, x: Async<T>): Async<S> {
        return function(succ: (result: S)=>void, fail: ()=>void){
            var _f: (t: T)=>S;
            var _x: T;
            function fin(){
                if(typeof _f !== "undefined" && typeof _x !== "undefined"){
                    succ(_f(_x));
                }
            }
            f((g: (t: T)=>S)=>{ _f = g; fin(); }, fail);
            x((r: T        )=>{ _x = r; fin(); }, fail);
        };
    }

    // Monad //
    export function bind<T,S>(x: Async<T>, f: (t: T)=>Async<S>): Async<S> {
        return (succ: (s: S)=>void, fail: ()=>void)=>{ 
            x((t: T)=>f(t)(succ, fail), fail); 
        };
    }

    // lifting
    export function lift<A,                                                  Return>(f: (a: A                                                                                                                                                      )=>Return): (a: Async<A>                                                                                                                                                                                                                                                                                                                                     )=>Async<Return>;
    export function lift<A,B,                                                Return>(f: (a: A, b: B                                                                                                                                                )=>Return): (a: Async<A>, b: Async<B>                                                                                                                                                                                                                                                                                                                        )=>Async<Return>;
    export function lift<A,B,C,                                              Return>(f: (a: A, b: B, c: C                                                                                                                                          )=>Return): (a: Async<A>, b: Async<B>, c: Async<C>                                                                                                                                                                                                                                                                                                           )=>Async<Return>;
    export function lift<A,B,C,D,                                            Return>(f: (a: A, b: B, c: C, d: D                                                                                                                                    )=>Return): (a: Async<A>, b: Async<B>, c: Async<C>, d: Async<D>                                                                                                                                                                                                                                                                                              )=>Async<Return>;    
    export function lift<A,B,C,D,E,                                          Return>(f: (a: A, b: B, c: C, d: D, e: E                                                                                                                              )=>Return): (a: Async<A>, b: Async<B>, c: Async<C>, d: Async<D>, e: Async<E>                                                                                                                                                                                                                                                                                 )=>Async<Return>;
    export function lift<A,B,C,D,E,F,                                        Return>(f: (a: A, b: B, c: C, d: D, e: E, f: F                                                                                                                        )=>Return): (a: Async<A>, b: Async<B>, c: Async<C>, d: Async<D>, e: Async<E>, f: Async<F>                                                                                                                                                                                                                                                                    )=>Async<Return>;
    export function lift<A,B,C,D,E,F,G,                                      Return>(f: (a: A, b: B, c: C, d: D, e: E, f: F, g: G                                                                                                                  )=>Return): (a: Async<A>, b: Async<B>, c: Async<C>, d: Async<D>, e: Async<E>, f: Async<F>, g: Async<G>                                                                                                                                                                                                                                                       )=>Async<Return>;    
    export function lift<A,B,C,D,E,F,G,H,                                    Return>(f: (a: A, b: B, c: C, d: D, e: E, f: F, g: G, h: H                                                                                                            )=>Return): (a: Async<A>, b: Async<B>, c: Async<C>, d: Async<D>, e: Async<E>, f: Async<F>, g: Async<G>, h: Async<H>                                                                                                                                                                                                                                          )=>Async<Return>;
    export function lift<A,B,C,D,E,F,G,H,I,                                  Return>(f: (a: A, b: B, c: C, d: D, e: E, f: F, g: G, h: H, i: I                                                                                                      )=>Return): (a: Async<A>, b: Async<B>, c: Async<C>, d: Async<D>, e: Async<E>, f: Async<F>, g: Async<G>, h: Async<H>, i: Async<I>                                                                                                                                                                                                                             )=>Async<Return>;
    export function lift<A,B,C,D,E,F,G,H,I,J,                                Return>(f: (a: A, b: B, c: C, d: D, e: E, f: F, g: G, h: H, i: I, j: J                                                                                                )=>Return): (a: Async<A>, b: Async<B>, c: Async<C>, d: Async<D>, e: Async<E>, f: Async<F>, g: Async<G>, h: Async<H>, i: Async<I>, j: Async<J>                                                                                                                                                                                                                )=>Async<Return>;
    export function lift<A,B,C,D,E,F,G,H,I,J,K,                              Return>(f: (a: A, b: B, c: C, d: D, e: E, f: F, g: G, h: H, i: I, j: J, k: K                                                                                          )=>Return): (a: Async<A>, b: Async<B>, c: Async<C>, d: Async<D>, e: Async<E>, f: Async<F>, g: Async<G>, h: Async<H>, i: Async<I>, j: Async<J>, k: Async<K>                                                                                                                                                                                                   )=>Async<Return>;    
    export function lift<A,B,C,D,E,F,G,H,I,J,K,L,                            Return>(f: (a: A, b: B, c: C, d: D, e: E, f: F, g: G, h: H, i: I, j: J, k: K, l: L                                                                                    )=>Return): (a: Async<A>, b: Async<B>, c: Async<C>, d: Async<D>, e: Async<E>, f: Async<F>, g: Async<G>, h: Async<H>, i: Async<I>, j: Async<J>, k: Async<K>, l: Async<L>                                                                                                                                                                                      )=>Async<Return>;
    export function lift<A,B,C,D,E,F,G,H,I,J,K,L,M,                          Return>(f: (a: A, b: B, c: C, d: D, e: E, f: F, g: G, h: H, i: I, j: J, k: K, l: L, m: M                                                                              )=>Return): (a: Async<A>, b: Async<B>, c: Async<C>, d: Async<D>, e: Async<E>, f: Async<F>, g: Async<G>, h: Async<H>, i: Async<I>, j: Async<J>, k: Async<K>, l: Async<L>, m: Async<M>                                                                                                                                                                         )=>Async<Return>;
    export function lift<A,B,C,D,E,F,G,H,I,J,K,L,M,N,                        Return>(f: (a: A, b: B, c: C, d: D, e: E, f: F, g: G, h: H, i: I, j: J, k: K, l: L, m: M, n: N                                                                        )=>Return): (a: Async<A>, b: Async<B>, c: Async<C>, d: Async<D>, e: Async<E>, f: Async<F>, g: Async<G>, h: Async<H>, i: Async<I>, j: Async<J>, k: Async<K>, l: Async<L>, m: Async<M>, n: Async<N>                                                                                                                                                            )=>Async<Return>;
    export function lift<A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,                      Return>(f: (a: A, b: B, c: C, d: D, e: E, f: F, g: G, h: H, i: I, j: J, k: K, l: L, m: M, n: N, o: O                                                                  )=>Return): (a: Async<A>, b: Async<B>, c: Async<C>, d: Async<D>, e: Async<E>, f: Async<F>, g: Async<G>, h: Async<H>, i: Async<I>, j: Async<J>, k: Async<K>, l: Async<L>, m: Async<M>, n: Async<N>, o: Async<O>                                                                                                                                               )=>Async<Return>;
    export function lift<A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,                    Return>(f: (a: A, b: B, c: C, d: D, e: E, f: F, g: G, h: H, i: I, j: J, k: K, l: L, m: M, n: N, o: O, p: P                                                            )=>Return): (a: Async<A>, b: Async<B>, c: Async<C>, d: Async<D>, e: Async<E>, f: Async<F>, g: Async<G>, h: Async<H>, i: Async<I>, j: Async<J>, k: Async<K>, l: Async<L>, m: Async<M>, n: Async<N>, o: Async<O>, p: Async<P>                                                                                                                                  )=>Async<Return>;
    export function lift<A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,                  Return>(f: (a: A, b: B, c: C, d: D, e: E, f: F, g: G, h: H, i: I, j: J, k: K, l: L, m: M, n: N, o: O, p: P, q: Q                                                      )=>Return): (a: Async<A>, b: Async<B>, c: Async<C>, d: Async<D>, e: Async<E>, f: Async<F>, g: Async<G>, h: Async<H>, i: Async<I>, j: Async<J>, k: Async<K>, l: Async<L>, m: Async<M>, n: Async<N>, o: Async<O>, p: Async<P>, q: Async<Q>                                                                                                                     )=>Async<Return>;    
    export function lift<A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,                Return>(f: (a: A, b: B, c: C, d: D, e: E, f: F, g: G, h: H, i: I, j: J, k: K, l: L, m: M, n: N, o: O, p: P, q: Q, r: R                                                )=>Return): (a: Async<A>, b: Async<B>, c: Async<C>, d: Async<D>, e: Async<E>, f: Async<F>, g: Async<G>, h: Async<H>, i: Async<I>, j: Async<J>, k: Async<K>, l: Async<L>, m: Async<M>, n: Async<N>, o: Async<O>, p: Async<P>, q: Async<Q>, r: Async<R>                                                                                                        )=>Async<Return>;
    export function lift<A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,              Return>(f: (a: A, b: B, c: C, d: D, e: E, f: F, g: G, h: H, i: I, j: J, k: K, l: L, m: M, n: N, o: O, p: P, q: Q, r: R, s: S                                          )=>Return): (a: Async<A>, b: Async<B>, c: Async<C>, d: Async<D>, e: Async<E>, f: Async<F>, g: Async<G>, h: Async<H>, i: Async<I>, j: Async<J>, k: Async<K>, l: Async<L>, m: Async<M>, n: Async<N>, o: Async<O>, p: Async<P>, q: Async<Q>, r: Async<R>, s: Async<S>                                                                                           )=>Async<Return>;
    export function lift<A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,            Return>(f: (a: A, b: B, c: C, d: D, e: E, f: F, g: G, h: H, i: I, j: J, k: K, l: L, m: M, n: N, o: O, p: P, q: Q, r: R, s: S, t: T                                    )=>Return): (a: Async<A>, b: Async<B>, c: Async<C>, d: Async<D>, e: Async<E>, f: Async<F>, g: Async<G>, h: Async<H>, i: Async<I>, j: Async<J>, k: Async<K>, l: Async<L>, m: Async<M>, n: Async<N>, o: Async<O>, p: Async<P>, q: Async<Q>, r: Async<R>, s: Async<S>, t: Async<T>                                                                              )=>Async<Return>;
    export function lift<A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,          Return>(f: (a: A, b: B, c: C, d: D, e: E, f: F, g: G, h: H, i: I, j: J, k: K, l: L, m: M, n: N, o: O, p: P, q: Q, r: R, s: S, t: T, u: U                              )=>Return): (a: Async<A>, b: Async<B>, c: Async<C>, d: Async<D>, e: Async<E>, f: Async<F>, g: Async<G>, h: Async<H>, i: Async<I>, j: Async<J>, k: Async<K>, l: Async<L>, m: Async<M>, n: Async<N>, o: Async<O>, p: Async<P>, q: Async<Q>, r: Async<R>, s: Async<S>, t: Async<T>, u: Async<U>                                                                 )=>Async<Return>;
    export function lift<A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,        Return>(f: (a: A, b: B, c: C, d: D, e: E, f: F, g: G, h: H, i: I, j: J, k: K, l: L, m: M, n: N, o: O, p: P, q: Q, r: R, s: S, t: T, u: U, v: V                        )=>Return): (a: Async<A>, b: Async<B>, c: Async<C>, d: Async<D>, e: Async<E>, f: Async<F>, g: Async<G>, h: Async<H>, i: Async<I>, j: Async<J>, k: Async<K>, l: Async<L>, m: Async<M>, n: Async<N>, o: Async<O>, p: Async<P>, q: Async<Q>, r: Async<R>, s: Async<S>, t: Async<T>, u: Async<U>, v: Async<V>                                                    )=>Async<Return>;
    export function lift<A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,      Return>(f: (a: A, b: B, c: C, d: D, e: E, f: F, g: G, h: H, i: I, j: J, k: K, l: L, m: M, n: N, o: O, p: P, q: Q, r: R, s: S, t: T, u: U, v: V, w: W                  )=>Return): (a: Async<A>, b: Async<B>, c: Async<C>, d: Async<D>, e: Async<E>, f: Async<F>, g: Async<G>, h: Async<H>, i: Async<I>, j: Async<J>, k: Async<K>, l: Async<L>, m: Async<M>, n: Async<N>, o: Async<O>, p: Async<P>, q: Async<Q>, r: Async<R>, s: Async<S>, t: Async<T>, u: Async<U>, v: Async<V>, w: Async<W>                                       )=>Async<Return>;    
    export function lift<A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,    Return>(f: (a: A, b: B, c: C, d: D, e: E, f: F, g: G, h: H, i: I, j: J, k: K, l: L, m: M, n: N, o: O, p: P, q: Q, r: R, s: S, t: T, u: U, v: V, w: W, x: X            )=>Return): (a: Async<A>, b: Async<B>, c: Async<C>, d: Async<D>, e: Async<E>, f: Async<F>, g: Async<G>, h: Async<H>, i: Async<I>, j: Async<J>, k: Async<K>, l: Async<L>, m: Async<M>, n: Async<N>, o: Async<O>, p: Async<P>, q: Async<Q>, r: Async<R>, s: Async<S>, t: Async<T>, u: Async<U>, v: Async<V>, w: Async<W>, x: Async<X>                          )=>Async<Return>;
    export function lift<A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,  Return>(f: (a: A, b: B, c: C, d: D, e: E, f: F, g: G, h: H, i: I, j: J, k: K, l: L, m: M, n: N, o: O, p: P, q: Q, r: R, s: S, t: T, u: U, v: V, w: W, x: X, y: Y      )=>Return): (a: Async<A>, b: Async<B>, c: Async<C>, d: Async<D>, e: Async<E>, f: Async<F>, g: Async<G>, h: Async<H>, i: Async<I>, j: Async<J>, k: Async<K>, l: Async<L>, m: Async<M>, n: Async<N>, o: Async<O>, p: Async<P>, q: Async<Q>, r: Async<R>, s: Async<S>, t: Async<T>, u: Async<U>, v: Async<V>, w: Async<W>, x: Async<X>, y: Async<Y>             )=>Async<Return>;
    export function lift<A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z,Return>(f: (a: A, b: B, c: C, d: D, e: E, f: F, g: G, h: H, i: I, j: J, k: K, l: L, m: M, n: N, o: O, p: P, q: Q, r: R, s: S, t: T, u: U, v: V, w: W, x: X, y: Y, z: Z)=>Return): (a: Async<A>, b: Async<B>, c: Async<C>, d: Async<D>, e: Async<E>, f: Async<F>, g: Async<G>, h: Async<H>, i: Async<I>, j: Async<J>, k: Async<K>, l: Async<L>, m: Async<M>, n: Async<N>, o: Async<O>, p: Async<P>, q: Async<Q>, r: Async<R>, s: Async<S>, t: Async<T>, u: Async<U>, v: Async<V>, w: Async<W>, x: Async<X>, y: Async<Y>, z: Async<Z>)=>Async<Return>;
    export function lift<R>(f: Function): any {
        return ()=>{
            var args: Async<any>[] = Array.prototype.slice.call(arguments);
            return (succ: (r: R)=>void, fail: ()=>void)=>{
                var _args: any[] = new Array<any>(args.length);
                var count: number = 0;
                args.forEach((arg: Async<any>, i: number)=>{
                    arg((_arg: any)=>{ 
                        _args[i] = _arg;
                        count++;
                        if(count == args.length){
                            succ(f.apply(undefined, _args));
                        }
                    }, fail);
                });
            };
        };
    }

    export function liftAsync<A,                                                  Return>(f: (a: A                                                                                                                                                      )=>Async<Return>): (a: Async<A>                                                                                                                                                                                                                                                                                                                                     )=>Async<Return>;
    export function liftAsync<A,B,                                                Return>(f: (a: A, b: B                                                                                                                                                )=>Async<Return>): (a: Async<A>, b: Async<B>                                                                                                                                                                                                                                                                                                                        )=>Async<Return>;
    export function liftAsync<A,B,C,                                              Return>(f: (a: A, b: B, c: C                                                                                                                                          )=>Async<Return>): (a: Async<A>, b: Async<B>, c: Async<C>                                                                                                                                                                                                                                                                                                           )=>Async<Return>;
    export function liftAsync<A,B,C,D,                                            Return>(f: (a: A, b: B, c: C, d: D                                                                                                                                    )=>Async<Return>): (a: Async<A>, b: Async<B>, c: Async<C>, d: Async<D>                                                                                                                                                                                                                                                                                              )=>Async<Return>;    
    export function liftAsync<A,B,C,D,E,                                          Return>(f: (a: A, b: B, c: C, d: D, e: E                                                                                                                              )=>Async<Return>): (a: Async<A>, b: Async<B>, c: Async<C>, d: Async<D>, e: Async<E>                                                                                                                                                                                                                                                                                 )=>Async<Return>;
    export function liftAsync<A,B,C,D,E,F,                                        Return>(f: (a: A, b: B, c: C, d: D, e: E, f: F                                                                                                                        )=>Async<Return>): (a: Async<A>, b: Async<B>, c: Async<C>, d: Async<D>, e: Async<E>, f: Async<F>                                                                                                                                                                                                                                                                    )=>Async<Return>;
    export function liftAsync<A,B,C,D,E,F,G,                                      Return>(f: (a: A, b: B, c: C, d: D, e: E, f: F, g: G                                                                                                                  )=>Async<Return>): (a: Async<A>, b: Async<B>, c: Async<C>, d: Async<D>, e: Async<E>, f: Async<F>, g: Async<G>                                                                                                                                                                                                                                                       )=>Async<Return>;    
    export function liftAsync<A,B,C,D,E,F,G,H,                                    Return>(f: (a: A, b: B, c: C, d: D, e: E, f: F, g: G, h: H                                                                                                            )=>Async<Return>): (a: Async<A>, b: Async<B>, c: Async<C>, d: Async<D>, e: Async<E>, f: Async<F>, g: Async<G>, h: Async<H>                                                                                                                                                                                                                                          )=>Async<Return>;
    export function liftAsync<A,B,C,D,E,F,G,H,I,                                  Return>(f: (a: A, b: B, c: C, d: D, e: E, f: F, g: G, h: H, i: I                                                                                                      )=>Async<Return>): (a: Async<A>, b: Async<B>, c: Async<C>, d: Async<D>, e: Async<E>, f: Async<F>, g: Async<G>, h: Async<H>, i: Async<I>                                                                                                                                                                                                                             )=>Async<Return>;
    export function liftAsync<A,B,C,D,E,F,G,H,I,J,                                Return>(f: (a: A, b: B, c: C, d: D, e: E, f: F, g: G, h: H, i: I, j: J                                                                                                )=>Async<Return>): (a: Async<A>, b: Async<B>, c: Async<C>, d: Async<D>, e: Async<E>, f: Async<F>, g: Async<G>, h: Async<H>, i: Async<I>, j: Async<J>                                                                                                                                                                                                                )=>Async<Return>;
    export function liftAsync<A,B,C,D,E,F,G,H,I,J,K,                              Return>(f: (a: A, b: B, c: C, d: D, e: E, f: F, g: G, h: H, i: I, j: J, k: K                                                                                          )=>Async<Return>): (a: Async<A>, b: Async<B>, c: Async<C>, d: Async<D>, e: Async<E>, f: Async<F>, g: Async<G>, h: Async<H>, i: Async<I>, j: Async<J>, k: Async<K>                                                                                                                                                                                                   )=>Async<Return>;    
    export function liftAsync<A,B,C,D,E,F,G,H,I,J,K,L,                            Return>(f: (a: A, b: B, c: C, d: D, e: E, f: F, g: G, h: H, i: I, j: J, k: K, l: L                                                                                    )=>Async<Return>): (a: Async<A>, b: Async<B>, c: Async<C>, d: Async<D>, e: Async<E>, f: Async<F>, g: Async<G>, h: Async<H>, i: Async<I>, j: Async<J>, k: Async<K>, l: Async<L>                                                                                                                                                                                      )=>Async<Return>;
    export function liftAsync<A,B,C,D,E,F,G,H,I,J,K,L,M,                          Return>(f: (a: A, b: B, c: C, d: D, e: E, f: F, g: G, h: H, i: I, j: J, k: K, l: L, m: M                                                                              )=>Async<Return>): (a: Async<A>, b: Async<B>, c: Async<C>, d: Async<D>, e: Async<E>, f: Async<F>, g: Async<G>, h: Async<H>, i: Async<I>, j: Async<J>, k: Async<K>, l: Async<L>, m: Async<M>                                                                                                                                                                         )=>Async<Return>;
    export function liftAsync<A,B,C,D,E,F,G,H,I,J,K,L,M,N,                        Return>(f: (a: A, b: B, c: C, d: D, e: E, f: F, g: G, h: H, i: I, j: J, k: K, l: L, m: M, n: N                                                                        )=>Async<Return>): (a: Async<A>, b: Async<B>, c: Async<C>, d: Async<D>, e: Async<E>, f: Async<F>, g: Async<G>, h: Async<H>, i: Async<I>, j: Async<J>, k: Async<K>, l: Async<L>, m: Async<M>, n: Async<N>                                                                                                                                                            )=>Async<Return>;
    export function liftAsync<A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,                      Return>(f: (a: A, b: B, c: C, d: D, e: E, f: F, g: G, h: H, i: I, j: J, k: K, l: L, m: M, n: N, o: O                                                                  )=>Async<Return>): (a: Async<A>, b: Async<B>, c: Async<C>, d: Async<D>, e: Async<E>, f: Async<F>, g: Async<G>, h: Async<H>, i: Async<I>, j: Async<J>, k: Async<K>, l: Async<L>, m: Async<M>, n: Async<N>, o: Async<O>                                                                                                                                               )=>Async<Return>;
    export function liftAsync<A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,                    Return>(f: (a: A, b: B, c: C, d: D, e: E, f: F, g: G, h: H, i: I, j: J, k: K, l: L, m: M, n: N, o: O, p: P                                                            )=>Async<Return>): (a: Async<A>, b: Async<B>, c: Async<C>, d: Async<D>, e: Async<E>, f: Async<F>, g: Async<G>, h: Async<H>, i: Async<I>, j: Async<J>, k: Async<K>, l: Async<L>, m: Async<M>, n: Async<N>, o: Async<O>, p: Async<P>                                                                                                                                  )=>Async<Return>;
    export function liftAsync<A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,                  Return>(f: (a: A, b: B, c: C, d: D, e: E, f: F, g: G, h: H, i: I, j: J, k: K, l: L, m: M, n: N, o: O, p: P, q: Q                                                      )=>Async<Return>): (a: Async<A>, b: Async<B>, c: Async<C>, d: Async<D>, e: Async<E>, f: Async<F>, g: Async<G>, h: Async<H>, i: Async<I>, j: Async<J>, k: Async<K>, l: Async<L>, m: Async<M>, n: Async<N>, o: Async<O>, p: Async<P>, q: Async<Q>                                                                                                                     )=>Async<Return>;    
    export function liftAsync<A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,                Return>(f: (a: A, b: B, c: C, d: D, e: E, f: F, g: G, h: H, i: I, j: J, k: K, l: L, m: M, n: N, o: O, p: P, q: Q, r: R                                                )=>Async<Return>): (a: Async<A>, b: Async<B>, c: Async<C>, d: Async<D>, e: Async<E>, f: Async<F>, g: Async<G>, h: Async<H>, i: Async<I>, j: Async<J>, k: Async<K>, l: Async<L>, m: Async<M>, n: Async<N>, o: Async<O>, p: Async<P>, q: Async<Q>, r: Async<R>                                                                                                        )=>Async<Return>;
    export function liftAsync<A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,              Return>(f: (a: A, b: B, c: C, d: D, e: E, f: F, g: G, h: H, i: I, j: J, k: K, l: L, m: M, n: N, o: O, p: P, q: Q, r: R, s: S                                          )=>Async<Return>): (a: Async<A>, b: Async<B>, c: Async<C>, d: Async<D>, e: Async<E>, f: Async<F>, g: Async<G>, h: Async<H>, i: Async<I>, j: Async<J>, k: Async<K>, l: Async<L>, m: Async<M>, n: Async<N>, o: Async<O>, p: Async<P>, q: Async<Q>, r: Async<R>, s: Async<S>                                                                                           )=>Async<Return>;
    export function liftAsync<A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,            Return>(f: (a: A, b: B, c: C, d: D, e: E, f: F, g: G, h: H, i: I, j: J, k: K, l: L, m: M, n: N, o: O, p: P, q: Q, r: R, s: S, t: T                                    )=>Async<Return>): (a: Async<A>, b: Async<B>, c: Async<C>, d: Async<D>, e: Async<E>, f: Async<F>, g: Async<G>, h: Async<H>, i: Async<I>, j: Async<J>, k: Async<K>, l: Async<L>, m: Async<M>, n: Async<N>, o: Async<O>, p: Async<P>, q: Async<Q>, r: Async<R>, s: Async<S>, t: Async<T>                                                                              )=>Async<Return>;
    export function liftAsync<A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,          Return>(f: (a: A, b: B, c: C, d: D, e: E, f: F, g: G, h: H, i: I, j: J, k: K, l: L, m: M, n: N, o: O, p: P, q: Q, r: R, s: S, t: T, u: U                              )=>Async<Return>): (a: Async<A>, b: Async<B>, c: Async<C>, d: Async<D>, e: Async<E>, f: Async<F>, g: Async<G>, h: Async<H>, i: Async<I>, j: Async<J>, k: Async<K>, l: Async<L>, m: Async<M>, n: Async<N>, o: Async<O>, p: Async<P>, q: Async<Q>, r: Async<R>, s: Async<S>, t: Async<T>, u: Async<U>                                                                 )=>Async<Return>;
    export function liftAsync<A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,        Return>(f: (a: A, b: B, c: C, d: D, e: E, f: F, g: G, h: H, i: I, j: J, k: K, l: L, m: M, n: N, o: O, p: P, q: Q, r: R, s: S, t: T, u: U, v: V                        )=>Async<Return>): (a: Async<A>, b: Async<B>, c: Async<C>, d: Async<D>, e: Async<E>, f: Async<F>, g: Async<G>, h: Async<H>, i: Async<I>, j: Async<J>, k: Async<K>, l: Async<L>, m: Async<M>, n: Async<N>, o: Async<O>, p: Async<P>, q: Async<Q>, r: Async<R>, s: Async<S>, t: Async<T>, u: Async<U>, v: Async<V>                                                    )=>Async<Return>;
    export function liftAsync<A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,      Return>(f: (a: A, b: B, c: C, d: D, e: E, f: F, g: G, h: H, i: I, j: J, k: K, l: L, m: M, n: N, o: O, p: P, q: Q, r: R, s: S, t: T, u: U, v: V, w: W                  )=>Async<Return>): (a: Async<A>, b: Async<B>, c: Async<C>, d: Async<D>, e: Async<E>, f: Async<F>, g: Async<G>, h: Async<H>, i: Async<I>, j: Async<J>, k: Async<K>, l: Async<L>, m: Async<M>, n: Async<N>, o: Async<O>, p: Async<P>, q: Async<Q>, r: Async<R>, s: Async<S>, t: Async<T>, u: Async<U>, v: Async<V>, w: Async<W>                                       )=>Async<Return>;    
    export function liftAsync<A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,    Return>(f: (a: A, b: B, c: C, d: D, e: E, f: F, g: G, h: H, i: I, j: J, k: K, l: L, m: M, n: N, o: O, p: P, q: Q, r: R, s: S, t: T, u: U, v: V, w: W, x: X            )=>Async<Return>): (a: Async<A>, b: Async<B>, c: Async<C>, d: Async<D>, e: Async<E>, f: Async<F>, g: Async<G>, h: Async<H>, i: Async<I>, j: Async<J>, k: Async<K>, l: Async<L>, m: Async<M>, n: Async<N>, o: Async<O>, p: Async<P>, q: Async<Q>, r: Async<R>, s: Async<S>, t: Async<T>, u: Async<U>, v: Async<V>, w: Async<W>, x: Async<X>                          )=>Async<Return>;
    export function liftAsync<A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,  Return>(f: (a: A, b: B, c: C, d: D, e: E, f: F, g: G, h: H, i: I, j: J, k: K, l: L, m: M, n: N, o: O, p: P, q: Q, r: R, s: S, t: T, u: U, v: V, w: W, x: X, y: Y      )=>Async<Return>): (a: Async<A>, b: Async<B>, c: Async<C>, d: Async<D>, e: Async<E>, f: Async<F>, g: Async<G>, h: Async<H>, i: Async<I>, j: Async<J>, k: Async<K>, l: Async<L>, m: Async<M>, n: Async<N>, o: Async<O>, p: Async<P>, q: Async<Q>, r: Async<R>, s: Async<S>, t: Async<T>, u: Async<U>, v: Async<V>, w: Async<W>, x: Async<X>, y: Async<Y>             )=>Async<Return>;
    export function liftAsync<A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z,Return>(f: (a: A, b: B, c: C, d: D, e: E, f: F, g: G, h: H, i: I, j: J, k: K, l: L, m: M, n: N, o: O, p: P, q: Q, r: R, s: S, t: T, u: U, v: V, w: W, x: X, y: Y, z: Z)=>Async<Return>): (a: Async<A>, b: Async<B>, c: Async<C>, d: Async<D>, e: Async<E>, f: Async<F>, g: Async<G>, h: Async<H>, i: Async<I>, j: Async<J>, k: Async<K>, l: Async<L>, m: Async<M>, n: Async<N>, o: Async<O>, p: Async<P>, q: Async<Q>, r: Async<R>, s: Async<S>, t: Async<T>, u: Async<U>, v: Async<V>, w: Async<W>, x: Async<X>, y: Async<Y>, z: Async<Z>)=>Async<Return>;
    export function liftAsync<R>(f: Function): any {
        return function(){
            var args: Async<any>[] = Array.prototype.slice.call(arguments);
            return function(succ: (r: R)=>void, fail: ()=>void){
                var _args: any[] = new Array<any>(args.length);
                var count: number = 0;
                args.forEach((_arg: Async<any>, i: number)=>{
                    _arg(function(_arg: any){ 
                        _args[i] = _arg; 
                        count++;
                        if(count == args.length){
                            f.apply(undefined, _args)(succ, fail);
                        }
                    }, fail);
                });
            };
        };
    }

    // sequential evalution
    export function series<                                                    Return>(                                                                                                                                                                                                                                                                                                                                                  last: Async<Return>): Async<Return>;
    export function series<A                                                  ,Return>(a: Async<A>                                                                                                                                                                                                                                                                                                                                     , last: Async<Return>): Async<Return>;
    export function series<A,B                                                ,Return>(a: Async<A>, b: Async<B>                                                                                                                                                                                                                                                                                                                        , last: Async<Return>): Async<Return>;
    export function series<A,B,C                                              ,Return>(a: Async<A>, b: Async<B>, c: Async<C>                                                                                                                                                                                                                                                                                                           , last: Async<Return>): Async<Return>;
    export function series<A,B,C,D                                            ,Return>(a: Async<A>, b: Async<B>, c: Async<C>, d: Async<D>                                                                                                                                                                                                                                                                                              , last: Async<Return>): Async<Return>;
    export function series<A,B,C,D,E                                          ,Return>(a: Async<A>, b: Async<B>, c: Async<C>, d: Async<D>, e: Async<E>                                                                                                                                                                                                                                                                                 , last: Async<Return>): Async<Return>;
    export function series<A,B,C,D,E,F                                        ,Return>(a: Async<A>, b: Async<B>, c: Async<C>, d: Async<D>, e: Async<E>, f: Async<F>                                                                                                                                                                                                                                                                    , last: Async<Return>): Async<Return>;
    export function series<A,B,C,D,E,F,G                                      ,Return>(a: Async<A>, b: Async<B>, c: Async<C>, d: Async<D>, e: Async<E>, f: Async<F>, g: Async<G>                                                                                                                                                                                                                                                       , last: Async<Return>): Async<Return>;
    export function series<A,B,C,D,E,F,G,H                                    ,Return>(a: Async<A>, b: Async<B>, c: Async<C>, d: Async<D>, e: Async<E>, f: Async<F>, g: Async<G>, h: Async<H>                                                                                                                                                                                                                                          , last: Async<Return>): Async<Return>;
    export function series<A,B,C,D,E,F,G,H,I                                  ,Return>(a: Async<A>, b: Async<B>, c: Async<C>, d: Async<D>, e: Async<E>, f: Async<F>, g: Async<G>, h: Async<H>, i: Async<I>                                                                                                                                                                                                                             , last: Async<Return>): Async<Return>;
    export function series<A,B,C,D,E,F,G,H,I,J                                ,Return>(a: Async<A>, b: Async<B>, c: Async<C>, d: Async<D>, e: Async<E>, f: Async<F>, g: Async<G>, h: Async<H>, i: Async<I>, j: Async<J>                                                                                                                                                                                                                , last: Async<Return>): Async<Return>;
    export function series<A,B,C,D,E,F,G,H,I,J,K                              ,Return>(a: Async<A>, b: Async<B>, c: Async<C>, d: Async<D>, e: Async<E>, f: Async<F>, g: Async<G>, h: Async<H>, i: Async<I>, j: Async<J>, k: Async<K>                                                                                                                                                                                                   , last: Async<Return>): Async<Return>;
    export function series<A,B,C,D,E,F,G,H,I,J,K,L                            ,Return>(a: Async<A>, b: Async<B>, c: Async<C>, d: Async<D>, e: Async<E>, f: Async<F>, g: Async<G>, h: Async<H>, i: Async<I>, j: Async<J>, k: Async<K>, l: Async<L>                                                                                                                                                                                      , last: Async<Return>): Async<Return>;
    export function series<A,B,C,D,E,F,G,H,I,J,K,L,M                          ,Return>(a: Async<A>, b: Async<B>, c: Async<C>, d: Async<D>, e: Async<E>, f: Async<F>, g: Async<G>, h: Async<H>, i: Async<I>, j: Async<J>, k: Async<K>, l: Async<L>, m: Async<M>                                                                                                                                                                         , last: Async<Return>): Async<Return>;
    export function series<A,B,C,D,E,F,G,H,I,J,K,L,M,N                        ,Return>(a: Async<A>, b: Async<B>, c: Async<C>, d: Async<D>, e: Async<E>, f: Async<F>, g: Async<G>, h: Async<H>, i: Async<I>, j: Async<J>, k: Async<K>, l: Async<L>, m: Async<M>, n: Async<N>                                                                                                                                                            , last: Async<Return>): Async<Return>;
    export function series<A,B,C,D,E,F,G,H,I,J,K,L,M,N,O                      ,Return>(a: Async<A>, b: Async<B>, c: Async<C>, d: Async<D>, e: Async<E>, f: Async<F>, g: Async<G>, h: Async<H>, i: Async<I>, j: Async<J>, k: Async<K>, l: Async<L>, m: Async<M>, n: Async<N>, o: Async<O>                                                                                                                                               , last: Async<Return>): Async<Return>;
    export function series<A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P                    ,Return>(a: Async<A>, b: Async<B>, c: Async<C>, d: Async<D>, e: Async<E>, f: Async<F>, g: Async<G>, h: Async<H>, i: Async<I>, j: Async<J>, k: Async<K>, l: Async<L>, m: Async<M>, n: Async<N>, o: Async<O>, p: Async<P>                                                                                                                                  , last: Async<Return>): Async<Return>;
    export function series<A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q                  ,Return>(a: Async<A>, b: Async<B>, c: Async<C>, d: Async<D>, e: Async<E>, f: Async<F>, g: Async<G>, h: Async<H>, i: Async<I>, j: Async<J>, k: Async<K>, l: Async<L>, m: Async<M>, n: Async<N>, o: Async<O>, p: Async<P>, q: Async<Q>                                                                                                                     , last: Async<Return>): Async<Return>;    
    export function series<A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R                ,Return>(a: Async<A>, b: Async<B>, c: Async<C>, d: Async<D>, e: Async<E>, f: Async<F>, g: Async<G>, h: Async<H>, i: Async<I>, j: Async<J>, k: Async<K>, l: Async<L>, m: Async<M>, n: Async<N>, o: Async<O>, p: Async<P>, q: Async<Q>, r: Async<R>                                                                                                        , last: Async<Return>): Async<Return>;
    export function series<A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S              ,Return>(a: Async<A>, b: Async<B>, c: Async<C>, d: Async<D>, e: Async<E>, f: Async<F>, g: Async<G>, h: Async<H>, i: Async<I>, j: Async<J>, k: Async<K>, l: Async<L>, m: Async<M>, n: Async<N>, o: Async<O>, p: Async<P>, q: Async<Q>, r: Async<R>, s: Async<S>                                                                                           , last: Async<Return>): Async<Return>;
    export function series<A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T            ,Return>(a: Async<A>, b: Async<B>, c: Async<C>, d: Async<D>, e: Async<E>, f: Async<F>, g: Async<G>, h: Async<H>, i: Async<I>, j: Async<J>, k: Async<K>, l: Async<L>, m: Async<M>, n: Async<N>, o: Async<O>, p: Async<P>, q: Async<Q>, r: Async<R>, s: Async<S>, t: Async<T>                                                                              , last: Async<Return>): Async<Return>;
    export function series<A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U          ,Return>(a: Async<A>, b: Async<B>, c: Async<C>, d: Async<D>, e: Async<E>, f: Async<F>, g: Async<G>, h: Async<H>, i: Async<I>, j: Async<J>, k: Async<K>, l: Async<L>, m: Async<M>, n: Async<N>, o: Async<O>, p: Async<P>, q: Async<Q>, r: Async<R>, s: Async<S>, t: Async<T>, u: Async<U>                                                                 , last: Async<Return>): Async<Return>;
    export function series<A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V        ,Return>(a: Async<A>, b: Async<B>, c: Async<C>, d: Async<D>, e: Async<E>, f: Async<F>, g: Async<G>, h: Async<H>, i: Async<I>, j: Async<J>, k: Async<K>, l: Async<L>, m: Async<M>, n: Async<N>, o: Async<O>, p: Async<P>, q: Async<Q>, r: Async<R>, s: Async<S>, t: Async<T>, u: Async<U>, v: Async<V>                                                    , last: Async<Return>): Async<Return>;
    export function series<A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W      ,Return>(a: Async<A>, b: Async<B>, c: Async<C>, d: Async<D>, e: Async<E>, f: Async<F>, g: Async<G>, h: Async<H>, i: Async<I>, j: Async<J>, k: Async<K>, l: Async<L>, m: Async<M>, n: Async<N>, o: Async<O>, p: Async<P>, q: Async<Q>, r: Async<R>, s: Async<S>, t: Async<T>, u: Async<U>, v: Async<V>, w: Async<W>                                       , last: Async<Return>): Async<Return>;    
    export function series<A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X    ,Return>(a: Async<A>, b: Async<B>, c: Async<C>, d: Async<D>, e: Async<E>, f: Async<F>, g: Async<G>, h: Async<H>, i: Async<I>, j: Async<J>, k: Async<K>, l: Async<L>, m: Async<M>, n: Async<N>, o: Async<O>, p: Async<P>, q: Async<Q>, r: Async<R>, s: Async<S>, t: Async<T>, u: Async<U>, v: Async<V>, w: Async<W>, x: Async<X>                          , last: Async<Return>): Async<Return>;
    export function series<A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y  ,Return>(a: Async<A>, b: Async<B>, c: Async<C>, d: Async<D>, e: Async<E>, f: Async<F>, g: Async<G>, h: Async<H>, i: Async<I>, j: Async<J>, k: Async<K>, l: Async<L>, m: Async<M>, n: Async<N>, o: Async<O>, p: Async<P>, q: Async<Q>, r: Async<R>, s: Async<S>, t: Async<T>, u: Async<U>, v: Async<V>, w: Async<W>, x: Async<X>, y: Async<Y>             , last: Async<Return>): Async<Return>;
    export function series<A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z,Return>(a: Async<A>, b: Async<B>, c: Async<C>, d: Async<D>, e: Async<E>, f: Async<F>, g: Async<G>, h: Async<H>, i: Async<I>, j: Async<J>, k: Async<K>, l: Async<L>, m: Async<M>, n: Async<N>, o: Async<O>, p: Async<P>, q: Async<Q>, r: Async<R>, s: Async<S>, t: Async<T>, u: Async<U>, v: Async<V>, w: Async<W>, x: Async<X>, y: Async<Y>, z: Async<Z>, last: Async<Return>): Async<Return>;
    export function series(...xs: Async<any>[]): Async<any> {
        xs = xs.slice(0);
        return function(succ: (r: any)=>void, fail: ()=>void){
            var _xs: Async<any>[] = xs.slice(0);
            var r: any = null;
            function run(){_xs.length == 0 ? succ(r) : _xs[0](function(_r){ r = _r; _xs.shift(); run(); }, fail); }
            run();        
        };
    }

    // parallel evalution
    export function parallel<A                                                  >(a: Async<A>                                                                                                                                                                                                                                                                                                                                     ): Async<void>;
    export function parallel<A,B                                                >(a: Async<A>, b: Async<B>                                                                                                                                                                                                                                                                                                                        ): Async<void>;
    export function parallel<A,B,C                                              >(a: Async<A>, b: Async<B>, c: Async<C>                                                                                                                                                                                                                                                                                                           ): Async<void>;
    export function parallel<A,B,C,D                                            >(a: Async<A>, b: Async<B>, c: Async<C>, d: Async<D>                                                                                                                                                                                                                                                                                              ): Async<void>;
    export function parallel<A,B,C,D,E                                          >(a: Async<A>, b: Async<B>, c: Async<C>, d: Async<D>, e: Async<E>                                                                                                                                                                                                                                                                                 ): Async<void>;
    export function parallel<A,B,C,D,E,F                                        >(a: Async<A>, b: Async<B>, c: Async<C>, d: Async<D>, e: Async<E>, f: Async<F>                                                                                                                                                                                                                                                                    ): Async<void>;
    export function parallel<A,B,C,D,E,F,G                                      >(a: Async<A>, b: Async<B>, c: Async<C>, d: Async<D>, e: Async<E>, f: Async<F>, g: Async<G>                                                                                                                                                                                                                                                       ): Async<void>;
    export function parallel<A,B,C,D,E,F,G,H                                    >(a: Async<A>, b: Async<B>, c: Async<C>, d: Async<D>, e: Async<E>, f: Async<F>, g: Async<G>, h: Async<H>                                                                                                                                                                                                                                          ): Async<void>;
    export function parallel<A,B,C,D,E,F,G,H,I                                  >(a: Async<A>, b: Async<B>, c: Async<C>, d: Async<D>, e: Async<E>, f: Async<F>, g: Async<G>, h: Async<H>, i: Async<I>                                                                                                                                                                                                                             ): Async<void>;
    export function parallel<A,B,C,D,E,F,G,H,I,J                                >(a: Async<A>, b: Async<B>, c: Async<C>, d: Async<D>, e: Async<E>, f: Async<F>, g: Async<G>, h: Async<H>, i: Async<I>, j: Async<J>                                                                                                                                                                                                                ): Async<void>;
    export function parallel<A,B,C,D,E,F,G,H,I,J,K                              >(a: Async<A>, b: Async<B>, c: Async<C>, d: Async<D>, e: Async<E>, f: Async<F>, g: Async<G>, h: Async<H>, i: Async<I>, j: Async<J>, k: Async<K>                                                                                                                                                                                                   ): Async<void>;
    export function parallel<A,B,C,D,E,F,G,H,I,J,K,L                            >(a: Async<A>, b: Async<B>, c: Async<C>, d: Async<D>, e: Async<E>, f: Async<F>, g: Async<G>, h: Async<H>, i: Async<I>, j: Async<J>, k: Async<K>, l: Async<L>                                                                                                                                                                                      ): Async<void>;
    export function parallel<A,B,C,D,E,F,G,H,I,J,K,L,M                          >(a: Async<A>, b: Async<B>, c: Async<C>, d: Async<D>, e: Async<E>, f: Async<F>, g: Async<G>, h: Async<H>, i: Async<I>, j: Async<J>, k: Async<K>, l: Async<L>, m: Async<M>                                                                                                                                                                         ): Async<void>;
    export function parallel<A,B,C,D,E,F,G,H,I,J,K,L,M,N                        >(a: Async<A>, b: Async<B>, c: Async<C>, d: Async<D>, e: Async<E>, f: Async<F>, g: Async<G>, h: Async<H>, i: Async<I>, j: Async<J>, k: Async<K>, l: Async<L>, m: Async<M>, n: Async<N>                                                                                                                                                            ): Async<void>;
    export function parallel<A,B,C,D,E,F,G,H,I,J,K,L,M,N,O                      >(a: Async<A>, b: Async<B>, c: Async<C>, d: Async<D>, e: Async<E>, f: Async<F>, g: Async<G>, h: Async<H>, i: Async<I>, j: Async<J>, k: Async<K>, l: Async<L>, m: Async<M>, n: Async<N>, o: Async<O>                                                                                                                                               ): Async<void>;
    export function parallel<A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P                    >(a: Async<A>, b: Async<B>, c: Async<C>, d: Async<D>, e: Async<E>, f: Async<F>, g: Async<G>, h: Async<H>, i: Async<I>, j: Async<J>, k: Async<K>, l: Async<L>, m: Async<M>, n: Async<N>, o: Async<O>, p: Async<P>                                                                                                                                  ): Async<void>;
    export function parallel<A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q                  >(a: Async<A>, b: Async<B>, c: Async<C>, d: Async<D>, e: Async<E>, f: Async<F>, g: Async<G>, h: Async<H>, i: Async<I>, j: Async<J>, k: Async<K>, l: Async<L>, m: Async<M>, n: Async<N>, o: Async<O>, p: Async<P>, q: Async<Q>                                                                                                                     ): Async<void>;    
    export function parallel<A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R                >(a: Async<A>, b: Async<B>, c: Async<C>, d: Async<D>, e: Async<E>, f: Async<F>, g: Async<G>, h: Async<H>, i: Async<I>, j: Async<J>, k: Async<K>, l: Async<L>, m: Async<M>, n: Async<N>, o: Async<O>, p: Async<P>, q: Async<Q>, r: Async<R>                                                                                                        ): Async<void>;
    export function parallel<A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S              >(a: Async<A>, b: Async<B>, c: Async<C>, d: Async<D>, e: Async<E>, f: Async<F>, g: Async<G>, h: Async<H>, i: Async<I>, j: Async<J>, k: Async<K>, l: Async<L>, m: Async<M>, n: Async<N>, o: Async<O>, p: Async<P>, q: Async<Q>, r: Async<R>, s: Async<S>                                                                                           ): Async<void>;
    export function parallel<A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T            >(a: Async<A>, b: Async<B>, c: Async<C>, d: Async<D>, e: Async<E>, f: Async<F>, g: Async<G>, h: Async<H>, i: Async<I>, j: Async<J>, k: Async<K>, l: Async<L>, m: Async<M>, n: Async<N>, o: Async<O>, p: Async<P>, q: Async<Q>, r: Async<R>, s: Async<S>, t: Async<T>                                                                              ): Async<void>;
    export function parallel<A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U          >(a: Async<A>, b: Async<B>, c: Async<C>, d: Async<D>, e: Async<E>, f: Async<F>, g: Async<G>, h: Async<H>, i: Async<I>, j: Async<J>, k: Async<K>, l: Async<L>, m: Async<M>, n: Async<N>, o: Async<O>, p: Async<P>, q: Async<Q>, r: Async<R>, s: Async<S>, t: Async<T>, u: Async<U>                                                                 ): Async<void>;
    export function parallel<A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V        >(a: Async<A>, b: Async<B>, c: Async<C>, d: Async<D>, e: Async<E>, f: Async<F>, g: Async<G>, h: Async<H>, i: Async<I>, j: Async<J>, k: Async<K>, l: Async<L>, m: Async<M>, n: Async<N>, o: Async<O>, p: Async<P>, q: Async<Q>, r: Async<R>, s: Async<S>, t: Async<T>, u: Async<U>, v: Async<V>                                                    ): Async<void>;
    export function parallel<A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W      >(a: Async<A>, b: Async<B>, c: Async<C>, d: Async<D>, e: Async<E>, f: Async<F>, g: Async<G>, h: Async<H>, i: Async<I>, j: Async<J>, k: Async<K>, l: Async<L>, m: Async<M>, n: Async<N>, o: Async<O>, p: Async<P>, q: Async<Q>, r: Async<R>, s: Async<S>, t: Async<T>, u: Async<U>, v: Async<V>, w: Async<W>                                       ): Async<void>;    
    export function parallel<A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X    >(a: Async<A>, b: Async<B>, c: Async<C>, d: Async<D>, e: Async<E>, f: Async<F>, g: Async<G>, h: Async<H>, i: Async<I>, j: Async<J>, k: Async<K>, l: Async<L>, m: Async<M>, n: Async<N>, o: Async<O>, p: Async<P>, q: Async<Q>, r: Async<R>, s: Async<S>, t: Async<T>, u: Async<U>, v: Async<V>, w: Async<W>, x: Async<X>                          ): Async<void>;
    export function parallel<A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y  >(a: Async<A>, b: Async<B>, c: Async<C>, d: Async<D>, e: Async<E>, f: Async<F>, g: Async<G>, h: Async<H>, i: Async<I>, j: Async<J>, k: Async<K>, l: Async<L>, m: Async<M>, n: Async<N>, o: Async<O>, p: Async<P>, q: Async<Q>, r: Async<R>, s: Async<S>, t: Async<T>, u: Async<U>, v: Async<V>, w: Async<W>, x: Async<X>, y: Async<Y>             ): Async<void>;
    export function parallel<A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z>(a: Async<A>, b: Async<B>, c: Async<C>, d: Async<D>, e: Async<E>, f: Async<F>, g: Async<G>, h: Async<H>, i: Async<I>, j: Async<J>, k: Async<K>, l: Async<L>, m: Async<M>, n: Async<N>, o: Async<O>, p: Async<P>, q: Async<Q>, r: Async<R>, s: Async<S>, t: Async<T>, u: Async<U>, v: Async<V>, w: Async<W>, x: Async<X>, y: Async<Y>, z: Async<Z>): Async<void>;
    export function parallel(...xs: Async<any>[]): Async<void> {
        return function(succ: ()=>void, fail: ()=>void){
            var count: number = 0;
            xs.forEach((x: Async<any>, i: number)=>{
                x((result: any)=>{
                    if(++count == xs.length) succ();
                }, fail);
            });
        };
    }

    // run actions
    export function run<A                                                  >(a: Async<A>                                                                                                                                                                                                                                                                                                                                     ): void;
    export function run<A,B                                                >(a: Async<A>, b: Async<B>                                                                                                                                                                                                                                                                                                                        ): void;
    export function run<A,B,C                                              >(a: Async<A>, b: Async<B>, c: Async<C>                                                                                                                                                                                                                                                                                                           ): void;
    export function run<A,B,C,D                                            >(a: Async<A>, b: Async<B>, c: Async<C>, d: Async<D>                                                                                                                                                                                                                                                                                              ): void;
    export function run<A,B,C,D,E                                          >(a: Async<A>, b: Async<B>, c: Async<C>, d: Async<D>, e: Async<E>                                                                                                                                                                                                                                                                                 ): void;
    export function run<A,B,C,D,E,F                                        >(a: Async<A>, b: Async<B>, c: Async<C>, d: Async<D>, e: Async<E>, f: Async<F>                                                                                                                                                                                                                                                                    ): void;
    export function run<A,B,C,D,E,F,G                                      >(a: Async<A>, b: Async<B>, c: Async<C>, d: Async<D>, e: Async<E>, f: Async<F>, g: Async<G>                                                                                                                                                                                                                                                       ): void;
    export function run<A,B,C,D,E,F,G,H                                    >(a: Async<A>, b: Async<B>, c: Async<C>, d: Async<D>, e: Async<E>, f: Async<F>, g: Async<G>, h: Async<H>                                                                                                                                                                                                                                          ): void;
    export function run<A,B,C,D,E,F,G,H,I                                  >(a: Async<A>, b: Async<B>, c: Async<C>, d: Async<D>, e: Async<E>, f: Async<F>, g: Async<G>, h: Async<H>, i: Async<I>                                                                                                                                                                                                                             ): void;    
    export function run<A,B,C,D,E,F,G,H,I,J                                >(a: Async<A>, b: Async<B>, c: Async<C>, d: Async<D>, e: Async<E>, f: Async<F>, g: Async<G>, h: Async<H>, i: Async<I>, j: Async<J>                                                                                                                                                                                                                ): void;
    export function run<A,B,C,D,E,F,G,H,I,J,K                              >(a: Async<A>, b: Async<B>, c: Async<C>, d: Async<D>, e: Async<E>, f: Async<F>, g: Async<G>, h: Async<H>, i: Async<I>, j: Async<J>, k: Async<K>                                                                                                                                                                                                   ): void;
    export function run<A,B,C,D,E,F,G,H,I,J,K,L                            >(a: Async<A>, b: Async<B>, c: Async<C>, d: Async<D>, e: Async<E>, f: Async<F>, g: Async<G>, h: Async<H>, i: Async<I>, j: Async<J>, k: Async<K>, l: Async<L>                                                                                                                                                                                      ): void;
    export function run<A,B,C,D,E,F,G,H,I,J,K,L,M                          >(a: Async<A>, b: Async<B>, c: Async<C>, d: Async<D>, e: Async<E>, f: Async<F>, g: Async<G>, h: Async<H>, i: Async<I>, j: Async<J>, k: Async<K>, l: Async<L>, m: Async<M>                                                                                                                                                                         ): void;
    export function run<A,B,C,D,E,F,G,H,I,J,K,L,M,N                        >(a: Async<A>, b: Async<B>, c: Async<C>, d: Async<D>, e: Async<E>, f: Async<F>, g: Async<G>, h: Async<H>, i: Async<I>, j: Async<J>, k: Async<K>, l: Async<L>, m: Async<M>, n: Async<N>                                                                                                                                                            ): void;
    export function run<A,B,C,D,E,F,G,H,I,J,K,L,M,N,O                      >(a: Async<A>, b: Async<B>, c: Async<C>, d: Async<D>, e: Async<E>, f: Async<F>, g: Async<G>, h: Async<H>, i: Async<I>, j: Async<J>, k: Async<K>, l: Async<L>, m: Async<M>, n: Async<N>, o: Async<O>                                                                                                                                               ): void;
    export function run<A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P                    >(a: Async<A>, b: Async<B>, c: Async<C>, d: Async<D>, e: Async<E>, f: Async<F>, g: Async<G>, h: Async<H>, i: Async<I>, j: Async<J>, k: Async<K>, l: Async<L>, m: Async<M>, n: Async<N>, o: Async<O>, p: Async<P>                                                                                                                                  ): void;
    export function run<A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q                  >(a: Async<A>, b: Async<B>, c: Async<C>, d: Async<D>, e: Async<E>, f: Async<F>, g: Async<G>, h: Async<H>, i: Async<I>, j: Async<J>, k: Async<K>, l: Async<L>, m: Async<M>, n: Async<N>, o: Async<O>, p: Async<P>, q: Async<Q>                                                                                                                     ): void;    
    export function run<A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R                >(a: Async<A>, b: Async<B>, c: Async<C>, d: Async<D>, e: Async<E>, f: Async<F>, g: Async<G>, h: Async<H>, i: Async<I>, j: Async<J>, k: Async<K>, l: Async<L>, m: Async<M>, n: Async<N>, o: Async<O>, p: Async<P>, q: Async<Q>, r: Async<R>                                                                                                        ): void;
    export function run<A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S              >(a: Async<A>, b: Async<B>, c: Async<C>, d: Async<D>, e: Async<E>, f: Async<F>, g: Async<G>, h: Async<H>, i: Async<I>, j: Async<J>, k: Async<K>, l: Async<L>, m: Async<M>, n: Async<N>, o: Async<O>, p: Async<P>, q: Async<Q>, r: Async<R>, s: Async<S>                                                                                           ): void;
    export function run<A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T            >(a: Async<A>, b: Async<B>, c: Async<C>, d: Async<D>, e: Async<E>, f: Async<F>, g: Async<G>, h: Async<H>, i: Async<I>, j: Async<J>, k: Async<K>, l: Async<L>, m: Async<M>, n: Async<N>, o: Async<O>, p: Async<P>, q: Async<Q>, r: Async<R>, s: Async<S>, t: Async<T>                                                                              ): void;
    export function run<A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U          >(a: Async<A>, b: Async<B>, c: Async<C>, d: Async<D>, e: Async<E>, f: Async<F>, g: Async<G>, h: Async<H>, i: Async<I>, j: Async<J>, k: Async<K>, l: Async<L>, m: Async<M>, n: Async<N>, o: Async<O>, p: Async<P>, q: Async<Q>, r: Async<R>, s: Async<S>, t: Async<T>, u: Async<U>                                                                 ): void;
    export function run<A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V        >(a: Async<A>, b: Async<B>, c: Async<C>, d: Async<D>, e: Async<E>, f: Async<F>, g: Async<G>, h: Async<H>, i: Async<I>, j: Async<J>, k: Async<K>, l: Async<L>, m: Async<M>, n: Async<N>, o: Async<O>, p: Async<P>, q: Async<Q>, r: Async<R>, s: Async<S>, t: Async<T>, u: Async<U>, v: Async<V>                                                    ): void;
    export function run<A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W      >(a: Async<A>, b: Async<B>, c: Async<C>, d: Async<D>, e: Async<E>, f: Async<F>, g: Async<G>, h: Async<H>, i: Async<I>, j: Async<J>, k: Async<K>, l: Async<L>, m: Async<M>, n: Async<N>, o: Async<O>, p: Async<P>, q: Async<Q>, r: Async<R>, s: Async<S>, t: Async<T>, u: Async<U>, v: Async<V>, w: Async<W>                                       ): void;    
    export function run<A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X    >(a: Async<A>, b: Async<B>, c: Async<C>, d: Async<D>, e: Async<E>, f: Async<F>, g: Async<G>, h: Async<H>, i: Async<I>, j: Async<J>, k: Async<K>, l: Async<L>, m: Async<M>, n: Async<N>, o: Async<O>, p: Async<P>, q: Async<Q>, r: Async<R>, s: Async<S>, t: Async<T>, u: Async<U>, v: Async<V>, w: Async<W>, x: Async<X>                          ): void;
    export function run<A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y  >(a: Async<A>, b: Async<B>, c: Async<C>, d: Async<D>, e: Async<E>, f: Async<F>, g: Async<G>, h: Async<H>, i: Async<I>, j: Async<J>, k: Async<K>, l: Async<L>, m: Async<M>, n: Async<N>, o: Async<O>, p: Async<P>, q: Async<Q>, r: Async<R>, s: Async<S>, t: Async<T>, u: Async<U>, v: Async<V>, w: Async<W>, x: Async<X>, y: Async<Y>             ): void;
    export function run<A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z>(a: Async<A>, b: Async<B>, c: Async<C>, d: Async<D>, e: Async<E>, f: Async<F>, g: Async<G>, h: Async<H>, i: Async<I>, j: Async<J>, k: Async<K>, l: Async<L>, m: Async<M>, n: Async<N>, o: Async<O>, p: Async<P>, q: Async<Q>, r: Async<R>, s: Async<S>, t: Async<T>, u: Async<U>, v: Async<V>, w: Async<W>, x: Async<X>, y: Async<Y>, z: Async<Z>): void;
    export function run(...xs: Async<any>[]): void {
        series.apply(undefined, xs)(()=>{}, function(){ throw new Error(); });
    }

    // Utils //

    // (>>)
    export function next<S,T>(a: Async<S>, b: Async<T>): Async<T> {
        return bind(a, ()=>b);
    }

    function _pure_<T>(x: any): Async<T> {
        switch(typeof x){
            case "string":
            case "number":
            case "boolean":
            case "object":
            case "undefined":
                return pure(x);
            default:
                return x;
        }
    }    

    // inject and eject //

    export function inject<T>(f: ()=>T): Async<T> {
        return function(succ: (t: T)=>void, fail: ()=>void){ succ(f()); };
    }

    export function eject<T>(x: Async<T>, f: (t: T)=>void): Async<void> {
        return function(succ: ()=>void, fail: ()=>void){
            x(function(result: T){ f(result); succ(); }, fail);
        };   
    }


    // error handling ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    export function fail(): Async<void> {
        return function(succ: ()=>void, fail: ()=>void){
            fail();
        };
    }    

    export function recover<T>(defaultValue: T, xs: Async<T>): Async<T> {
        return function(succ: (result: T)=>void, fail: ()=>void){
            xs(succ, function(){ succ(defaultValue); });
        };
    }

    // control flow ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    export var nop: Async<void> = pure(undefined);

    export function cache<T>(xs: Async<T>): Async<T> {
        var value: T = undefined;
        var succeed: boolean = undefined;
        var listener: { succ: (t: T)=>void; fail: ()=>void; }[] = [];
        return function(succ: (result: T)=>void, fail: ()=>void){
            if(typeof succeed === "undefined"){
                if(listener.length == 0){
                    xs(function(v: T){ 
                        value = v;
                        succeed = true;
                        listener.forEach(listener=>listener.succ(v));
                    }, function(){ 
                        succeed = false;
                        listener.forEach(listener=>listener.fail());
                    });
                }
                listener.push({ succ: succ, fail: fail });                
            }else if(succeed){
                succ(value);
            }else{
                fail();
            }
        };
    }    

    export function fastest<T>(...xs: Async<T>[]): Async<T> {
        return function(succ: (result: T)=>void, fail: ()=>void){
            var active: boolean = true;
            function _succ(result: T){
                if(active){
                    active = false;
                    succ(result);
                }
            }
            function _fail(){
                if(active){
                    active = false;
                    fail();
                }
            }
            xs.forEach(x=>x(_succ, _fail));
        };
    }

    export function when<T>(x: Async<boolean>, ifthen: Async<T>, ifelse?: Async<T>): Async<T> {
        return function(succ: (result: T)=>void, fail: ()=>void){
            x(function(result: boolean){
                if(result){
                    ifthen(succ, fail);
                }else if(ifelse){
                    ifelse(succ, fail);
                }
            }, fail);
        }
    }

    export function repeat<I,T>(keys: Async<I[]>, f: (i: I)=>Async<T>): Async<T> ;
    export function repeat<I,T>(keys: I[], f: (i: I)=>Async<T>): Async<T> ;
    export function repeat<I,T>(keys: any, f: (i: I)=>Async<T>): Async<T> {
        keys = keys instanceof Array ? pure(keys) : keys;
        return function(succ: ()=>void, fail: ()=>void){
            keys(function(ks: I[]){
                series.apply(undefined, ks.map(f))(succ, fail);
            }, fail);
        };
    }

    /// Pauses the current context for a specified amount of time. 
    /// 指定した時間、現在のコンテキストの実行を中断します。
    /// @param pmilliseconds The number of milliseconds the current context should be paused for.
    export function wait(milliseconds: Async<number>): Async<void>;
    export function wait(milliseconds: number       ): Async<void>;
    export function wait(milliseconds: any          ): Async<void> {
        milliseconds = typeof(milliseconds) === "number" ? pure(milliseconds) : milliseconds;
        return function(succ: ()=>void, fail: ()=>void){
            milliseconds(function(result: number){
                window.setTimeout(function(){ succ(); }, result);
            }, fail);
        }
    }

    export function setTimeout(a: Async<any>, milliseconds: Async<number>): Async<number>;
    export function setTimeout(a: Async<any>, milliseconds: number       ): Async<number>;
    export function setTimeout(a: Async<any>, milliseconds: any          ): Async<number> {
        milliseconds = typeof(milliseconds) === "number" ? pure(milliseconds) : milliseconds;
        return function(succ: (t: number)=>void, fail: ()=>void){
            milliseconds(function(t: number){ succ(window.setTimeout(function(){ run(a); }, t)); }, fail);
        }
    }

    export function clearTimeout(timerId: Async<number>): Async<void>;
    export function clearTimeout(timerId: number       ): Async<void>;
    export function clearTimeout(timerId: any          ): Async<void> {
        timerId = typeof(timerId) === "number" ? pure(timerId) : timerId;
        return function(succ: ()=>void, fail: ()=>void){
            timerId(function(t: number){ window.clearTimeout(t); succ(); }, fail);
        }
    }

    export function setInterval(a: Async<any>, milliseconds: Async<number>): Async<number>;
    export function setInterval(a: Async<any>, milliseconds: number       ): Async<number>;
    export function setInterval(a: Async<any>, milliseconds: any          ): Async<number> {
        milliseconds = typeof(milliseconds) === "number" ? pure(milliseconds) : milliseconds;
        return function(succ: (t: number)=>void, fail: ()=>void){
            milliseconds(function(t: number){ succ(window.setInterval(function(){ run(a); }, t)); }, fail);
        }
    }

    export function clearInterval(timerId: Async<number>): Async<void>;
    export function clearInterval(timerId: number       ): Async<void>;
    export function clearInterval(timerId: any          ): Async<void> {
        timerId = typeof(timerId) === "number" ? pure(timerId) : timerId;
        return function(succ: ()=>void, fail: ()=>void){
            timerId(function(t: number){ window.clearInterval(t); succ(); }, fail);
        }
    }

    export function requestAnimationFrame(a: Async<any>): Async<number> {
        return function(succ: (t: number)=>void, fail: ()=>void){
            succ(window.requestAnimationFrame(function(){ run(a); }));
        }
    }

    export function cancelAnimationFrame(timerId: Async<number>): Async<void>;
    export function cancelAnimationFrame(timerId: number       ): Async<void>;
    export function cancelAnimationFrame(timerId: any          ): Async<void> {
        timerId = typeof(timerId) === "number" ? pure(timerId) : timerId;
        return function(succ: ()=>void, fail: ()=>void){
            timerId(function(t: number){ window.cancelAnimationFrame(t); succ(); }, fail);
        }
    }

    // lifted operators /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // generic //

    // console.log
    export function log(message: Async<string>): Async<void> ;
    export function log(message: string       ): Async<void> ;
    export function log(message: jQuery.Promise<string>): Async<void> ; 
    export function log(message: any          ): Async<void> {
        return fmap(console.log.bind(console), _pure_<string>(message));
    }

    // (==)
    export function equals<T>(a: Async<T>, b: Async<T>): Async<boolean>{
        return lift((xa: T, xb: T)=>xa==xb)(a, b);
    }

    export function notEquals<T>(a: Async<T>, b: Async<T>): Async<boolean>{
        return lift((xa: T, xb: T)=>xa!=xb)(a, b);
    }    

    // boolean //

    export function not(x: Async<boolean>): Async<boolean>{
        return lift((y: boolean)=>!y)(x);
    }

    // number //

    export function max(...xs: Async<number>[]): Async<number>{
        return lift(ys=>Math.max.apply(undefined, ys))(amap(xs));
    }

    export function min(...xs: Async<number>[]): Async<number>{
        return lift(ys=>Math.min.apply(undefined, ys))(amap(xs));
    }

    export function abs(x: Async<number>): Async<number>{
        return lift(Math.abs)(x);
    }    

    // string //

    export function toString(x: Async<any>): Async<string> {
        return lift((x: any)=>x+"")(x);
    }
    
    export function toUpperCase(s: Async<string>): Async<string>{
        return lift((x: string)=>x.toUpperCase())(s);
    }

    export function strcat(...xs: Async<string>[]): Async<string> {
        return lift((ys: string[])=>ys.join(""))(amap(xs));
    }    

    // array //

    export function amap<T>(xs: Async<T>[]): Async<T[]> {
        return function(succ: (result: T[])=>void, fail: ()=>void){
            var values: T[] = new Array<T>(xs.length);
            var count: number = 0;
            xs.forEach((x: Async, i: number)=>{
                x(function(result: T){ 
                    values[i] = result;
                    count++;
                    if(count == xs.length){
                        succ(values);
                    } 
                }, fail);
            });
        };
    }

    export function array<T>(...xs: Async<T>[]): Async<T[]> {
        return amap(xs);
    }

    export function length(xs: Async<any[]>): Async<number> {
        return lift(xs=>xs.length)(xs);
    }

    export function at<T>(i: Async<number>, xs: Async<T[]>): Async<T>;
    export function at<T>(i: number       , xs: Async<T[]>): Async<T>;
    export function at<T>(i: any          , xs: Async<T[]>): Async<T> {
        i = typeof i === "number" ? pure(i) : i;
        return lift((i,xs)=>xs[i])(i, xs);
    }

    export function putAt<T>(i: Async<number>, x: Async<T>, xs: Async<T[]>): Async<void>;
    export function putAt<T>(i: number       , x: Async<T>, xs: Async<T[]>): Async<void>;
    export function putAt<T>(i: any          , x: Async<T>, xs: Async<T[]>): Async<void> {
        i = typeof i === "number" ? pure(i) : i;
        return lift((i,x,xs)=>{ xs[i] = x; })(i, x, xs);
    }    

    export function concat<T>(...xs: Async<T[]>[]): Async<T[]> {
        return lift((ys: T[])=>[].concat(ys))(amap(xs));
    } 

    export function join(xs: Async<string[]>, separator: Async<string> = pure(",")): Async<string> {
        return lift((x: string[], s: string)=>x.join(s))(xs, separator);
    }

    export function map<S,T>(f: Async<(t: T)=>S>, xs: Async<T[]>): Async<S[]> {
        function _map(f: (t: T)=>S, xs: T[]): S[] {
            return xs.map(f);
        }
        return lift(_map)(f, xs);
    }

    export function foldl<S,T>(f: Async<(s: S, t: T)=>S>, x: Async<S>, xs: Async<T[]>): Async<S> {
        function _foldl<S,T>(f: (s: S, t: T)=>S, s: S, array: T[]): S {
            for(var i = 0; i < array.length; i++){
                s = f(s, array[i]);
            }
            return s;
        }
        return lift(_foldl)(f, x, xs);
    }

    export function and(xs: Async<boolean[]>): Async<boolean> {
        return function(succ: (result: boolean)=>void, fail: ()=>void){
            return foldl(pure((a: boolean, b: boolean)=>a&&b), pure(true), xs);
        };
    }

    export function or(xs: Async<boolean[]>): Async<boolean> {
        return function(succ: (result: boolean)=>void, fail: ()=>void){
            return foldl(pure((a: boolean, b: boolean)=>a||b), pure(false), xs);
        };
    }

    // ajax /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // get a text file with XMLHttpRequest.
    // XMLHttpRequest でファイルを取得します。 
    export function get(url: Async<string>, chached?: boolean): Async<string>;
    export function get(url: string       , chached?: boolean): Async<string>;
    export function get(url: any          , chached: boolean = true): Async<string> {
        url = typeof(url) === "string" ? pure(url) : url;
        return function(succ: (text: string)=>void, fail: ()=>void){
            url(function(result: string){
                var xhr = new XMLHttpRequest();
                xhr.onload = function(){
                    succ(xhr.responseText);
                };
                xhr.onerror = function(){
                    fail();
                };
                xhr.open("GET", result);
                if( ! chached){
                    xhr.setRequestHeader('Pragma', 'no-cache');
                    xhr.setRequestHeader('Cache-Control', 'no-cache');
                    xhr.setRequestHeader('If-Modified-Since', 'Thu, 01 Jun 1970 00:00:00 GMT');                
                }
                xhr.send();
            }, fail);
        }
    }

    export function getImage(url: string): Async<HTMLImageElement> {
        return function(succ: (img: HTMLImageElement)=>void, fail: ()=>void){
            var img = new Image();
            img.src = url;
            img.addEventListener("load", function(){ succ(img); });
            img.addEventListener("error", fail);
        }
    }

    // jquery integration ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    export function fromPromise<T>(promise: jQuery.Promise<T>): Async<T> {
        return function(succ: (t: T)=>void, fail: ()=>void){
            jQuery.when(promise).then((t: T)=>succ(t)).fail(fail);
        }
    }

    export function toPromise<T>(async: Async<T>): jQuery.Promise<T> {
        return new jQuery.Deferred<T>((def: jQuery.Deferred<T>)=>{
            async((t: T)=>def.resolve(t), ()=>def.reject());
        }).promise();
    }

    // Web Workers integration ///////////////////////////////////////////////////////////////////////////////////////////

    // worker(s,a) creates a worker with a script s and run it.
    // ワーカースレッドを作成して実行します。
    export function worker<T,S>(scriptPath: Async<string>, arg: Async<T>): Async<S> ;
    export function worker<T,S>(scriptPath: Async<string>, arg: number  ): Async<S> ;
    export function worker<T,S>(scriptPath: Async<string>, arg: string  ): Async<S> ;
    export function worker<T,S>(scriptPath: Async<string>, arg: boolean ): Async<S> ;
    export function worker<T,S>(scriptPath: Async<string>               ): Async<S> ;
    export function worker<T,S>(scriptPath:       string , arg: Async<T>): Async<S> ;
    export function worker<T,S>(scriptPath:       string , arg: number  ): Async<S> ;
    export function worker<T,S>(scriptPath:       string , arg: string  ): Async<S> ;
    export function worker<T,S>(scriptPath:       string , arg: boolean ): Async<S> ;
    export function worker<T,S>(scriptPath:       string                ): Async<S> ;
    export function worker<T,S>(scriptPath: any          , arg?: any    ): Async<S> {
        function _fork<T,S>(scriptPath: string, _arg: T): Async<S> {
            return function(succ: (t: S)=>void, fail: ()=>void){
                var worker = new Worker(scriptPath);
                worker.onmessage = (e)=>{ succ(e.data); };
                worker.postMessage(_arg);
            };
        }
        return liftAsync(_fork)(_pure_(scriptPath), _pure_(arg));
    }
}




module jQuery {

    export declare function when<T>(...deferreds: GenericPromise<T>[]): Promise<T>;
    export declare function when<T>(...deferreds: T[]): Promise<T>;

    export declare function get(url: string, data?: any, success?: any, dataType?: any): Promise;
    export declare function getJSON(url: string, data?: any, success?: any): Promise;
    export declare function getScript(url: string, success?: any): Promise;

    export interface GenericPromise<T> {
        then<U>(onFulfill: (value: T) => U, onReject?: (reason: any) => U): GenericPromise<U>;
        then<U>(onFulfill: (value: T) => GenericPromise<U>, onReject?: (reason: any) => U): GenericPromise<U>;
        then<U>(onFulfill: (value: T) => U, onReject?: (reason: any) => GenericPromise<U>): GenericPromise<U>;
        then<U>(onFulfill: (value: T) => GenericPromise<U>, onReject?: (reason: any) => GenericPromise<U>): GenericPromise<U>;
    }

    export interface Promise<T> {
        always(...alwaysCallbacks: any[]): Promise<T>;
        done(...doneCallbacks: any[]): Promise<T>;
        fail(...failCallbacks: any[]): Promise<T>;
        progress(...progressCallbacks: any[]): Promise<T>;

        then<U>(onFulfill: (value: T) => U, onReject?: (...reasons: any[]) => U, onProgress?: (...progression: any[]) => any): Promise<U>;
        then<U>(onFulfill: (value: T) => GenericPromise<U>, onReject?: (...reasons: any[]) => U, onProgress?: (...progression: any[]) => any): Promise<U>;
        then<U>(onFulfill: (value: T) => U, onReject?: (...reasons: any[]) => GenericPromise<U>, onProgress?: (...progression: any[]) => any): Promise<U>;
        then<U>(onFulfill: (value: T) => GenericPromise<U>, onReject?: (...reasons: any[]) => GenericPromise<U>, onProgress?: (...progression: any[]) => any): Promise<U>;

        // Because JQuery Promises Suck
        then<U>(onFulfill: (...values: any[]) => U, onReject?: (...reasons: any[]) => U, onProgress?: (...progression: any[]) => any): Promise<U>;
        then<U>(onFulfill: (...values: any[]) => GenericPromise<U>, onReject?: (...reasons: any[]) => U, onProgress?: (...progression: any[]) => any): Promise<U>;
        then<U>(onFulfill: (...values: any[]) => U, onReject?: (...reasons: any[]) => GenericPromise<U>, onProgress?: (...progression: any[]) => any): Promise<U>;
        then<U>(onFulfill: (...values: any[]) => GenericPromise<U>, onReject?: (...reasons: any[]) => GenericPromise<U>, onProgress?: (...progression: any[]) => any): Promise<U>;
    }

    export declare class Deferred<T> implements Promise<T> {

        constructor(beforeStart?: (deferred: Deferred<T>)=>any);

        always(...alwaysCallbacks: any[]): Deferred<T>;
        done(...doneCallbacks: any[]): Deferred<T>;
        fail(...failCallbacks: any[]): Deferred<T>;
        progress(...progressCallbacks: any[]): Deferred<T>;

        notify(...args: any[]): Deferred<T>;
        notifyWith(context: any, ...args: any[]): Deferred<T>;

        reject(...args: any[]): Deferred<T>;
        rejectWith(context: any, ...args: any[]): Deferred<T>;

        resolve(val: T): Deferred<T>;
        resolve(...args: any[]): Deferred<T>;
        resolveWith(context: any, ...args: any[]): Deferred<T>;
        state(): string;

        promise(target?: any): Promise<T>;


        then<U>(onFulfill: (value: T) => U, onReject?: (...reasons: any[]) => U, onProgress?: (...progression: any[]) => any): Promise<U>;
        then<U>(onFulfill: (value: T) => GenericPromise<U>, onReject?: (...reasons: any[]) => U, onProgress?: (...progression: any[]) => any): Promise<U>;
        then<U>(onFulfill: (value: T) => U, onReject?: (...reasons: any[]) => GenericPromise<U>, onProgress?: (...progression: any[]) => any): Promise<U>;
        then<U>(onFulfill: (value: T) => GenericPromise<U>, onReject?: (...reasons: any[]) => GenericPromise<U>, onProgress?: (...progression: any[]) => any): Promise<U>;

        // Because JQuery Promises Suck
        then<U>(onFulfill: (...values: any[]) => U, onReject?: (...reasons: any[]) => U, onProgress?: (...progression: any[]) => any): Promise<U>;
        then<U>(onFulfill: (...values: any[]) => GenericPromise<U>, onReject?: (...reasons: any[]) => U, onProgress?: (...progression: any[]) => any): Promise<U>;
        then<U>(onFulfill: (...values: any[]) => U, onReject?: (...reasons: any[]) => GenericPromise<U>, onProgress?: (...progression: any[]) => any): Promise<U>;
        then<U>(onFulfill: (...values: any[]) => GenericPromise<U>, onReject?: (...reasons: any[]) => GenericPromise<U>, onProgress?: (...progression: any[]) => any): Promise<U>;
    }
}