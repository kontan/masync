/// <reference path="../async.ts" />

//var hoge = async.get("hoge.txt");
//var nyan = async.get(hoge);
//var main = async.log(async.concat(hoge, nyan));
//async.run(main);



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