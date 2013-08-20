//
//
//
//                               masync
//
//                           version 0.1.0
//
//             site: https://github.com/kontan/masync/
//
//
//
//
//                      The MIT License (MIT)
//
//             Copyright (c) 2013- Kon (http://phyzkit.net/)
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.
var masync;
(function (masync) {
    // Functor //
    function fmap(f, x) {
        return ap(pure(f), x);
    }
    masync.fmap = fmap;

    // Applicative //
    function pure(t) {
        return function (succ, fail) {
            return succ(t);
        };
    }
    masync.pure = pure;

    function ap(f, x) {
        return function (succ, fail) {
            var _f;
            var _x;
            function fin() {
                if (typeof _f !== "undefined" && typeof _x !== "undefined") {
                    succ(_f(_x));
                }
            }
            f(function (g) {
                _f = g;
                fin();
            }, fail);
            x(function (r) {
                _x = r;
                fin();
            }, fail);
        };
    }
    masync.ap = ap;

    // Monad //
    function bind(x, f) {
        return function (succ, fail) {
            x(function (t) {
                return f(t)(succ, fail);
            }, fail);
        };
    }
    masync.bind = bind;

    function lift(f) {
        return function () {
            var args = Array.prototype.slice.call(arguments);
            return function (succ, fail) {
                amap(args)(function (_args) {
                    return succ(f.apply(undefined, _args));
                }, fail);
            };
        };
    }
    masync.lift = lift;

    function liftAsync(f) {
        return function () {
            var args = Array.prototype.slice.call(arguments);
            return function (succ, fail) {
                amap(args)(function (_args) {
                    f.apply(undefined, _args)(succ, fail);
                }, fail);
            };
        };
    }
    masync.liftAsync = liftAsync;

    function series() {
        var xs = [];
        for (var _i = 0; _i < (arguments.length - 0); _i++) {
            xs[_i] = arguments[_i + 0];
        }
        xs = xs.slice(0);
        return function (succ, fail) {
            var _xs = xs.slice(0);
            var r = null;
            function run() {
                _xs.length == 0 ? succ(r) : _xs[0](function (_r) {
                    r = _r;
                    _xs.shift();
                    run();
                }, fail);
            }
            run();
        };
    }
    masync.series = series;

    function parallel() {
        var xs = [];
        for (var _i = 0; _i < (arguments.length - 0); _i++) {
            xs[_i] = arguments[_i + 0];
        }
        var args = xs.slice(0);
        return function (succ, fail) {
            amap(args)(function (_args) {
                return succ();
            }, fail);
        };
    }
    masync.parallel = parallel;

    function run() {
        var xs = [];
        for (var _i = 0; _i < (arguments.length - 0); _i++) {
            xs[_i] = arguments[_i + 0];
        }
        series.apply(undefined, xs)(function () {
        }, function () {
            throw new Error();
        });
    }
    masync.run = run;

    // Utils //
    // (>>)
    function next(a, b) {
        return bind(a, function () {
            return b;
        });
    }
    masync.next = next;

    function _pure_(x) {
        switch (typeof x) {
            case "string":
            case "number":
            case "boolean":
            case "object":
            case "undefined":
                return pure(x);
            default:
                return x;
        }
    }

    // inject and eject //
    function inject(f) {
        return function (succ, fail) {
            succ(f());
        };
    }
    masync.inject = inject;

    function eject(x, f) {
        return function (succ, fail) {
            x(function (result) {
                f(result);
                succ();
            }, fail);
        };
    }
    masync.eject = eject;

    // error handling ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    function fail() {
        return function (succ, fail) {
            fail();
        };
    }
    masync.fail = fail;

    function recover(defaultValue, xs) {
        defaultValue = _pure_(defaultValue);
        return function (succ, fail) {
            xs(succ, function () {
                defaultValue(function (_def) {
                    return succ(_def);
                }, fail);
            });
        };
    }
    masync.recover = recover;

    function capture(xs, callback) {
        return function (succ, fail) {
            xs(succ, function () {
                succ(callback());
            });
        };
    }
    masync.capture = capture;

    // control flow ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    masync.nop = pure(undefined);

    function cache(xs) {
        var value = undefined;
        var succeed = undefined;
        var listener = [];
        return function (succ, fail) {
            if (typeof succeed === "undefined") {
                if (listener.length == 0) {
                    xs(function (v) {
                        value = v;
                        succeed = true;
                        listener.forEach(function (listener) {
                            return listener.succ(v);
                        });
                    }, function () {
                        succeed = false;
                        listener.forEach(function (listener) {
                            return listener.fail();
                        });
                    });
                }
                listener.push({ succ: succ, fail: fail });
            } else if (succeed) {
                succ(value);
            } else {
                fail();
            }
        };
    }
    masync.cache = cache;

    function fastest() {
        var xs = [];
        for (var _i = 0; _i < (arguments.length - 0); _i++) {
            xs[_i] = arguments[_i + 0];
        }
        return function (succ, fail) {
            var active = true;
            function _succ(result) {
                if (active) {
                    active = false;
                    succ(result);
                }
            }
            function _fail() {
                if (active) {
                    active = false;
                    fail();
                }
            }
            xs.forEach(function (x) {
                return x(_succ, _fail);
            });
        };
    }
    masync.fastest = fastest;

    function when(x, ifthen, ifelse) {
        return function (succ, fail) {
            x(function (result) {
                if (result) {
                    ifthen(succ, fail);
                } else if (ifelse) {
                    ifelse(succ, fail);
                }
            }, fail);
        };
    }
    masync.when = when;

    function repeat(keys, f) {
        keys = keys instanceof Array ? pure(keys) : keys;
        return function (succ, fail) {
            keys(function (ks) {
                series.apply(undefined, ks.map(f))(succ, fail);
            }, fail);
        };
    }
    masync.repeat = repeat;

    function wait(milliseconds) {
        milliseconds = typeof (milliseconds) === "number" ? pure(milliseconds) : milliseconds;
        return function (succ, fail) {
            milliseconds(function (result) {
                window.setTimeout(function () {
                    succ();
                }, result);
            }, fail);
        };
    }
    masync.wait = wait;

    function setTimeout(a, milliseconds) {
        milliseconds = typeof (milliseconds) === "number" ? pure(milliseconds) : milliseconds;
        return function (succ, fail) {
            milliseconds(function (t) {
                succ(window.setTimeout(function () {
                    run(a);
                }, t));
            }, fail);
        };
    }
    masync.setTimeout = setTimeout;

    function clearTimeout(timerId) {
        timerId = typeof (timerId) === "number" ? pure(timerId) : timerId;
        return function (succ, fail) {
            timerId(function (t) {
                window.clearTimeout(t);
                succ();
            }, fail);
        };
    }
    masync.clearTimeout = clearTimeout;

    function setInterval(a, milliseconds) {
        milliseconds = typeof (milliseconds) === "number" ? pure(milliseconds) : milliseconds;
        return function (succ, fail) {
            milliseconds(function (t) {
                succ(window.setInterval(function () {
                    run(a);
                }, t));
            }, fail);
        };
    }
    masync.setInterval = setInterval;

    function clearInterval(timerId) {
        timerId = typeof (timerId) === "number" ? pure(timerId) : timerId;
        return function (succ, fail) {
            timerId(function (t) {
                window.clearInterval(t);
                succ();
            }, fail);
        };
    }
    masync.clearInterval = clearInterval;

    function requestAnimationFrame(a) {
        return function (succ, fail) {
            succ(window.requestAnimationFrame(function () {
                run(a);
            }));
        };
    }
    masync.requestAnimationFrame = requestAnimationFrame;

    function cancelAnimationFrame(timerId) {
        timerId = typeof (timerId) === "number" ? pure(timerId) : timerId;
        return function (succ, fail) {
            timerId(function (t) {
                window.cancelAnimationFrame(t);
                succ();
            }, fail);
        };
    }
    masync.cancelAnimationFrame = cancelAnimationFrame;

    function log(message) {
        return fmap(console.log.bind(console), _pure_(message));
    }
    masync.log = log;

    // (==)
    function equals(a, b) {
        return lift(function (xa, xb) {
            return xa == xb;
        })(a, b);
    }
    masync.equals = equals;

    function notEquals(a, b) {
        return lift(function (xa, xb) {
            return xa != xb;
        })(a, b);
    }
    masync.notEquals = notEquals;

    // boolean //
    function not(x) {
        return lift(function (y) {
            return !y;
        })(x);
    }
    masync.not = not;

    // number //
    function max() {
        var xs = [];
        for (var _i = 0; _i < (arguments.length - 0); _i++) {
            xs[_i] = arguments[_i + 0];
        }
        return lift(function (ys) {
            return Math.max.apply(undefined, ys);
        })(amap(xs));
    }
    masync.max = max;

    function min() {
        var xs = [];
        for (var _i = 0; _i < (arguments.length - 0); _i++) {
            xs[_i] = arguments[_i + 0];
        }
        return lift(function (ys) {
            return Math.min.apply(undefined, ys);
        })(amap(xs));
    }
    masync.min = min;

    function abs(x) {
        return lift(Math.abs)(x);
    }
    masync.abs = abs;

    // string //
    function toString(x) {
        return lift(function (x) {
            return x + "";
        })(x);
    }
    masync.toString = toString;

    function toUpperCase(s) {
        return lift(function (x) {
            return x.toUpperCase();
        })(s);
    }
    masync.toUpperCase = toUpperCase;

    function strcat() {
        var xs = [];
        for (var _i = 0; _i < (arguments.length - 0); _i++) {
            xs[_i] = arguments[_i + 0];
        }
        return lift(function (ys) {
            return ys.join("");
        })(amap(xs));
    }
    masync.strcat = strcat;

    // array //
    function amap(xs) {
        return function (succ, fail) {
            var values = new Array(xs.length);
            var count = 0;
            xs.forEach(function (x, i) {
                x(function (result) {
                    values[i] = result;
                    count++;
                    if (count == xs.length) {
                        succ(values);
                    }
                }, fail);
            });
        };
    }
    masync.amap = amap;

    function array() {
        var xs = [];
        for (var _i = 0; _i < (arguments.length - 0); _i++) {
            xs[_i] = arguments[_i + 0];
        }
        return amap(xs);
    }
    masync.array = array;

    function length(xs) {
        return fmap(function (xs) {
            return xs.length;
        }, xs);
    }
    masync.length = length;

    function at(i, xs) {
        i = typeof i === "number" ? pure(i) : i;
        return lift(function (i, xs) {
            return xs[i];
        })(i, xs);
    }
    masync.at = at;

    function putAt(i, x, xs) {
        i = typeof i === "number" ? pure(i) : i;
        return lift(function (i, x, xs) {
            xs[i] = x;
        })(i, x, xs);
    }
    masync.putAt = putAt;

    function concat() {
        var xs = [];
        for (var _i = 0; _i < (arguments.length - 0); _i++) {
            xs[_i] = arguments[_i + 0];
        }
        return lift(function (ys) {
            return [].concat(ys);
        })(amap(xs));
    }
    masync.concat = concat;

    function join(xs, separator) {
        if (typeof separator === "undefined") { separator = pure(","); }
        return lift(function (x, s) {
            return x.join(s);
        })(xs, separator);
    }
    masync.join = join;

    function map(f, xs) {
        function _map(f, xs) {
            return xs.map(f);
        }
        return lift(_map)(f, xs);
    }
    masync.map = map;

    function foldl(f, x, xs) {
        function _foldl(f, s, array) {
            for (var i = 0; i < array.length; i++) {
                s = f(s, array[i]);
            }
            return s;
        }
        return lift(_foldl)(f, x, xs);
    }
    masync.foldl = foldl;

    function and(xs) {
        return function (succ, fail) {
            return foldl(pure(function (a, b) {
                return a && b;
            }), pure(true), xs);
        };
    }
    masync.and = and;

    function or(xs) {
        return function (succ, fail) {
            return foldl(pure(function (a, b) {
                return a || b;
            }), pure(false), xs);
        };
    }
    masync.or = or;

    function get(url, chached) {
        if (typeof chached === "undefined") { chached = true; }
        url = typeof (url) === "string" ? pure(url) : url;
        return function (succ, fail) {
            url(function (result) {
                var xhr = new XMLHttpRequest();
                xhr.onload = function () {
                    succ(xhr.responseText);
                };
                xhr.onerror = function () {
                    fail();
                };
                xhr.open("GET", result);
                if (!chached) {
                    xhr.setRequestHeader('Pragma', 'no-cache');
                    xhr.setRequestHeader('Cache-Control', 'no-cache');
                    xhr.setRequestHeader('If-Modified-Since', 'Thu, 01 Jun 1970 00:00:00 GMT');
                }
                xhr.send();
            }, fail);
        };
    }
    masync.get = get;

    function getImage(url) {
        return function (succ, fail) {
            var img = new Image();
            img.src = url;
            img.addEventListener("load", function () {
                succ(img);
            });
            img.addEventListener("error", fail);
        };
    }
    masync.getImage = getImage;

    // generators integration ///////////////////////////////////////////////////////////////////////////////
    function generate(generator, a) {
        var value;
        a(function (t) {
            setTimeout(function () {
                try  {
                    generator.send(t);
                } catch (e) {
                    if (!(e instanceof StopIteration))
                        throw e;
                }
            }, 0);
        }, function () {
            throw new Error();
        });
        return function () {
            return value;
        };
    }
    masync.generate = generate;

    // jquery integration ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    function resolve(promise) {
        return function (succ, fail) {
            jQuery.when(promise).then(function (t) {
                return succ(t);
            }).fail(fail);
        };
    }
    masync.resolve = resolve;

    function promise(async) {
        return new jQuery.Deferred(function (def) {
            async(function (t) {
                return def.resolve(t);
            }, function () {
                return def.reject();
            });
        }).promise();
    }
    masync.promise = promise;

    function worker(scriptPath, arg) {
        function _fork(scriptPath, _arg) {
            return function (succ, fail) {
                var worker = new Worker(scriptPath);
                worker.onmessage = function (e) {
                    succ(e.data);
                };
                worker.postMessage(_arg);
            };
        }
        return liftAsync(_fork)(_pure_(scriptPath), _pure_(arg));
    }
    masync.worker = worker;

    function wrap(f) {
        return function () {
            var args = Array.prototype.slice.call(arguments);
            return function (succ, fail) {
                amap(args)(function (_args) {
                    _args.push(function (err, data) {
                        return err ? fail() : succ(data);
                    });
                    f.apply(undefined, _args);
                }, fail);
            };
        };
    }
    masync.wrap = wrap;

    (function (fs) {
        function readFile(fileName, options) {
            var fs = require("fs");
            return masync.wrap(fs.readFile.bind(fs))(_pure_(fileName), masync.pure(options));
        }
        fs.readFile = readFile;
    })(masync.fs || (masync.fs = {}));
    var fs = masync.fs;
})(masync || (masync = {}));

var jQuery;
(function (jQuery) {
})(jQuery || (jQuery = {}));
