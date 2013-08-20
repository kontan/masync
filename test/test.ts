/// <reference path="../masync.ts" />

// fake node
function require(moduleName: string): any {
    switch(moduleName){
        case "fs":
            return {
                readFile: (path: string, option: any, callback: (err: Error, data: string)=>void)=>{
                    masync.get(path)((data)=>callback(null, data), ()=>{throw new Error();});
                }
            };
        default:
            throw new Error();
    }
}


module masync.tests {

    // Qunit type declarations //////////////////////////////////////////////////////////////////////////////////////////
    
    declare function test(name: string, callbak: ()=>void): void;
    declare function ok(condition: boolean, message?: string): void;
    declare function throws(block: ()=>any, err: new()=>Error, message?: string): void;

    declare module qunit {
        function module(name: string, lifecycle: ()=>void): void;
    }

    // utils ///////////////////////////////////////////////////////////////////////////////////////////////////////////////

    function check<T>(name: string, value: Async<T>, reference: T, message?: string): masync.Async<void> {
        return masync.eject(value, (x)=>{
            test(name, ()=>{
                ok(x == reference, message);
            });
        });
    }

    function fakeGet(url: string): Async<string> {
        return masync.series(
            masync.wait(100),
            masync.pure("[Content of " + url + "]")
        );
    }

    //  tests cases ///////////////////////////////////////////////////////////////////////////////////////////////////////

    module primitives {

        var f = (x)=>pure(x*2);
        var g = (x)=>pure(x+10);
        var x = 42;
        var m = pure("42");

        masync.run( 

            check("equals true", masync.equals(
                masync.pure(20),
                masync.pure(20)
            ), true),

            check("equals false", masync.equals(
                masync.pure(20),
                masync.pure(30)
            ), false),

            check("notEquals true", masync.notEquals(
                masync.pure(20),
                masync.pure(20)
            ), false),

            check("notEquals false", masync.notEquals(
                masync.pure(20),
                masync.pure(30)
            ), true),

            check("fmap", masync.equals(
                masync.fmap(x=>x*2, masync.pure(10)),
                masync.pure(20)
            ), true),

            // (return x) >>= f == f x
            check("monad law 1", masync.equals(
                masync.bind(masync.pure(x), f), 
                f(x)
            ), true),

            // m >>= return == m
            check("monad law 2", masync.equals(
                masync.bind(m, masync.pure), 
                m
            ), true),  

            // (m >>= f) >>= g  ==  m >>= (\x -> (f x >>= g))
            check("monad law 3", masync.equals(
                masync.bind(masync.bind(m, f), g), 
                masync.bind(m, x=>masync.bind(f(x), g))
            ), true)
        );
    }

    module array {
        masync.run(    
            check("foldl string",
                masync.foldl(masync.pure((x,y)=>x+y), masync.pure(""), masync.array(
                    masync.get("a.txt"),
                    masync.toString(masync.pure("b")),
                    masync.pure("c")
                )
            ), "abc"),
            check("foldl number",
                masync.foldl(masync.pure((x,y)=>x+y), masync.pure(0), masync.array(
                    masync.pure(1),
                    masync.pure(2),
                    masync.pure(3)
                )
            ), 6)
        );
        
    }    

    module error {
        test("error", ()=>{
            throws(()=>{ masync.run(masync.fail()) }, Error);
            /*
            masync.run(
                masync.wait(1),
                masync.fail("fail in test:error!")
            );
            */
        });

        var v: masync.Async<number> = masync.recover(20,
            masync.series(
                masync.fail(),
                masync.pure(10)
            )
        );
        masync.run(check("recover", v, 20));

        function findFile(path: string){
            return masync.recover("Error: No such file: " + path,
                masync.get(path)
            );
        }


        masync.run(
            check("recover: file open success", 
                findFile("a.txt"), 
            "a"),
            check("recover: file open fail",
                findFile("noexistfile.txt"), 
            "Error: No such file: noexistfile.txt")
        );

        masync.run(masync.log(findFile("a.txt")));



        masync.run(
            check("recover with other file",
                masync.recover(masync.get("a.txt"),
                    masync.get("noexistfile.txt")
                ), "a"
            )
        );        
    }

    module fileopen {

        var a = masync.get("a.txt");
        var b = masync.get("b.txt");
        masync.run(
            masync.log("hoge"),
            check("parallel fileopen", masync.strcat(a, b), "ab")
        );


        var c = masync.get("c.txt");
        var d = masync.get("d.txt");
        masync.run(
            c,
            d,
            check("sequential fileopen", masync.strcat(c, d), "cd")
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
            check("fileopen", masync.strcat(a, b, c, d), "abcd")
        );

        masync.run(
            check("fastest", masync.fastest(a, b, c, d), "c")
        );        
    }

    module promise {
        module from {
            var ad = masync.strcat(
                masync.resolve(jQuery.get("a.txt")),   
                masync.get("d.txt")
            );
            masync.run(
                check("resolve", ad, "ad")
            );
        }

        module to {
            masync.promise(masync.get("b.txt")).then((data)=>{
                test("promise", ()=>{
                    ok(data === "b");
                });
            }, ()=>{});
        }
    }

    module worker {
        masync.run(
            check("worker", masync.worker("worker.js", masync.pure(10)), 20)
        );
    }

    module node {
        masync.run(check("node readfile", masync.fs.readFile("a.txt"), "a"));
    }
}