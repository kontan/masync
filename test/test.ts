/// <reference path="../masync.ts" />

var getAndLog = (path, time)=>masync.series(
    masync.wait(time),
    masync.bind(masync.get(path), masync.log)
);

var a = getAndLog("a.txt", 1000);
var b = getAndLog("b.txt",  500);
var c = getAndLog("c.txt",  300);
var d = getAndLog("d.txt", 1000);


/*
masync.run(
    masync.parallel(a, masync.series(b, c)),
    d
);
*/


masync.run(
    masync.log(
        masync.strcat(
            masync.fromPromise(jQuery.get("a.txt")), 
            masync.get("d.txt")
        )
    )
);

masync.run(masync.log(jQuery.get("a.txt")));


masync.toPromise(masync.get("b.txt")).then((data)=>console.log(data));



