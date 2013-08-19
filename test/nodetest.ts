/// <reference path="../masync.ts" />

import m = masync;

var a = m.fs.readFile("a.txt");
var b = m.fs.readFile("b.txt");
m.run(m.log(m.strcat(a, b)));

