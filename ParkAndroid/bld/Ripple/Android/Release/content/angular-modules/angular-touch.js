﻿/*
 AngularJS v1.3.17
 (c) 2010-2014 Google, Inc. http://angularjs.org
 License: MIT
*/
(function (y, s, z) {
    'use strict'; function t(f, k, p) { n.directive(f, ["$parse", "$swipe", function (d, e) { return function (l, m, g) { function h(a) { if (!b) return !1; var c = Math.abs(a.y - b.y); a = (a.x - b.x) * k; return q && 75 > c && 0 < a && 30 < a && .3 > c / a } var c = d(g[f]), b, q, a = ["touch"]; s.isDefined(g.ngSwipeDisableMouse) || a.push("mouse"); e.bind(m, { start: function (a, c) { b = a; q = !0 }, cancel: function (a) { q = !1 }, end: function (a, b) { h(a) && l.$apply(function () { m.triggerHandler(p); c(l, { $event: b }) }) } }, a) } }]) } var n = s.module("ngTouch", []); n.factory("$swipe",
    [function () {
        function f(d) { d = d.originalEvent || d; var e = d.touches && d.touches.length ? d.touches : [d]; d = d.changedTouches && d.changedTouches[0] || e[0]; return { x: d.clientX, y: d.clientY } } function k(d, e) { var l = []; s.forEach(d, function (d) { (d = p[d][e]) && l.push(d) }); return l.join(" ") } var p = { mouse: { start: "mousedown", move: "mousemove", end: "mouseup" }, touch: { start: "touchstart", move: "touchmove", end: "touchend", cancel: "touchcancel" } }; return {
            bind: function (d, e, l) {
                var m, g, h, c, b = !1; l = l || ["mouse", "touch"]; d.on(k(l, "start"), function (a) {
                    h =
                    f(a); b = !0; g = m = 0; c = h; e.start && e.start(h, a)
                }); var q = k(l, "cancel"); if (q) d.on(q, function (a) { b = !1; e.cancel && e.cancel(a) }); d.on(k(l, "move"), function (a) { if (b && h) { var d = f(a); m += Math.abs(d.x - c.x); g += Math.abs(d.y - c.y); c = d; 10 > m && 10 > g || (g > m ? (b = !1, e.cancel && e.cancel(a)) : (a.preventDefault(), e.move && e.move(d, a))) } }); d.on(k(l, "end"), function (a) { b && (b = !1, e.end && e.end(f(a), a)) })
            }
        }
    }]); n.config(["$provide", function (f) { f.decorator("ngClickDirective", ["$delegate", function (k) { k.shift(); return k }]) }]); n.directive("ngClick",
    ["$parse", "$timeout", "$rootElement", function (f, k, p) {
        function d(c, b, d) { for (var a = 0; a < c.length; a += 2) { var e = c[a + 1], g = d; if (25 > Math.abs(c[a] - b) && 25 > Math.abs(e - g)) return c.splice(a, a + 2), !0 } return !1 } function e(c) {
            if (!(2500 < Date.now() - m)) {
                var b = c.touches && c.touches.length ? c.touches : [c], e = b[0].clientX, b = b[0].clientY; if (!(1 > e && 1 > b || h && h[0] === e && h[1] === b)) {
                    h && (h = null); var a = c.target; "label" === s.lowercase(a.nodeName || a[0] && a[0].nodeName) && (h = [e, b]); d(g, e, b) || (c.stopPropagation(), c.preventDefault(), c.target &&
                    c.target.blur && c.target.blur())
                }
            }
        } function l(c) { c = c.touches && c.touches.length ? c.touches : [c]; var b = c[0].clientX, d = c[0].clientY; g.push(b, d); k(function () { for (var a = 0; a < g.length; a += 2) if (g[a] == b && g[a + 1] == d) { g.splice(a, a + 2); break } }, 2500, !1) } var m, g, h; return function (c, b, h) {
            function a() { n = !1; b.removeClass("ng-click-active") } var k = f(h.ngClick), n = !1, r, t, v, w; b.on("touchstart", function (a) {
                n = !0; r = a.target ? a.target : a.srcElement; 3 == r.nodeType && (r = r.parentNode); b.addClass("ng-click-active"); t = Date.now(); a = a.originalEvent ||
                a; a = (a.touches && a.touches.length ? a.touches : [a])[0]; v = a.clientX; w = a.clientY
            }); b.on("touchmove", function (b) { a() }); b.on("touchcancel", function (b) { a() }); b.on("touchend", function (c) {
                var k = Date.now() - t, f = c.originalEvent || c, u = (f.changedTouches && f.changedTouches.length ? f.changedTouches : f.touches && f.touches.length ? f.touches : [f])[0], f = u.clientX, u = u.clientY, x = Math.sqrt(Math.pow(f - v, 2) + Math.pow(u - w, 2)); n && 750 > k && 12 > x && (g || (p[0].addEventListener("click", e, !0), p[0].addEventListener("touchstart", l, !0), g = []), m = Date.now(),
                d(g, f, u), r && r.blur(), s.isDefined(h.disabled) && !1 !== h.disabled || b.triggerHandler("click", [c])); a()
            }); b.onclick = function (a) { }; b.on("click", function (a, b) { c.$apply(function () { k(c, { $event: b || a }) }) }); b.on("mousedown", function (a) { b.addClass("ng-click-active") }); b.on("mousemove mouseup", function (a) { b.removeClass("ng-click-active") })
        }
    }]); t("ngSwipeLeft", -1, "swipeleft"); t("ngSwipeRight", 1, "swiperight")
})(window, window.angular);