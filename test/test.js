/// <reference path="../async.ts" />
var a = async;
var x = async.ajax;

var hoge = x.get("hoge.txt");
var piyo = x.get("piyo.txt");
a.run(a.log(a.toUpperCase(hoge)), a.bind(hoge, a.log));
