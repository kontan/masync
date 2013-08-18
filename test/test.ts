/// <reference path="../masync.ts" />

module masync.tests {

    declare function test(name: string, callbak: ()=>void): void;
    declare function ok(condition: boolean, message?: string): void;

    function check<T>(value: Async<T>, reference: T, name: string, message?: string): masync.Async<void> {
        return masync.eject(value, (x)=>{
            test(name, ()=>{
                ok(x == reference, message);
            });
        });
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
        var getAndLog = (path, time)=>masync.series(
            masync.wait(time),
            masync.get(path)
        );

        var a = getAndLog("a.txt", 500);
        var b = getAndLog("b.txt", 800);
        var c = getAndLog("c.txt", 300);
        var d = getAndLog("d.txt", 100);

        masync.run(
            check(masync.strcat(a, b, c, d), "abcd", "fileopen")
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

        module fork {
            masync.run(
                check(masync.fork(masync.pure("worker.js"), masync.pure(10)), 20, "fork")
            );
        }
    }
}