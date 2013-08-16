var async;
(function (async) {
    // Functor //
    function fmap(f, x) {
        return function (success, fail) {
            x(function (result) {
                success(f(result));
            }, fail);
        };
    }
    async.fmap = fmap;

    // Applicative //
    function pure(t) {
        return function (success, fail) {
            success(t);
        };
    }
    async.pure = pure;

    function inject(f) {
        return function (success, fail) {
            success(f());
        };
    }
    async.inject = inject;

    function apply(f, x) {
        return function (success, fail) {
            f(function (g) {
                x(function (result) {
                    success(g(result));
                }, fail);
            }, fail);
        };
    }
    async.apply = apply;

    // Monad //
    function bind(x, f) {
        return function (success, fail) {
            x(function (t) {
                f(t)(function (s) {
                    success(s);
                }, fail);
            }, fail);
        };
    }
    async.bind = bind;

    function lift(f) {
        return function () {
            var actions = Array.prototype.slice.call(arguments);
            return function (success, fail) {
                var args = new Array(actions.length);
                var count = 0;
                actions.forEach(function (action, i) {
                    action(function (result) {
                        args[i] = result;
                        count++;
                        if (count == actions.length) {
                            success(f.apply(undefined, args));
                        }
                    }, fail);
                });
            };
        };
    }
    async.lift = lift;

    function seq() {
        var actions = [];
        for (var _i = 0; _i < (arguments.length - 0); _i++) {
            actions[_i] = arguments[_i + 0];
        }
        return function (success, fail) {
            var acs = actions.slice(0);
            var seqResult = null;
            function run() {
                if (acs.length == 0) {
                    success(seqResult);
                } else {
                    acs[0](function (result) {
                        seqResult = result;
                        acs.shift();
                        run();
                    }, fail);
                }
            }
            run();
        };
    }
    async.seq = seq;

    // run actions
    function run() {
        var actions = [];
        for (var _i = 0; _i < (arguments.length - 0); _i++) {
            actions[_i] = arguments[_i + 0];
        }
        seq.apply(undefined, actions)(function () {
        }, function () {
            throw new Error();
        });
    }
    async.run = run;

    // error processing ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    function fail() {
        return function (success, fail) {
            fail();
        };
    }
    async.fail = fail;

    function recover(defaultValue, action) {
        return function (success, fail) {
            action(success, function () {
                success(defaultValue);
            });
        };
    }
    async.recover = recover;

    // control flow ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    function when(action, ifthen, ifelse) {
        return function (success, fail) {
            action(function (result) {
                if (result) {
                    ifthen(success, fail);
                } else if (ifelse) {
                    ifelse(success, fail);
                }
            }, fail);
        };
    }
    async.when = when;

    function repeat(keys, f) {
        keys = keys instanceof Array ? pure(keys) : keys;
        return function (success, fail) {
            keys(function (ks) {
                seq.apply(undefined, ks.map(f))(success, fail);
            }, fail);
        };
    }
    async.repeat = repeat;

    // array operations //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    function array(actions) {
        return function (success, fail) {
            var values = new Array(actions.length);
            var count = 0;
            actions.forEach(function (action, i) {
                action(function (result) {
                    values[i] = result;
                    count++;
                    if (count == actions.length) {
                        success(values);
                    }
                }, fail);
            });
        };
    }
    async.array = array;

    function map(f, action) {
        return function (success, fail) {
            action(function (result) {
                success(result.map(f));
            }, fail);
        };
    }
    async.map = map;

    function foldl(f, s, action) {
        return function (success, fail) {
            action(function (result) {
                for (var i = 0; i < result.length; i++) {
                    s = f(s, result[i]);
                }
                success(s);
            }, fail);
        };
    }
    async.foldl = foldl;

    function and(actions) {
        return function (success, fail) {
            return foldl(function (a, b) {
                return a && b;
            }, true, actions);
        };
    }
    async.and = and;

    function or(actions) {
        return function (success, fail) {
            return foldl(function (a, b) {
                return a || b;
            }, false, actions);
        };
    }
    async.or = or;

    function log(message) {
        message = typeof (message) == "string" ? pure(message) : message;
        return function (success, fail) {
            message(function (result) {
                console.log(result);
                success();
            }, fail);
        };
    }
    async.log = log;

    function wait(milliseconds) {
        milliseconds = typeof (milliseconds) === "number" ? pure(milliseconds) : milliseconds;
        return function (success, fail) {
            milliseconds(function (result) {
                setTimeout(function () {
                    success();
                }, result);
            }, fail);
        };
    }
    async.wait = wait;

    // lifted operators /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    function equals(a, b) {
        return lift(function (xa, xb) {
            return xa == xb;
        })(a, b);
    }
    async.equals = equals;

    function toUpperCase(s) {
        return lift(function (x) {
            return x.toUpperCase();
        })(s);
    }
    async.toUpperCase = toUpperCase;

    function concat(xs, ys) {
        return lift(function (x, y) {
            return x + y;
        })(xs, ys);
    }
    async.concat = concat;

    function join(xs, separator) {
        if (typeof separator === "undefined") { separator = pure(","); }
        return lift(function (x, s) {
            return x.join(s);
        })(xs, separator);
    }
    async.join = join;

    function toString(x) {
        return lift(function (x) {
            return x + "";
        })(x);
    }
    async.toString = toString;

    // ajax /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    (function (ajax) {
        function get(url) {
            url = typeof (url) === "string" ? async.pure(url) : url;
            return function (success, fail) {
                var data = null;
                if (data === null) {
                    url(function (result) {
                        var xhr = new XMLHttpRequest();
                        xhr.onload = function () {
                            data = xhr.responseText;
                            success(data);
                        };
                        xhr.onerror = function () {
                            fail();
                        };
                        xhr.open("GET", result);
                        xhr.send();
                    }, fail);
                } else {
                    success(data);
                }
            };
        }
        ajax.get = get;

        function getImage(url) {
            return function (success, fail) {
                var img = new Image();
                img.src = url;
                img.addEventListener("load", function () {
                    success(img);
                });
                img.addEventListener("error", fail);
            };
        }
        ajax.getImage = getImage;
    })(async.ajax || (async.ajax = {}));
    var ajax = async.ajax;
})(async || (async = {}));
