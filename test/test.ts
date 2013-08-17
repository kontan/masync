/// <reference path="../async.ts" />

//var hoge = async.get("hoge.txt");
//var nyan = async.get(hoge);
//var main = async.log(async.concat(hoge, nyan));
//async.run(main);



var hoge = async.get("hoge.txt");
var piyo = async.get("piyo.txt");
async.run(
    async.log(hoge),
    async.log(async.toString(async.lift(Math.abs)(async.pure(-20))))
    //async.eject(hoge, function(data){ console.log(data); })
);


