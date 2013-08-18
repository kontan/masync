/// <reference path="../async.ts" />

//var hoge = async.get("hoge.txt");
//var nyan = async.get(hoge);
//var main = async.log(async.concat(hoge, nyan));
//async.run(main);



var getAndLog = (path, time)=>async.series(
    async.wait(time),
    async.bind(async.get(path), async.log)
);

var a = getAndLog("a.txt", 1000);
var b = getAndLog("b.txt",  500);
var c = getAndLog("c.txt",  300);
var d = getAndLog("d.txt", 1000);

async.run(
    async.parallel(a, async.series(b, c)),
    d
);


/*
var hoge = async.get("hoge.txt");
var piyo = async.get("piyo.txt");
async.run(
    async.log(async.strcat(hoge, piyo))
);


async.run(
    async.log("hoge"),    // "hoge" と出力
    async.wait(1000),     // 1秒待機
    async.log("piyo")     // "piyo" と出力
);

*/