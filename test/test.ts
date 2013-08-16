/// <reference path="../async.ts" />

import a = async;
import x = async.ajax;

var hoge = x.get("hoge.txt");
var piyo = x.get("piyo.txt");
a.run(
    a.log(a.toUpperCase(hoge)),
    a.bind(hoge, a.log)
    //a.log(a.toString(a.fmap(x=>x.width, x.getImage("yuyu.jpg"))))
);
