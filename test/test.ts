/// <reference path="../async.ts" />

//var hoge = async.get("hoge.txt");
//var nyan = async.get(hoge);
//var main = async.log(async.concat(hoge, nyan));
//async.run(main);



var hoge = async.get("hoge.txt");
//var nyan = async.get(hoge);
//var main = async.log(async.strcat(hoge, nyan));
async.run(
    //main,
    //async.setInterval(async.log(hoge), 1000),
    async.eject(hoge, function(data){ console.log(data); })
);


