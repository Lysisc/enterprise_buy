;
(function (window) {

    var env = {};
    var app = {};

    Object.defineProperty(window, "Env", {
        set: function () {
            throw "Can't overwrite global window.Env variable.";
        },
        get: function () {
            return env;
        }
    });

    Object.defineProperty(window, "app", {
        set: function () {
            throw "Can't overwrite global window.app variable.";
        },
        get: function () {
            return app;
        }
    });

    env.isHybird = (window.__GLOBAL_ENV === "hybird" && location.href.indexOf("hybird=false") < 0 || (/ctripwireless/).test(navigator.userAgent.toLowerCase()));
    env.useHash = !!window.__GLOBAL_USE_HASH;

    app.webViewLoaded = false;
    app.isReady = false;
    app.bridgeCallback = {};
    app._queue = [];

    function run_queue() {

        for (var i = 0, l = app._queue.length; i < l; i++) {
            app._queue[i]();
        }

        app._queue = [];

        app.isReady = true;
        clearTimeout(app.ready.timer);
    }

    function setIsPreProduction(value) {

        env.isPreProduction = value;

    }

    app.log = function (info) {
        if (env.isHybird) {
            app.callBridge("CtripTool", "app_log", info);
        } else if (window.console) {
            console.log(info);
        }
    };

    app.callback = function (res) {

        var tagname = res.tagname;

        switch (tagname) {
        case "web_view_finished_load":
            app.webViewLoaded = true;
            app.callBridge("CtripUtil", "app_init_member_H5_info");

            break;

        case "init_member_H5_info":

            if (res.param) {

                setIsPreProduction(res.param.isPreProduction);

                if (res.param.userInfo) {
                    localStorage.setItem('USERINFO', JSON.stringify(res.param.userInfo));
                } else {
                    localStorage.removeItem('USERINFO');
                }

                localStorage.setItem('MEMBER_H5_INFO_PARAM', JSON.stringify(res.param));
            }

            run_queue();

            break;

        default:
            break;
        }

        if (typeof app.bridgeCallback[tagname] === 'function') {
            return app.bridgeCallback[tagname](res);
        }
    };

    app.callBridge = function (ns, method, args) {

        if (!ns) {
            throw ns + " is undefined.";
        }

        if (typeof window[ns][method] !== "function") {
            throw ns + "." + method + " is not a function.";
        }

        args = args || "";

        if (!env.isHybird) {
            if (ns === "CtripUser" && method === "app_member_login") {
                app.simulateLogin();
            }

            app.log(ns + "." + method + "() called ..." + "With args: " + JSON.stringify(args));
        } else {

            if (Array.isArray(args)) {

                window[ns][method].apply(ns, args);

            } else {

                if (typeof args !== "string") {
                    args = JSON.stringify(args);
                }

                window[ns][method](args);

            }
        }

    };

    app.ready = function (callback, context) {

        var done = {
            state: 200,
            msg: 'App is ready'
        };

        if (app.isReady || !env.isHybird) {
            return callback.call(context, done);
        } else {
            app._queue.push(function () {
                callback.call(context, done);
            });
        }

    };

    if (env.isHybird) {
        app.ready.timer = setTimeout(function () {
            throw "App web_view_finished_load not called in 2000ms";
        }, 2000);
    }

    var checkVersion = window.navigator.userAgent.match(/OS [4-9]{1}/i);
    var osVersion = checkVersion !== null ? checkVersion[0] : 0;
    if (env.isHybird && osVersion === 'OS 7') {
        document.getElementById('wrap').className = 'hybirdIOS7';
    }

})(this);
