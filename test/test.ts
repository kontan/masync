/// <reference path="../masync.ts" />

module masync.tests {

    declare function test(name: string, callbak: ()=>void): void;
    declare function ok(condition: boolean, message?: string): void;
    declare function throws(block: ()=>any, err: new()=>Error, message?: string): void;

    declare module qunit {
        function module(name: string, lifecycle: ()=>void): void;
    }

    function check<T>(value: Async<T>, reference: T, name: string, message?: string): masync.Async<void> {
        return masync.eject(value, (x)=>{
            test(name, ()=>{
                ok(x == reference, message);
            });
        });
    }

    module array {
        masync.run(    
            check(masync.foldl(masync.pure((x,y)=>x+y), masync.pure(""), masync.array(
                masync.get("a.txt"),
                masync.toString(masync.pure("b")),
                masync.pure("c")
            )), "abc", "foldl string"),
            check(masync.foldl(masync.pure((x,y)=>x+y), masync.pure(0), masync.array(
                masync.pure(1),
                masync.pure(2),
                masync.pure(3)
            )), 6, "foldl number")
        );
        
    }    

    module error {
        test("error", ()=>{
            throws(()=>{ masync.run(masync.fail()) }, Error);
        });

        var v: masync.Async<number> = masync.recover(20,
            masync.series(
                masync.fail(),
                masync.pure(10)
            )
        );
        masync.run(check(v, 20, "recover"));
    }

    module fileopen {
        var a = masync.get("a.txt");
        var b = masync.get("b.txt");
        masync.run(
            masync.log("hoge"),
            check(masync.strcat(a, b), "ab", "fileopen")
        );
    }

    module ordering {
        function getAndLog(path: string, time: number): Async<string> {
            return masync.series(
                masync.wait(time),
                masync.get(path, false)
            )
        }

        var a = getAndLog("a.txt", 500);
        var b = getAndLog("b.txt", 800);
        var c = getAndLog("c.txt", 100);
        var d = getAndLog("d.txt", 300);

        masync.run(
            check(masync.strcat(a, b, c, d), "abcd", "fileopen")
        );

        masync.run(
            check(masync.fastest(a, b, c, d), "c", "fastest")
        );        
    }

    module promise {
        module from {
            var ad = masync.strcat(
                masync.fromPromise(jQuery.get("a.txt")),   
                masync.get("d.txt")
            );
            masync.run(
                check(ad, "ad", "fromPromise")
            );
        }

        module to {
            masync.toPromise(masync.get("b.txt")).then((data)=>{
                test("toPromise", ()=>{
                    ok(data === "b");
                });
            });
        }
    }

    module worker {
        masync.run(
            check(masync.worker("worker.js", masync.pure(10)), 20, "fork")
        );
    }
}