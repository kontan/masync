module async {
    export interface Async<T> {
        (success: (t: T)=>void, fail: ()=>void): void; 
    }

    // Functor //
    export function fmap<S,T>(f: (t: T)=>S, x: Async<T>): Async<S> {
        return function(success: (result: S)=>void, fail: ()=>void){
            x(function(result: T){ success(f(result)); }, fail);
        };
    }

    // Applicative //
    export function pure<T>(t: T): Async<T> {
        return function(success: (r: T)=>void, fail: ()=>void){ success(t); };
    }

    export function inject<T>(f: ()=>T): Async<T> {
        return function(success: (t: T)=>void, fail: ()=>void){ success(f()); };
    }

    export function apply<S,T>(f: Async<(t: T)=>S>, x: Async<T>): Async<S> {
        return function(success: (result: S)=>void, fail: ()=>void){
            f((g: (t: T)=>S)=>{ 
                x((result: T)=>{ success(g(result)); }, fail);
            }, fail)
        };
    }

    // Monad //
    export function bind<T,S>(x: Async<T>, f: (t: T)=>Async<S>): Async<S> {
        return (success: (s: S)=>void, fail: ()=>void)=>{ 
            x((t: T)=>{ 
                f(t)((s: S)=>{
                    success(s);
                }, fail);
            }, fail); 
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
        return function(){
            var actions: Async<any>[] = Array.prototype.slice.call(arguments);
            return function(success: (r: R)=>void, fail: ()=>void){
                var args: any[] = new Array<any>(actions.length);
                var count: number = 0;
                actions.forEach((action: Async<any>, i: number)=>{
                    action(function(result: any){ 
                        args[i] = result; 
                        count++;
                        if(count == actions.length){
                            success(f.apply(undefined, args));
                        }
                    }, fail);
                });
            };
        };
    }

    // sequential evalution
    export function seq<A                                                  ,Return>(a: Async<A>                                                                                                                                                                                                                                                                                                                                     , last: Async<Return>): Async<Return>;
    export function seq<A,B                                                ,Return>(a: Async<A>, b: Async<B>                                                                                                                                                                                                                                                                                                                        , last: Async<Return>): Async<Return>;
    export function seq<A,B,C                                              ,Return>(a: Async<A>, b: Async<B>, c: Async<C>                                                                                                                                                                                                                                                                                                           , last: Async<Return>): Async<Return>;
    export function seq<A,B,C,D                                            ,Return>(a: Async<A>, b: Async<B>, c: Async<C>, d: Async<D>                                                                                                                                                                                                                                                                                              , last: Async<Return>): Async<Return>;
    export function seq<A,B,C,D,E                                          ,Return>(a: Async<A>, b: Async<B>, c: Async<C>, d: Async<D>, e: Async<E>                                                                                                                                                                                                                                                                                 , last: Async<Return>): Async<Return>;
    export function seq<A,B,C,D,E,F                                        ,Return>(a: Async<A>, b: Async<B>, c: Async<C>, d: Async<D>, e: Async<E>, f: Async<F>                                                                                                                                                                                                                                                                    , last: Async<Return>): Async<Return>;
    export function seq<A,B,C,D,E,F,G                                      ,Return>(a: Async<A>, b: Async<B>, c: Async<C>, d: Async<D>, e: Async<E>, f: Async<F>, g: Async<G>                                                                                                                                                                                                                                                       , last: Async<Return>): Async<Return>;
    export function seq<A,B,C,D,E,F,G,H                                    ,Return>(a: Async<A>, b: Async<B>, c: Async<C>, d: Async<D>, e: Async<E>, f: Async<F>, g: Async<G>, h: Async<H>                                                                                                                                                                                                                                          , last: Async<Return>): Async<Return>;
    export function seq<A,B,C,D,E,F,G,H,I                                  ,Return>(a: Async<A>, b: Async<B>, c: Async<C>, d: Async<D>, e: Async<E>, f: Async<F>, g: Async<G>, h: Async<H>, i: Async<I>                                                                                                                                                                                                                             , last: Async<Return>): Async<Return>;
    export function seq<A,B,C,D,E,F,G,H,I,J                                ,Return>(a: Async<A>, b: Async<B>, c: Async<C>, d: Async<D>, e: Async<E>, f: Async<F>, g: Async<G>, h: Async<H>, i: Async<I>, j: Async<J>                                                                                                                                                                                                                , last: Async<Return>): Async<Return>;
    export function seq<A,B,C,D,E,F,G,H,I,J,K                              ,Return>(a: Async<A>, b: Async<B>, c: Async<C>, d: Async<D>, e: Async<E>, f: Async<F>, g: Async<G>, h: Async<H>, i: Async<I>, j: Async<J>, k: Async<K>                                                                                                                                                                                                   , last: Async<Return>): Async<Return>;
    export function seq<A,B,C,D,E,F,G,H,I,J,K,L                            ,Return>(a: Async<A>, b: Async<B>, c: Async<C>, d: Async<D>, e: Async<E>, f: Async<F>, g: Async<G>, h: Async<H>, i: Async<I>, j: Async<J>, k: Async<K>, l: Async<L>                                                                                                                                                                                      , last: Async<Return>): Async<Return>;
    export function seq<A,B,C,D,E,F,G,H,I,J,K,L,M                          ,Return>(a: Async<A>, b: Async<B>, c: Async<C>, d: Async<D>, e: Async<E>, f: Async<F>, g: Async<G>, h: Async<H>, i: Async<I>, j: Async<J>, k: Async<K>, l: Async<L>, m: Async<M>                                                                                                                                                                         , last: Async<Return>): Async<Return>;
    export function seq<A,B,C,D,E,F,G,H,I,J,K,L,M,N                        ,Return>(a: Async<A>, b: Async<B>, c: Async<C>, d: Async<D>, e: Async<E>, f: Async<F>, g: Async<G>, h: Async<H>, i: Async<I>, j: Async<J>, k: Async<K>, l: Async<L>, m: Async<M>, n: Async<N>                                                                                                                                                            , last: Async<Return>): Async<Return>;
    export function seq<A,B,C,D,E,F,G,H,I,J,K,L,M,N,O                      ,Return>(a: Async<A>, b: Async<B>, c: Async<C>, d: Async<D>, e: Async<E>, f: Async<F>, g: Async<G>, h: Async<H>, i: Async<I>, j: Async<J>, k: Async<K>, l: Async<L>, m: Async<M>, n: Async<N>, o: Async<O>                                                                                                                                               , last: Async<Return>): Async<Return>;
    export function seq<A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P                    ,Return>(a: Async<A>, b: Async<B>, c: Async<C>, d: Async<D>, e: Async<E>, f: Async<F>, g: Async<G>, h: Async<H>, i: Async<I>, j: Async<J>, k: Async<K>, l: Async<L>, m: Async<M>, n: Async<N>, o: Async<O>, p: Async<P>                                                                                                                                  , last: Async<Return>): Async<Return>;
    export function seq<A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q                  ,Return>(a: Async<A>, b: Async<B>, c: Async<C>, d: Async<D>, e: Async<E>, f: Async<F>, g: Async<G>, h: Async<H>, i: Async<I>, j: Async<J>, k: Async<K>, l: Async<L>, m: Async<M>, n: Async<N>, o: Async<O>, p: Async<P>, q: Async<Q>                                                                                                                     , last: Async<Return>): Async<Return>;    
    export function seq<A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R                ,Return>(a: Async<A>, b: Async<B>, c: Async<C>, d: Async<D>, e: Async<E>, f: Async<F>, g: Async<G>, h: Async<H>, i: Async<I>, j: Async<J>, k: Async<K>, l: Async<L>, m: Async<M>, n: Async<N>, o: Async<O>, p: Async<P>, q: Async<Q>, r: Async<R>                                                                                                        , last: Async<Return>): Async<Return>;
    export function seq<A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S              ,Return>(a: Async<A>, b: Async<B>, c: Async<C>, d: Async<D>, e: Async<E>, f: Async<F>, g: Async<G>, h: Async<H>, i: Async<I>, j: Async<J>, k: Async<K>, l: Async<L>, m: Async<M>, n: Async<N>, o: Async<O>, p: Async<P>, q: Async<Q>, r: Async<R>, s: Async<S>                                                                                           , last: Async<Return>): Async<Return>;
    export function seq<A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T            ,Return>(a: Async<A>, b: Async<B>, c: Async<C>, d: Async<D>, e: Async<E>, f: Async<F>, g: Async<G>, h: Async<H>, i: Async<I>, j: Async<J>, k: Async<K>, l: Async<L>, m: Async<M>, n: Async<N>, o: Async<O>, p: Async<P>, q: Async<Q>, r: Async<R>, s: Async<S>, t: Async<T>                                                                              , last: Async<Return>): Async<Return>;
    export function seq<A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U          ,Return>(a: Async<A>, b: Async<B>, c: Async<C>, d: Async<D>, e: Async<E>, f: Async<F>, g: Async<G>, h: Async<H>, i: Async<I>, j: Async<J>, k: Async<K>, l: Async<L>, m: Async<M>, n: Async<N>, o: Async<O>, p: Async<P>, q: Async<Q>, r: Async<R>, s: Async<S>, t: Async<T>, u: Async<U>                                                                 , last: Async<Return>): Async<Return>;
    export function seq<A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V        ,Return>(a: Async<A>, b: Async<B>, c: Async<C>, d: Async<D>, e: Async<E>, f: Async<F>, g: Async<G>, h: Async<H>, i: Async<I>, j: Async<J>, k: Async<K>, l: Async<L>, m: Async<M>, n: Async<N>, o: Async<O>, p: Async<P>, q: Async<Q>, r: Async<R>, s: Async<S>, t: Async<T>, u: Async<U>, v: Async<V>                                                    , last: Async<Return>): Async<Return>;
    export function seq<A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W      ,Return>(a: Async<A>, b: Async<B>, c: Async<C>, d: Async<D>, e: Async<E>, f: Async<F>, g: Async<G>, h: Async<H>, i: Async<I>, j: Async<J>, k: Async<K>, l: Async<L>, m: Async<M>, n: Async<N>, o: Async<O>, p: Async<P>, q: Async<Q>, r: Async<R>, s: Async<S>, t: Async<T>, u: Async<U>, v: Async<V>, w: Async<W>                                       , last: Async<Return>): Async<Return>;    
    export function seq<A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X    ,Return>(a: Async<A>, b: Async<B>, c: Async<C>, d: Async<D>, e: Async<E>, f: Async<F>, g: Async<G>, h: Async<H>, i: Async<I>, j: Async<J>, k: Async<K>, l: Async<L>, m: Async<M>, n: Async<N>, o: Async<O>, p: Async<P>, q: Async<Q>, r: Async<R>, s: Async<S>, t: Async<T>, u: Async<U>, v: Async<V>, w: Async<W>, x: Async<X>                          , last: Async<Return>): Async<Return>;
    export function seq<A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y  ,Return>(a: Async<A>, b: Async<B>, c: Async<C>, d: Async<D>, e: Async<E>, f: Async<F>, g: Async<G>, h: Async<H>, i: Async<I>, j: Async<J>, k: Async<K>, l: Async<L>, m: Async<M>, n: Async<N>, o: Async<O>, p: Async<P>, q: Async<Q>, r: Async<R>, s: Async<S>, t: Async<T>, u: Async<U>, v: Async<V>, w: Async<W>, x: Async<X>, y: Async<Y>             , last: Async<Return>): Async<Return>;
    export function seq<A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z,Return>(a: Async<A>, b: Async<B>, c: Async<C>, d: Async<D>, e: Async<E>, f: Async<F>, g: Async<G>, h: Async<H>, i: Async<I>, j: Async<J>, k: Async<K>, l: Async<L>, m: Async<M>, n: Async<N>, o: Async<O>, p: Async<P>, q: Async<Q>, r: Async<R>, s: Async<S>, t: Async<T>, u: Async<U>, v: Async<V>, w: Async<W>, x: Async<X>, y: Async<Y>, z: Async<Z>, last: Async<Return>): Async<Return>;
    export function seq(...actions: Async<any>[]): Async<any> {
        return function(success: (r: any)=>void, fail: ()=>void){
            var acs: Async<any>[] = actions.slice(0);
            var seqResult: any = null;
            function run(){
                if(acs.length == 0){
                    success(seqResult);
                }else{
                    acs[0](function(result){ seqResult = result; acs.shift(); run(); }, fail);
                }
            }
            run();        
        };
    }

    export function series<T>(...actions: Async<T>[]): Async<T> {
        return seq.apply(undefined, actions);
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
    export function run(...actions: Async<any>[]): void {
        seq.apply(undefined, actions)(function(){}, function(){ throw new Error(); });
    }

    // error processing ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    export function fail(): Async<void> {
        return function(success: ()=>void, fail: ()=>void){
            fail();
        };
    }    

    export function recover<T>(defaultValue: T, action: Async<T>): Async<T> {
        return function(success: (result: T)=>void, fail: ()=>void){
            action(success, function(){ success(defaultValue); });
        };
    }

    // control flow ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    export function nop(): Async<void> {
        return pure(undefined);
    }

    export function cache<T>(action: Async<T>): Async<T> {
        var value: T = undefined;
        var succeed: boolean = undefined;
        var listener: { success: (t: T)=>void; fail: ()=>void; }[] = [];
        return function(success: (result: T)=>void, fail: ()=>void){
            if(typeof succeed === "undefined"){
                if(listener.length == 0){
                    action(function(v: T){ 
                        value = v;
                        succeed = true;
                        listener.forEach(listener=>listener.success(v));
                    }, function(){ 
                        succeed = false;
                        listener.forEach(listener=>listener.fail());
                    });
                }
                listener.push({ success: success, fail: fail });                
            }else if(succeed){
                success(value);
            }else{
                fail();
            }
        };
    }    

    export function sooner<T>(...actions: Async<T>[]): Async<T> {
        return function(success: (result: T)=>void, fail: ()=>void){
            var active: boolean = true;
            function _succ(result: T){
                if(active){
                    active = false;
                    success(result);
                }
            }
            function _fail(){
                if(active){
                    active = false;
                    fail();
                }
            }
            actions.forEach(action=>action(_succ, _fail));
        };
    }

    export function when<T>(action: Async<boolean>, ifthen: Async<T>, ifelse?: Async<T>): Async<T> {
        return function(success: (result: T)=>void, fail: ()=>void){
            action(function(result: boolean){
                if(result){
                    ifthen(success, fail);
                }else if(ifelse){
                    ifelse(success, fail);
                }
            }, fail);
        }
    }

    export function repeat<I,T>(keys: Async<I[]>, f: (i: I)=>Async<T>): Async<T> ;
    export function repeat<I,T>(keys: I[], f: (i: I)=>Async<T>): Async<T> ;
    export function repeat<I,T>(keys: any, f: (i: I)=>Async<T>): Async<T> {
        keys = keys instanceof Array ? pure(keys) : keys;
        return function(success: ()=>void, fail: ()=>void){
            keys(function(ks: I[]){
                seq.apply(undefined, ks.map(f))(success, fail);
            }, fail);
        };
    }



    // array operations //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    export function array<T>(actions: Async<T>[]): Async<T[]> {
        return function(success: (result: T[])=>void, fail: ()=>void){
            var values: T[] = new Array<T>(actions.length);
            var count: number = 0;
            actions.forEach((action: Async, i: number)=>{
                action(function(result: T){ 
                    values[i] = result;
                    count++;
                    if(count == actions.length){
                        success(values);
                    } 
                }, fail);
            });
        };
    }

    export function map<S,T>(f: (t: T)=>S, action: Async<T[]>): Async<S[]> {
        return function(success: (result: S[])=>void, fail: ()=>void){
            action(function(result: T[]){ success(result.map(f)); }, fail);
        };
    }

    export function foldl<S,T>(f: (s: S, t: T)=>S, s: S, action: Async<T[]>): Async<S> {
        return function(success: (result: S)=>void, fail: ()=>void){
            action(function(result: T[]){ 
                for(var i = 0; i < result.length; i++){
                    s = f(s, result[i]);
                }
                success(s);
            }, fail);
        };
    }

    export function and(actions: Async<boolean[]>): Async<boolean> {
        return function(success: (result: boolean)=>void, fail: ()=>void){
            return foldl((a: boolean, b: boolean)=>a&&b, true, actions);
        };
    }

    export function or(actions: Async<boolean[]>): Async<boolean> {
        return function(success: (result: boolean)=>void, fail: ()=>void){
            return foldl((a: boolean, b: boolean)=>a||b, false, actions);
        };
    }

    // Generic operations //////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    export function log(message: Async<string>): Async<void> ;
    export function log(message: string       ): Async<void> ;
    export function log(message: any          ): Async<void> {
        message = typeof(message) == "string" ? pure(message) : message;
        return function(success: ()=>void, fail: ()=>void){
            message(function(result: string){ console.log(result); success(); }, fail);
        };
    }

    export function wait(milliseconds: Async<number>): Async<void>;
    export function wait(milliseconds: number       ): Async<void>;
    export function wait(milliseconds: any          ): Async<void> {
        milliseconds = typeof(milliseconds) === "number" ? pure(milliseconds) : milliseconds;
        return function(success: ()=>void, fail: ()=>void){
            milliseconds(function(result: number){
                setTimeout(function(){ success(); }, result);
            }, fail);
        }
    }

    // lifted operators /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    export function equals<T>(a: Async<T>, b: Async<T>): Async<boolean>{
        return lift((xa: T, xb: T)=>xa==xb)(a, b);
    }

    export function toUpperCase(s: Async<string>): Async<string>{
        return lift((x: string)=>x.toUpperCase())(s);
    }

    export function concat(xs: Async<string>, ys: Async<string>): Async<string> {
        return lift((x: string, y: string)=>x + y)(xs, ys);
    } 

    export function join(xs: Async<string[]>, separator: Async<string> = pure(",")): Async<string> {
        return lift((x: string[], s: string)=>x.join(s))(xs, separator);
    }

    export function toString(x: Async<any>): Async<string> {
        return lift((x: any)=>x+"")(x);
    }

    // ajax /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    export function get(url: Async<string>, chached?: boolean): Async<string>;
    export function get(url: string       , chached?: boolean): Async<string>;
    export function get(url: any          , chached: boolean = true): Async<string> {
        url = typeof(url) === "string" ? pure(url) : url;
        return function(success: (text: string)=>void, fail: ()=>void){
            url(function(result: string){
                var xhr = new XMLHttpRequest();
                xhr.onload = function(){
                    success(xhr.responseText);
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
        return function(success: (img: HTMLImageElement)=>void, fail: ()=>void){
            var img = new Image();
            img.src = url;
            img.addEventListener("load", function(){ success(img); });
            img.addEventListener("error", fail);
        }
    }

    /// node utils ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    /*
    export module node {
        declare function require(moduleName: string): any; 

        export module fs {

            export function readFile(path: string): Async<string>{
                return function(callback: (data: string)=>void, fail: ()=>void){
                    var fs = require("fs");
                    fs.readFile(function(err: Error, data: string){
                        if(err) throw err;
                        callback(data);
                    });
                }
            }

        }
    }
    */
}
