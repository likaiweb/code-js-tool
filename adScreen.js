
    // 1. 屏蔽某个特定的广告js
    var ele;
    if (/\.css[^\.]*$/.test(asset.url)) {
        ele = doc.createElement("link");
        ele.type = "text/" + (asset.type || "css");
        ele.rel = "stylesheet";
        ele.href = asset.url
    } else {
        ele = doc.createElement("script");
        ele.type = "text/" + (asset.type || "javascript");
        ele.src = asset.url
    }
    // 2. 禁用动态添加脚本，防止广告加载
    (function () {
        var createElement = document.createElement;
        document.createElement = function (tag) {
            switch (tag) {
                case 'script':
                    console.log('禁用动态添加脚本，防止广告加载');
                    break;
                default:
                    return createElement.apply(this, arguments);
            }
        }
    })();
    /**
     * 3. 禁用动态添加脚本，防止广告加载
     *
     * @param valid bool? true(屏蔽)|false(不屏蔽)|other(off)
     * @param rule array 配置允许(valid)|不允许(invalid)的脚本规则：支持regex、string、function
     */
    (function (valid, rule) {
        if (typeof Element === 'undefined') console.log('IE8以下浏览器无效');
        var origin = new RegExp('^' + location.origin),
            Ele = Element;
        each(['appendChild', 'insertBefore', 'insertAfter'], proxy);

        function proxy(prop) {
            var proxy_obj = Ele.prototype[prop];
            Ele.prototype[prop] = function (elem) {
                if (!elem.children.length) {
                    var tag = elem.tagName.toLowerCase();
                    if (tag == 'script' && isBanScript(elem)) {
                        console.log('禁用脚本：' + elem.src);
                        var substitute = document.createElement('script');
                        substitute.innerHTML = '// 禁用脚本：' + elem.src;
                        elem = substitute;
                    }
                }
                return proxy_obj.apply(this, arguments);
            };
        }

        function isBanScript(script) {
            if (origin.test(script.src)) return false;
            return valid === each(rule, match);

            function match(val) {
                var type = typeof val;
                if (type === 'string') {
                    if (script.src == val) return true;
                } else if (type === 'function') {
                    if (val(script)) return true;
                } else {
                    if (val.test(script.src)) return true;
                }
                return false;
            }
        }

        function each(arr, fn) {
            if (arr) {
                for (var i = 0, n = arr.length; i < n; i++) {
                    if (fn.call(arr[i], arr[i], i) === true) return false;
                }
            }
            return true;
        }
    })(true, []); // 防止其他页面恶意嵌入 // 除了当前域名，其他域名都不可以访问 
    try {
        top.location.hostname;
        if (top.location.hostname !=
            window.location.hostname) {
            top.location.href = window.location.href;
        }
    } catch (e) {
        top.location.href = window.location.href;
    }