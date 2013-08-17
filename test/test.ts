/// <reference path="../async.ts" />

//var hoge = async.get("hoge.txt");
//var nyan = async.get(hoge);
//var main = async.log(async.concat(hoge, nyan));
//async.run(main);


var hoge = async.cache(async.get("hoge.txt", false));
var nyan = async.get(hoge);
var main = async.log(async.concat(hoge, nyan));
async.run(main);