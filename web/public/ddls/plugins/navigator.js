(function anonymous() {
    function Za() {
        var b;
        u = f.get("scene").getArray();
        for (b = 0; b < u.length; b++) {
            var d = b,
                h = "<content>" + u[d].content + "</content>";
            if (window.DOMParser) var e = (new DOMParser).parseFromString(h, "text/xml");
            else e = new ActiveXObject("Microsoft.XMLDOM"), e.async = !1, e.loadXML(h);
            h = e.getElementsByTagName("view")[0];
            var C = null,
                k = null,
                t = null;
            "undefined" !== typeof h && (C = h.getAttribute("hlookat"), k = h.getAttribute("vlookat"), t = h.getAttribute("fov"));
            u[d].view = {
                hlookat: C,
                vlookat: k,
                fov: t
            };
            e = e.getElementsByTagName("image")[0];
            h = e.getElementsByTagName("depthmap")[0];
            C = null;
            t = k = !1;
            "undefined" !== typeof e && (C = e.getAttribute("style"));
            "undefined" !== typeof h && (h.getAttribute("url") && h.getAttribute("enabled"), k = h.getAttribute("url"), t = h.getAttribute("enabled"));
            u[d].depthmap = {
                style: C,
                depthmap: k && t
            }
        }
        for (b = 0; b < u.length; b++) u[b].click = !1, 0 == u[b].depthmap.depthmap && (V = !1);
        V = !0;
        if (!V)
            for (b = f.get("style").getArray(), i = 0; i < b.length; i++) - 1 < b[i].name.indexOf("everpano3d_") && (b[i].ox = 0, b[i].oy = 0, b[i].oz = 0);
        W = a.leftkey;
        X = a.rightkey;
        Y = a.forwardkey;
        Z = a.backwardkey;
        qa = a.upkey;
        ra = a.downkey;
        J = a.angletolerance;
        P = a.hotspotvisibility;
        aa = a.notfoundmove;
        Q = a.notfoundtime;
        B = a.navigationmode;
        K = a.navigationclick;
        L = a.navigationspeed;
        ba = a.walkingspeed;
        ca = a.walkingfriction;
        da = a.walkratiochange;
        ea = a.walktransition;
        fa = a.loadsceneflags;
        ha = a.loadscenevars;
        ia = a.loadsceneblend;
        D = a.loadsceneblendtime;
        F = a.modereturn;
        R = a.returnaction;
        ja = a.returnvraction;
        ka = a.returnnotfoundaction;
        la = a.returnnotfoundvraction;
        S = a.depthmapuse;
        M = a.hapticfeedback;
        Ma = a.editmode;
        N = a.floorspots;
        sa = a.floortooltip;
        ta = a.floorstylesize;
        ua = a.floorstyleborder;
        va = a.floorstylealpha;
        wa = a.floorstylebordercolor;
        xa = a.floorstylecirclecolor;
        Na = {
            tooltip: sa,
            size: ta,
            border: ua,
            alpha: va,
            borderColor: wa,
            circleColor: xa
        }
    }

    function Oa() {
        var b;
        G = [];
        if ("undefined" !== typeof O)
            if ("scene" == P) G = t[O].visiblePanos;
            else if ("model" == P)
            for (b = 0; b < Ca.length; b++) Ca[b] != T && G.push(Ca[b])
    }

    function Pa() {
        f.set("walkaround.forward", 0);
        f.set("walkaround.backward", 0);
        f.set("walkaround.left", 0);
        f.set("walkaround.right", 0);
        f.set("walkaround.up",
            0);
        f.set("walkaround.down", 0);
        f.set("walkaround.faster", 0);
        f.set("walkaround.strafe", 0);
        var b = 0,
            d = [
                [0, 0],
                [0, 0]
            ],
            h = f.get("walkaround"),
            e = 0,
            a = 0,
            k = 0;
        Qa = !0;
        f.depthmap_movemode = "walking";
        f.actions.renderloop(function() {
            var C = ba,
                g = ca;
            e *= g;
            a *= g;
            k *= g;
            b *= g;
            .001 > e * e + a * a + k * k && (e = a = k = 0);
            .01 > b * b && (b = 0);
            var p = f.view.hlookat * Math.PI / 180,
                n = f.view.vlookat * Math.PI / 180;
            g = Math.sin(p);
            p = Math.cos(p);
            var l = Math.cos(n),
                r = g * l;
            n = Math.sin(n);
            l *= p;
            var y = h.right - h.left,
                q = h.forward - h.backward,
                E = h.up - h.down,
                c = f.webvr ? f.webvr.vrcontroller :
                null;
            if (c)
                for (var z = c.length, x = 0; x < z; x++) {
                    var v = c[x],
                        w = v.axes;
                    if (w) {
                        var m = f.display.havedepthmap || f.display.depthbuffer ? 1 : 0;
                        2 == z && "right" == v.hand && (m = 0);
                        var u = 1.3,
                            A = !1;
                        "Daydream Controller" == v.id || "Oculus Go Controller" == v.id ? A = !0 : "OpenVR Gamepad" == v.id && (A = !0, u *= -1);
                        A ? 0 != w[0] && 0 != w[1] && (v = +(w[0] - d[x][0]), u *= -(w[1] - d[x][1]), d[x][0] = w[0], d[x][1] = w[1], .3 < Math.abs(v) && (v = 0), .3 < Math.abs(u) && (u = 0), 0 == m ? b += 1.5 * v : (e += 5 * (v * p + u * g), k += 5 * (-v * g + u * p))) : 0 == m ? .2 < Math.abs(w[0]) && (b = 1 * w[0]) : (.2 < Math.abs(w[0]) && (y +=
                            1 * w[0]), .2 < Math.abs(w[1]) && (q -= 1 * w[1]))
                    }
                }
            c = Math.sqrt(y * y + q * q);
            0 < c && (c = C / c, 0 < h.faster && (c *= 3), y *= c, q *= c, y && (e += y * p, k -= y * g), q && ("flying" == f.depthmap_movemode ? (e += q * r, k += q * l, a += q * n) : (e += q * g, k += q * p)));
            E && (a -= .5 * C * E);
            f.view.tx += e;
            f.view.ty += a;
            f.view.tz += k;
            if (U) {
                g = 1E32;
                p = null;
                r = {
                    x: f.view.tx,
                    y: f.view.tz
                };
                n = ya({
                    x: I.x,
                    y: I.z
                }, r, 2);
                if (!Da(G))
                    for (C = 0; C < G.length; C++)
                        if (l = H(t, G[C], "panoId"), "undefined" !== typeof l && (y = ya({
                                id: G[C],
                                x: t[l].x,
                                y: t[l].z
                            }, r, 2), y < g)) {
                            g = y;
                            p = G[C];
                            var B = t[l].panoName
                        } null != p && g * da < n && (F ? f.call(R +
                    "(" + B + "," + g.toFixed(2) + ");") : ea ? ma(B, g / L) : (C = Ea(B, T), ma(B, null, C.view)))
            }
            0 != b && (f.webvr.hlookatoffset += b)
        })
    }

    function na(b) {
        b = void 0 === b ? "forward" : b;
        var d = f.get("view.hlookat") % 360;
        f.get("view.vlookat");
        var h = {};
        "left" == b ? (h.x = d - 90, h.y = 0) : "right" == b ? (h.x = d + 90, h.y = 0) : "forward" == b ? (h.x = d, h.y = 0) : "backward" == b ? (h.x = d - 180, h.y = 0) : b.x && b.y && (h.x = b.x % 360, h.y = b.y);
        Ra(h)
    }

    function Ra(b, d) {
        d = void 0 === d ? !1 : d;
        var h = 1E32,
            e = null;
        if (Array.isArray(d)) {
            var a = d[0];
            var k = d[1]
        }
        d = {
            x: I.x,
            y: I.z
        };
        var m = Sa(b.x, 0);
        m.x += d.x;
        m.y +=
            d.y;
        var g, p = 0,
            n = null;
        if (Da(t)) var l = void 0;
        else {
            var r = {
                x: I.x,
                y: I.z
            };
            for (g = 0; g < t.length; g++)
                if (t[g].panoId != T) {
                    var y = ya(r, {
                        x: t[g].x,
                        y: t[g].z
                    }, 2);
                    if (y > p) {
                        p = y;
                        n = g;
                        l = t[g].panoId;
                        var q = t[g].panoName
                    }
                } l = null != n ? {
                id: l,
                name: q,
                x: t[n].x,
                y: t[n].z
            } : !1
        }
        a: {
            l = ya(d, l, 2);p = g = q = null;n = 90;r = J / 2;y = (null != l) + (null != q) + (null != g);
            var E = (null != p) + (null != n) + (null != r);
            if (3 != y + E) throw "Give exactly 3 pieces of information";
            if (0 == y) throw "Give at least one side length";
            if (3 == y) {
                y = "Side side side (SSS) case";
                if (l + q <= g || q + g <= l ||
                    g + l <= q) {
                    var c = !1;
                    break a
                }
                p = oa(q, g, l);
                n = oa(g, l, q);
                r = oa(l, q, g);
                c = (l + q + g) / 2;
                var z = Math.sqrt(c * (c - l) * (c - q) * (c - g))
            } else if (2 == E) {
                y = "Angle side angle (ASA) case";
                null == p && (p = 180 - n - r);
                null == n && (n = 180 - r - p);
                null == r && (r = 180 - p - n);
                if (0 >= p || 0 >= n || 0 >= r) throw y + " - No solution";
                var x = Math.sin(A(p));
                var v = Math.sin(A(n)),
                    w = Math.sin(A(r));
                null != l && (c = l / x, z = l * c * v * w / 2);
                null != q && (c = q / v, z = q * c * w * x / 2);
                null != g && (c = g / w, z = g * c * x * v / 2);
                null == l && (l = c * x);
                null == q && (q = c * v);
                null == g && (g = c * w)
            } else if (null != p && null == l || null != n && null ==
                q || null != r && null == g) {
                y = "Side angle side (SAS) case";
                if (null != p && 180 <= p || null != n && 180 <= n || null != r && 180 <= r) throw y + " - No solution";
                null == l && (l = Fa(q, g, p));
                null == q && (q = Fa(g, l, n));
                null == g && (g = Fa(l, q, r));
                null == p && (p = oa(q, g, l));
                null == n && (n = oa(g, l, q));
                null == r && (r = oa(l, q, g));
                null != p && (z = q * g * Math.sin(A(p)) / 2);
                null != n && (z = g * l * Math.sin(A(n)) / 2);
                null != r && (z = l * q * Math.sin(A(r)) / 2)
            } else {
                y = "Side side angle (SSA) case - ";
                null != l && null != p && (x = l, w = p);
                null != q && null != n && (x = q, w = n);
                null != g && null != r && (x = g, w = r);
                null != l &&
                    null == p && (v = l);
                null != q && null == n && (v = q);
                null != g && null == r && (v = g);
                if (180 <= w) throw y + "No solution";
                c = x / Math.sin(A(w));
                z = v / c;
                if (1 < z || 90 <= w && x <= v) throw y + "No solution";
                if (1 == z || x >= v) {
                    y += "Unique solution";
                    E = Math.asin(z) / Math.PI * 180;
                    var u = 180 - w - E;
                    c *= Math.sin(A(u));
                    z = x * v * Math.sin(A(u)) / 2
                } else {
                    y += "Two solutions";
                    E = Math.asin(z) / Math.PI * 180;
                    u = 180 - E;
                    z = 180 - w - E;
                    w = 180 - w - u;
                    var B = c * Math.sin(A(z));
                    c *= Math.sin(A(w));
                    E = [E, u];
                    u = [z, w];
                    c = [B, c];
                    z = [x * v * Math.sin(A(z)) / 2, x * v * Math.sin(A(w)) / 2]
                }
                null != l && null == p && (p = E);
                null != q &&
                    null == n && (n = E);
                null != g && null == r && (r = E);
                null == l && null == p && (l = c, p = u);
                null == q && null == n && (q = c, n = u);
                null == g && null == r && (g = c, r = u)
            }
            c = [l, q, g, p, n, r, z, y]
        }
        c = Ga(d, m, c[1] + 20, 2);
        m = Ha(d, c, J / 2 * -1);
        x = Ha(d, c, J / 2);
        Oa();
        if (!Da(G))
            for (c = 0; c < G.length; c++)
                if (v = H(t, G[c], "panoId"), "undefined" !== typeof v && (z = {
                        id: G[c],
                        x: t[v].x,
                        y: t[v].z
                    }, q = z.x - x.x, g = z.y - x.y, p = x.x - m.x, n = m.y - x.y, l = n * (d.x - x.x) + p * (d.y - x.y), p = n * q + p * g, q = (x.y - d.y) * q + (d.x - x.x) * g, 0 > l ? 0 >= p && 0 >= q && p + q >= l : 0 <= p && 0 <= q && p + q <= l))
                    if (z = ya(d, z, 2), z < h) {
                        h = z;
                        e = t[v].panoId;
                        var D = t[v].panoName
                    } if (null !=
            e) F || a || (S ? ma(D, h / L) : (b = Ea(D, T), ma(D, null, b.view))), !F && a && (M && f.webvr.isenabled && f.call("hotspot[" + k + "].pulse(0.5,1)"), ma(D, h / L)), F && !a && (null != R ? f.call(R + "(" + D + "," + h.toFixed(2) + ");") : f.trace(3, "warning, you need to set a return action")), F && a && (null != ja ? f.call(ja + "(" + D + "," + h.toFixed(2) + ");") : f.trace(3, "warning, you need to set a return vr action"));
        else {
            F || a || Ta(b, !N);
            !F && a && (Ta(b, !N), void 0 !== k && (M && f.webvr.isenabled && f.call("hotspot[" + k + "].pulse(0.5,1)"), M && f.webvr.isenabled && f.call("hotspot[" +
                k + "].pulse(0.5,1)")));
            if (F && !a)
                if (null != ka) {
                    k = Ia(b);
                    if (null == k) return;
                    f.call(ka + "(" + k.x0.toFixed(2) + "|" + k.y0.toFixed(2) + "|" + k.x1.toFixed(2) + "|" + k.y1.toFixed(2) + ");")
                } else f.trace(3, "warning, you need to set a not found return action");
            F && a && (null != la ? (a = Ia(b), null != a && f.call(la + "(" + a.x0.toFixed(2) + "|" + a.y0.toFixed(2) + "|" + a.x1.toFixed(2) + "|" + a.y1.toFixed(2) + ");")) : f.trace(3, "warning, you need to set a not found return vr action"))
        }
    }

    function Ta(b, d) {
        d = void 0 === d ? !0 : d;
        b = Ia(b);
        null != b && d && f.call("tween(view.tx|view.tz," +
            b.x1 + "|" + b.y1 + "," + Q + ", default,tween(view.tx|view.tz," + b.x0 + "|" + b.y0 + "," + Q + ", default));")
    }

    function Ia(b) {
        if (V)
            if ("undefined" !== typeof I.x) var d = {
                x: I.x,
                y: I.z
            };
            else return null;
        else d = {
            x: 0,
            y: 0
        };
        b = Sa(b.x, 0);
        V && (b.x += d.x, b.y += d.y);
        b = Ga(d, b, aa, 2);
        return {
            x0: d.x,
            y0: d.y,
            x1: b.x,
            y1: b.y
        }
    }

    function Sa(b, d) {
        b = b * Math.PI / 180;
        d = d * Math.PI / 180;
        var h = {};
        h.x = Math.cos(d) * Math.sin(b);
        h.y = Math.cos(d) * Math.cos(b);
        h.z = Math.sin(d);
        return h
    }

    function Ua(b) {
        var d = {};
        d.x = 180 * Math.atan2(b.x, b.y) / Math.PI;
        d.y = 180 * Math.atan2(b.z,
            Math.sqrt(b.x * b.x + b.y * b.y)) / Math.PI;
        return d
    }

    function Ha(b, d, h) {
        var e = Math.PI / 180 * h;
        h = Math.cos(e);
        e = Math.sin(e);
        var a = {};
        a.x = h * (d.x - b.x) + e * (d.y - b.y) + b.x;
        a.y = h * (d.y - b.y) - e * (d.x - b.x) + b.y;
        return a
    }

    function Ga(b, d, a, e) {
        var h = {};
        h.x = b.x + a * (d.x - b.x);
        h.y = b.y + a * (d.y - b.y);
        null != b.z && null != d.z && 3 == (void 0 === e ? 3 : e) && (h.z = b.z + a * (d.z - b.z));
        return h
    }

    function ya(b, d, a) {
        var e = b.x - d.x;
        var h = b.y - d.y;
        null != b.z && null != d.z && 3 == (void 0 === a ? 3 : a) ? (b = b.z - d.z, e = Math.sqrt(e * e + h * h + b * b)) : e = Math.sqrt(e * e + h * h);
        return e
    }

    function Va(b,
        d) {
        var a = H(f.navPlugPan, b, "id"),
            e = H(f.navPlugMod, f.navPlugPan[a].modelI, "id");
        b = H(f.navPlugMod[e].absolutePos, b, "id");
        if ("undefined" !== typeof e && "undefined" !== typeof a) return a = Ha(f.navPlugMod[e].absolutePos[b].rotatationPoint, d, -1 * f.navPlugMod[e].absolutePos[b].rotation), a.x -= f.navPlugMod[e].absolutePos[b].translation.x, a.y -= f.navPlugMod[e].absolutePos[b].translation.y, a.z = d.z, d = Ua(a), a.h = d.x, a.v = d.y, a
    }

    function Fa(b, d, a) {
        a = A(a);
        return .001 < a ? Math.sqrt(b * b + d * d - 2 * b * d * Math.cos(a)) : Math.sqrt((b - d) * (b -
            d) + b * d * a * a * (1 - a * a / 12))
    }

    function oa(b, d, a) {
        var e = (b * b + d * d - a * a) / (2 * b * d);
        return -1 <= e && .9999999 >= e ? Math.acos(e) / Math.PI * 180 : 1 >= e ? Math.sqrt((a * a - (b - d) * (b - d)) / (b * d)) / Math.PI * 180 : "No solution"
    }

    function A(b) {
        return b / 180 * Math.PI
    }

    function H(b, d, a) {
        a = "undefined" === typeof a ? "name" : a;
        for (var e = 0; e < b.length; e++)
            if (b[e][a] == d) return e
    }

    function Da(b) {
        return "undefined" !== typeof b && 0 < b.length ? !1 : !0
    }

    function ma(b, d, a) {
        a = void 0 === a ? null : a;
        V && S ? $a(b, void 0 === d ? 2 : d, !0) : Wa(b, a, !1)
    }

    function $a(b, d, a) {
        d = void 0 === d ? 1 : d;
        a =
            void 0 === a ? !0 : a;
        U = !1;
        if (!Ja) {
            var e = H(t, b, "panoName");
            Ja = !0;
            f.get("events").onblendcomplete = function() {
                Ja = !1
            };
            f.call("loadscene(" + b + "," + ha + "," + fa + "," + ia + "(0.8));");
            a && f.call("stoptween(view.tx|view.ty|view.tz);set(events.onkeydown,null);");
            b = t[e].x;
            e = t[e].z;
            a && f.call("tween(view.tx|view.tz," + b + "|" + e + "," + 1.5 + ", easeinoutquad, set(events.onkeydown,null); );");
            setTimeout(function() {
                U = !0
            }, 10)
        }
    }

    function Wa(b, d, a) {
        d = void 0 === d ? null : d;
        a = void 0 === a ? !0 : a;
        U = !1;
        var e = H(t, b, "panoName");
        var h = "null" ==
            D ? .5 : D;
        f.call("loadscene(" + b + "," + ha + "," + fa + "," + ia + "(0.2));");
        b = t[e].x;
        var k = t[e].z;
        e = t[e].y;
        a && (f.call("set(view.tx=" + b + ");"), f.call("set(view.ty=" + e + ");"), f.call("set(view.tz=" + k + ");"));
        null != d && (e = a = 0, b = 120, "object" === typeof d ? (d.hlookat && (a = d.hlookat), d.vlookat && (e = d.vlookat), d.fov && (b = d.fov)) : "string" === typeof d && (a = Number(d)), f.call("lookat(" + a + "," + e + "," + b + ")"));
        setTimeout(function() {
            U = !0
        }, 10)
    }

    function Xa() {
        var b = f.get("xml.scene");
        b = void 0 === b ? null : b;
        Ka = null == b ? f.get("xml.scene") : b;
        O = H(t,
            Ka, "panoName");
        b = H(u, Ka.toLowerCase(), "name");
        za = u[b].type;
        Aa = u[b].click;
        "undefined" !== typeof O && (T = t[O].panoId, I = {
            x: t[O].x,
            y: t[O].y,
            z: t[O].z
        });
        Oa();
        "walking" == B && "model3d" != za && Aa && U && Pa();
        if (N)
            for (b = 0; b < G.length; b++) {
                var d = Ea(G[b], T),
                    h = d.destination,
                    e = d.position;
                d = d.view;
                var m = Na;
                d = void 0 === d ? null : d;
                null == d && (d.hlookat = 0);
                if (null == f.get("hotspot[nav_" + h + "]")) {
                    f.addhotspot("nav_" + h);
                    var k = f.get("hotspot[nav_" + h + "]");
                    k.keep = !1;
                    k.type = "text";
                    k.scale = .5;
                    k.rx = -90;
                    k.enabled = !0;
                    k.distorted = !0;
                    k.zorder =
                        5;
                    k.background = !0;
                    k.renderer = "css3d";
                    k.bgcolor = m.circleColor;
                    k.bgborder = m.border + " " + m.borderColor + " " + m.alpha;
                    k.bgalpha = m.alpha;
                    k.width = m.size;
                    k.height = m.size;
                    k.bgroundedge = k.width;
                    k.edge = "center";
                    k.depth = 0;
                    k.tx = e.x + m.border;
                    k.ty = e.z;
                    k.tz = e.y - m.border;
                    k.ath = 0;
                    k.atv = 0;
                    k.torigin = "image";
                    k.onclick = "plugin[" + a.name + "].callloadscene(" + h + ",null," + d.hlookat + ")";
                    f.addhotspot("nav_hint_" + h);
                    k = f.get("hotspot[nav_hint_" + h + "]");
                    k.keep = !1;
                    k.type = "text";
                    k.scale = .5;
                    k.enabled = !0;
                    k.distorted = !1;
                    k.zorder = 40;
                    k.background = !0;
                    k.renderer = "css3d";
                    k.bgcolor = "0xfafafa";
                    k.bgalpha = 0;
                    k.edge = "center";
                    k.width = m.size + 10;
                    k.height = m.size + 10;
                    k.ath = e.h;
                    k.atv = e.v;
                    k.onclick = "plugin[" + a.name + "].callloadscene(" + h + ",null," + d.hlookat + ")";
                    m.tooltip && (e = H(u, h, "index"), k.onloaded = "plugin[" + a.name + "].sethotspotattributes(" + h + "," + u[e].title + ")")
                }
            }
    }

    function ab() {
        var b = f.events.createItem(a.name + "_events");
        b.keep = a.keep;
        b.onclick = function() {
            if (K && "model3d" != za && Aa) {
                var b = f.screentosphere(f.mouse.stagex, f.mouse.stagey);
                na(b)
            }
        };
        b.onloadcomplete =
            function() {
                Xa()
            };
        b.onkeyup = function() {
            var b = f.get("keycode");
            "walking" == B && (Ya(b, 0), f.set("walkaround.up", 0), f.set("walkaround.down", 0))
        };
        b.onkeydown = function() {
            var b = f.get("keycode");
            "jumping" == B && K && "model3d" != za && Aa && (b == W && na("left"), b == X && na("right"), b == Y && na("forward"), b == Z && na("backward"));
            "walking" == B && K && "model3d" != za && Aa && Ya(b, 1)
        }
    }

    function Ya(b, a) {
        U = !0;
        Pa();
        b == Y && f.set("walkaround.forward", a);
        b == Z && f.set("walkaround.backward", a);
        b == W && f.set("walkaround.left", a);
        b == X && f.set("walkaround.right",
            a);
        b == qa && f.set("walkaround.up", 1);
        b == ra && f.set("walkaround.down", 1)
    }

    function bb(b) {
        b = void 0 === b ? "vr_controller_r" : b;
        var a = f.get("hotspot[" + b + "]");
        null != a ? (a = Ua({
            x: a.dx,
            y: a.dz,
            z: a.dy
        }), Ra(a, [!0, b])) : f.trace(3, "warning, controller not found")
    }

    function Ea(b, a) {
        a = void 0 === a ? null : a;
        null == a && (a = T);
        var d = H(f.navPlugMod[MODELINDEX].absolutePos, b, "id"),
            e = {
                x: f.navPlugMod[MODELINDEX].absolutePos[d].x,
                y: f.navPlugMod[MODELINDEX].absolutePos[d].y,
                z: f.navPlugMod[MODELINDEX].absolutePos[d].z
            },
            m = Va(a, e);
        a = H(f.navPlugMod[MODELINDEX].absolutePos,
            a, "id");
        e = Ga({
            x: f.navPlugMod[MODELINDEX].absolutePos[a].x,
            y: f.navPlugMod[MODELINDEX].absolutePos[a].y
        }, e, 1.02, 2);
        b = Va(b, e);
        return {
            destination: f.navPlugMod[MODELINDEX].absolutePos[d].id,
            position: {
                h: m.h,
                v: m.v,
                x: m.x,
                y: m.y,
                z: m.z
            },
            view: {
                hlookat: b.h,
                vlookat: 0,
                fov: 120
            }
        }
    }

    function cb(b, a) {
        var d = f.get("hotspot[nav_hint_" + b + "]");
        d.sprite.setAttribute("id", "hotspot_hint_" + b);
        d.sprite.setAttribute("class", " hint--top hint--rounded ");
        d.sprite.setAttribute("aria-label", a)
    }

    function La(b) {
        var a = document.createElement("style");
        a.innerHTML = b;
        document.body.appendChild(a)
    }

    function db() {
        function b(a, b) {
            var e = document.createElement("div");
            e.style.position = "relative";
            e.style.marginBottom = "5px";
            e.style.height = "25px";
            var c = document.createElement("span");
            c.id = "checkTitle" + b;
            c.name = "checkTitle" + b;
            c.innerHTML = a.html;
            c.style.top = "10px";
            c.style.marginLeft = "0px";
            c.style.marginRight = "5px";
            c.style.marginBottom = "5px";
            c.style.height = "25px";
            c.style.borderRadius = "5px";
            c.style.background = "rgba(0,0,0,.5)";
            c.style.padding = "5px";
            c.style.width =
                "200px";
            c.style.color = "#fafafa";
            c.style.fontSize = "small";
            c.style.zIndex = "1";
            c.style.pointerEvents = "none";
            e.appendChild(c);
            c = document.createElement("input");
            c.type = "checkbox";
            c.checked = a.checked;
            c.setting = a.setting;
            c.id = "check" + g;
            c.className += " select";
            c.setAttribute("spanid", "i" + b);
            c.onchange = function() {
                f.set(this.setting, this.checked)
            };
            e.appendChild(c);
            r.appendChild(e)
        }

        function d(a, b) {
            var e = document.createElement("div");
            e.style.position = "relative";
            var c = document.createElement("span");
            c.name = "no" +
                b;
            c.innerHTML = a.html;
            c.style.top = "10px";
            c.style.textAlign = "center";
            c.style.marginLeft = "3px";
            c.style.marginRight = "5px";
            c.style.marginTop = "1px";
            c.style.marginBottom = "5px";
            c.style.width = "25px";
            c.style.height = "25px";
            c.style.borderRadius = "5px";
            c.style.background = "rgba(0,0,0,.5)";
            c.style.padding = "5px";
            c.style.color = "#fafafa";
            c.style.fontSize = "small";
            c.style.zIndex = "1";
            c.style.pointerEvents = "none";
            e.appendChild(c);
            a = document.createElement("input");
            a.type = "radio";
            a.style.left = "100px";
            a.style.width = "25px";
            a.style.border = "none";
            a.style.color = "#fafafa";
            a.className += " text";
            a.id = "radio" + g;
            a.setAttribute("spanid", "i" + b);
            a.oninput = function() {
                var a = document.getElementById(this.getAttribute("spanid"));
                f.set(this.setting, this.value);
                a.innerHTML = this.value
            };
            e.appendChild(a);
            r.appendChild(e)
        }

        function h(a, b) {
            var e = document.createElement("div");
            e.style.position = "relative";
            var c = document.createElement("span");
            c.name = "no" + b;
            c.innerHTML = a.html;
            c.style.top = "10px";
            c.style.textAlign = "center";
            c.style.marginLeft = "3px";
            c.style.marginRight = "5px";
            c.style.marginTop = "1px";
            c.style.marginBottom = "5px";
            c.style.width = "25px";
            c.style.height = "25px";
            c.style.borderRadius = "5px";
            c.style.background = "rgba(0,0,0,.5)";
            c.style.padding = "5px";
            c.style.color = "#fafafa";
            c.style.fontSize = "small";
            c.style.zIndex = "1";
            c.style.pointerEvents = "none";
            e.appendChild(c);
            c = document.createElement("input");
            c.type = "text";
            c.style.left = "100px";
            c.style.width = "25px";
            c.style.border = "none";
            c.style.color = "#fafafa";
            c.className += " text";
            c.name = a.id;
            c.value = a.value;
            c.setting = a.setting;
            c.id = "slider" + g;
            c.setAttribute("spanid", "i" + b);
            c.oninput = function() {
                var a = document.getElementById(this.getAttribute("spanid"));
                f.set(this.setting, this.value);
                a.innerHTML = this.value
            };
            e.appendChild(c);
            r.appendChild(e)
        }

        function e(a, b) {
            var e = document.createElement("div");
            e.style.position = "relative";
            var c = document.createElement("input");
            c.type = "number";
            c.name = a.id;
            null != a.min && (c.min = a.min);
            null != a.max && (c.max = a.max);
            c.value = a.value;
            c.setting = a.setting;
            c.id = "slider" + g;
            c.setAttribute("spanid",
                "i" + b);
            c.oninput = function() {
                var a = document.getElementById(this.getAttribute("spanid"));
                f.set(this.setting, this.value);
                a.innerHTML = this.value
            };
            e.appendChild(c);
            c = document.createElement("span");
            c.name = "no" + b;
            c.innerHTML = a.html;
            c.style.position = "absolute";
            c.style.top = "7px";
            c.style.left = "10px";
            c.style.color = "white";
            c.style.fontSize = "small";
            c.style.zIndex = "1";
            c.style.pointerEvents = "none";
            e.appendChild(c);
            r.appendChild(e)
        }

        function t(a, b) {
            var e = document.createElement("div");
            e.style.position = "relative";
            var c =
                document.createElement("input");
            c.type = "range";
            c.name = a.id;
            1 == a.decimals && (c.step = .01);
            c.min = a.min;
            c.max = a.max;
            c.value = a.value;
            c.setting = a.setting;
            c.className += " slider";
            c.id = "slider" + b;
            c.setAttribute("spanid", "sliderValue" + b);
            c.oninput = function() {
                var a = document.getElementById(this.getAttribute("spanid"));
                f.set(this.setting, this.value);
                a.innerHTML = this.value
            };
            e.appendChild(c);
            c = document.createElement("span");
            c.name = "no" + b;
            c.innerHTML = a.html;
            c.style.position = "absolute";
            c.style.top = "7px";
            c.style.left =
                "10px";
            c.style.color = "white";
            c.style.fontSize = "small";
            c.style.zIndex = "1";
            c.style.pointerEvents = "none";
            e.appendChild(c);
            c = document.createElement("span");
            c.name = "o" + b;
            c.style.position = "absolute";
            c.style.top = "7px";
            c.style.right = "10px";
            c.style.color = "white";
            c.style.fontSize = "small";
            c.style.zIndex = "1";
            c.style.pointerEvents = "none";
            c.id = "sliderValue" + b;
            c.innerHTML = a.value;
            e.appendChild(c);
            r.appendChild(e)
        }

        function k(a, b) {
            var e = document.createElement("div");
            e.style.position = "relative";
            e.style.marginBottom =
                "5px";
            e.style.height = "25px";
            var c = document.createElement("span");
            c.name = "listTitle" + b;
            c.innerHTML = a.html;
            c.style.top = "10px";
            c.style.marginLeft = "0px";
            c.style.marginRight = "5px";
            c.style.marginBottom = "5px";
            c.style.height = "25px";
            c.style.borderRadius = "5px";
            c.style.background = "rgba(0,0,0,.5)";
            c.style.padding = "5px";
            c.style.width = "200px";
            c.style.color = "#fafafa";
            c.style.fontSize = "small";
            c.style.zIndex = "1";
            c.style.pointerEvents = "none";
            e.appendChild(c);
            c = document.createElement("select");
            c.id = "select" + b;
            c.style.left =
                "100px";
            c.style.border = "none";
            c.className += " select";
            c.setting = a.setting;
            c.onchange = function(a) {
                f.set(a.target.setting, a.target.value)
            };
            e.appendChild(c);
            r.appendChild(e);
            for (p = 0; p < a.values.length; p++) b = document.createElement("option"), b.value = a.values[p], b.text = a.values[p], c.appendChild(b)
        }

        function u(a, b) {
            var e = document.createElement("div");
            e.style.position = "relative";
            var c = document.createElement("button");
            c.innerHTML = a.html;
            c.action = a.action;
            c.style.display = "block";
            c.style.cursor = "pointer";
            c.style.marginBottom =
                "5px";
            c.setAttribute("buttonId", "i" + b);
            c.addEventListener("click", function() {
                this.action()
            });
            e.appendChild(c);
            r.appendChild(e)
        }
        var g, p;
        m = [{
            id: "angletolerance",
            type: "range",
            html: "angle tolerance",
            min: 1,
            max: 179,
            value: J,
            default: 60,
            setting: "plugin[" + a.name + "].angletolerance",
            decimals: 0
        }, {
            id: "hotspotvisibility",
            html: "hotspots visibility",
            type: "list",
            values: ["scene", "model"],
            setting: "plugin[" + a.name + "].hotspotvisibility",
            value: P,
            default: "scene"
        }, {
            id: "notfoundmove",
            type: "range",
            html: "not found move",
            min: 1,
            max: 100,
            value: aa,
            default: 10,
            setting: "plugin[" + a.name + "].notfoundmove",
            decimals: 0
        }, {
            id: "notfoundtime",
            type: "range",
            html: "not found time",
            min: 0,
            max: 5,
            value: Q,
            default: .3,
            setting: "plugin[" + a.name + "].notfoundtime",
            decimals: 1
        }, {
            id: "navigationmode",
            html: "navigation mode",
            type: "list",
            values: ["jumping", "walking"],
            setting: "plugin[" + a.name + "].navigationmode",
            value: B,
            default: "jumping"
        }, {
            id: "navigationspeed",
            type: "range",
            html: "navigation speed",
            min: 0,
            max: 500,
            value: L,
            default: 300,
            setting: "plugin[" + a.name + "].navigationspeed",
            decimals: 0
        }, {
            id: "loadsceneblendtime",
            type: "range",
            html: "load scene blend time",
            min: 0,
            max: 5,
            value: D,
            default: .2,
            setting: "plugin[" + a.name + "].loadsceneblendtime",
            decimals: 1
        }, {
            id: "navigationclick",
            type: "check",
            html: "navigation click",
            checked: K,
            default: !0,
            setting: "plugin[" + a.name + "].navigationclick"
        }, {
            id: "walkingspeed",
            type: "range",
            html: "walking speed",
            min: 0,
            max: 1,
            value: ba,
            default: .1,
            setting: "plugin[" + a.name + "].walkingspeed",
            decimals: 1
        }, {
            id: "walkingfriction",
            type: "range",
            html: "walking friction",
            min: 0,
            max: 1,
            value: ca,
            default: .9,
            setting: "plugin[" + a.name + "].walkingfriction",
            decimals: 1
        }, {
            id: "walkratiochange",
            type: "range",
            html: "walk ratio change",
            min: 0,
            max: 1,
            value: da,
            default: .8,
            setting: "plugin[" + a.name + "].walkratiochange",
            decimals: 1
        }, {
            id: "walktransition",
            type: "check",
            html: "walk transition",
            checked: ea,
            default: !0,
            setting: "plugin[" + a.name + "].walktransition"
        }, {
            id: "modereturn",
            type: "check",
            html: "mode return",
            checked: F,
            default: !1,
            setting: "plugin[" + a.name + "].modereturn"
        }, {
            id: "depthmapuse",
            type: "check",
            html: "depthmap use",
            checked: S,
            default: !0,
            setting: "plugin[" + a.name + "].depthmapuse"
        }, {
            id: "hapticfeedback",
            type: "check",
            html: "haptic feedback",
            checked: M,
            default: !0,
            setting: "plugin[" + a.name + "].hapticfeedback"
        }, {
            id: "floorspots",
            type: "check",
            html: "floorHotspots",
            checked: N,
            default: !1,
            setting: "plugin[" + a.name + "].floorspots"
        }, {
            id: "resetVars",
            type: "button",
            html: "Reset default",
            action: function() {
                var b;
                for (b = 0; b < pa.length; b++) f.set("plugin[" + a.name + "]." + pa[b].name, pa[b].value);
                for (b = 0; b < m.length; b++) switch (m[b].type) {
                    case "range":
                        var e =
                            m[b].default,
                            d = b;
                        document.getElementById("slider" + d).value = e;
                        document.getElementById("sliderValue" + d).innerHTML = e;
                        break;
                    case "list":
                        e = m[b].values.indexOf(m[b].default);
                        document.getElementById("select" + b).selectedIndex = e;
                        break;
                    case "checkbox":
                        setCheckbox(m[b].checked, b);
                        break;
                    case "string":
                        setString(m[b], b);
                        break;
                    case "number":
                        setNumber(m[b], b);
                        break;
                    case "text":
                        setText(m[b], b);
                        break;
                    case "radio":
                        setRadio(m[b], b);
                        break;
                    case "check":
                        e = m[b], document.getElementById("check" + b).checked = e
                }
            }
        }, {
            id: "copyVars",
            type: "button",
            html: "Copy to clipboard",
            action: function() {
                var b, e = '<plugin name="navigator" keep="true" devices="html5" url="' + a.url + '" ';
                for (b = 0; b < pa.length; b++) e += pa[b].name + '="' + f.get("plugin[" + a.name + "]." + pa[b].name) + '" ';
                e += "/>";
                b = document.createElement("input");
                document.body.appendChild(b);
                b.setAttribute("id", "dummy_id");
                document.getElementById("dummy_id").value = e;
                b.select();
                document.execCommand("copy");
                document.body.removeChild(b)
            }
        }];
        var n = document.createElement("button");
        n.className += " collapsible";
        n.style.borderRadius = "5px";
        n.style.background = "rgba(0,0,0,.5)";
        n.style.width = "220px";
        n.style.height = "30px";
        n.style.marginLeft = "10px";
        n.style.marginTop = "10px";
        n.style.position = "relative";
        n.style.color = "#fafafa";
        n.style.fontSize = "small";
        var l = document.createElement("span");
        l.innerHTML = "ATTRIBUTES";
        l.style.position = "absolute";
        l.style.top = "7px";
        l.style.left = "10px";
        l.style.color = "white";
        l.style.fontSize = "small";
        l.style.zIndex = "1";
        l.style.pointerEvents = "none";
        n.appendChild(l);
        n.addEventListener("click",
            function() {
                this.classList.toggle("active");
                var b = this.nextElementSibling;
                b.style.maxHeight = b.style.maxHeight ? null : b.scrollHeight + "px"
            });
        var r = document.createElement("div");
        r.style.marginLeft = "-8px";
        r.style.marginTop = "18px";
        r.id = "editor";
        r.style.position = "relative";
        r.style.width = "220px";
        r.style.height = "700px";
        r.className += " content";
        for (g = 0; g < m.length; g++) switch (m[g].type) {
            case "range":
                t(m[g], g);
                break;
            case "list":
                k(m[g], g);
                break;
            case "checkbox":
                setCheckbox(m[g], g);
                break;
            case "string":
                setString(m[g],
                    g);
                break;
            case "button":
                u(m[g], g);
                break;
            case "number":
                e(m[g], g);
                break;
            case "text":
                h(m[g], g);
                break;
            case "radio":
                d(m[g], g);
                break;
            case "check":
                b(m[g], g)
        }
        a.sprite.appendChild(n);
        a.sprite.appendChild(r);
        eb()
    }

    function eb() {
        for (var b = 0; b < m.length; b++)
            if ("list" == m[b].type) {
                var a = m[b].values.indexOf(m[b].value);
                document.getElementById("select" + b).selectedIndex = a
            }
    }

    function fb() {
        var b;
        for (b = 0; b < f.navPlugPan.length; b++) {
            var a = f.navPlugPan[b];
            a = {
                panoId: a[0][0],
                panoName: a[0][1].toLowerCase(),
                visiblePanos: a[1],
                x: a[2][0],
                y: a[2][1],
                z: a[2][2]
            };
            t.push(a);
            Ca.push(a.panoId);
            a = H(u, a.panoName.toLowerCase(), "name");
            "undefined" !== typeof a && (u[a].click = !0)
        }
    }
    var Ba = this;
    Ba.name = "navigator";
    Ba.version = "1.3.0";
    var f = null,
        a = null;
    Ba.registerplugin = function(b, d, h) {
        f = b;
        a = h;
        "1.20" > f.version || "2019-06-03" > f.build ? f.trace(3, Ba.name + " - too old krpano version (min. 1.20)") : (a.jump = na, a.makevrclick = bb, a.loadscene = Wa, a.callloadscene = ma, a.sethotspotattributes = cb, a.registerattribute("leftkey", "65", function(a) {
                a != W && (W = a)
            }, function() {
                return W
            }),
            a.registerattribute("rightkey", "68", function(a) {
                a != X && (X = a)
            }, function() {
                return X
            }), a.registerattribute("forwardkey", "87", function(a) {
                a != Y && (Y = a)
            }, function() {
                return Y
            }), a.registerattribute("backwardkey", "83", function(a) {
                a != Z && (Z = a)
            }, function() {
                return Z
            }), a.registerattribute("upkey", "81", function(a) {
                a != qa && (qa = a)
            }, function() {
                return qa
            }), a.registerattribute("downkey", "69", function(a) {
                a != ra && (ra = a)
            }, function() {
                return ra
            }), a.registerattribute("angletolerance", 60, function(a) {
                a != J && (J = a)
            }, function() {
                return J
            }),
            a.registerattribute("hotspotvisibility", "scene", function(a) {
                a != P && (P = a)
            }, function() {
                return P
            }), a.registerattribute("notfoundmove", 10, function(a) {
                a != aa && (aa = a)
            }, function() {
                return aa
            }), a.registerattribute("notfoundtime", .3, function(a) {
                a != Q && (Q = a)
            }, function() {
                return Q
            }), a.registerattribute("navigationmode", "jumping", function(a) {
                a != B && (B = a);
                if ("walking" == B && !Qa) {
                    a = f.view.hlookat;
                    var b = f.view.vlookat,
                        e = f.view.fov;
                    f.call("loadscene(" + f.get("xml.scene") + ", null, MERGE, BLEND(1.0));");
                    f.call("lookat(" + a +
                        "," + b + "," + e + ")")
                }
            }, function() {
                return B
            }), a.registerattribute("navigationclick", !0, function(a) {
                a != K && (K = a)
            }, function() {
                return K
            }), a.registerattribute("navigationspeed", 100, function(a) {
                a != L && (L = a)
            }, function() {
                return L
            }), a.registerattribute("walkingspeed", .1, function(a) {
                a != ba && (ba = a)
            }, function() {
                return ba
            }), a.registerattribute("walkingfriction", .9, function(a) {
                a != ca && (ca = a)
            }, function() {
                return ca
            }), a.registerattribute("walkratiochange", .8, function(a) {
                a != da && (da = a)
            }, function() {
                return da
            }), a.registerattribute("walktransition",
                !0,
                function(a) {
                    a != ea && (ea = a)
                },
                function() {
                    return ea
                }), a.registerattribute("loadsceneflags", "MERGE|KEEPVIEW|KEEPMOVING", function(a) {
                a != fa && (fa = a)
            }, function() {
                return fa
            }), a.registerattribute("loadscenevars", null, function(a) {
                a != ha && (ha = a)
            }, function() {
                return ha
            }), a.registerattribute("loadsceneblend", "BLEND", function(a) {
                a != ia && (ia = a)
            }, function() {
                return ia
            }), a.registerattribute("loadsceneblendtime", null, function(a) {
                a != D && (D = a)
            }, function() {
                return D
            }), a.registerattribute("modereturn", !1, function(a) {
                a != F &&
                    (F = a)
            }, function() {
                return F
            }), a.registerattribute("returnaction", null, function(a) {
                a != R && (R = a)
            }, function() {
                return R
            }), a.registerattribute("returnvraction", null, function(a) {
                a != ja && (ja = a)
            }, function() {
                return ja
            }), a.registerattribute("returnnotfoundaction", null, function(a) {
                a != ka && (ka = a)
            }, function() {
                return ka
            }), a.registerattribute("returnnotfoundvraction", null, function(a) {
                a != la && (la = a)
            }, function() {
                return la
            }), a.registerattribute("depthmapuse", !0, function(a) {
                a != S && (S = a)
            }, function() {
                return S
            }), a.registerattribute("hapticfeedback",
                !0,
                function(a) {
                    a != M && (M = a)
                },
                function() {
                    return M
                }), a.registerattribute("editmode", !0), a.registerattribute("floorspots", !1, function(a) {
                a != N && (N = a)
            }, function() {
                return N
            }), a.registerattribute("floortooltip", !1, function(a) {
                a != sa && (sa = a)
            }, function() {
                return sa
            }), a.registerattribute("floorstylesize", 20, function(a) {
                a != ta && (ta = a)
            }, function() {
                return ta
            }), a.registerattribute("floorstyleborder", 3, function(a) {
                a != ua && (ua = a)
            }, function() {
                return ua
            }), a.registerattribute("floorstylealpha", .6, function(a) {
                a != va && (va =
                    a)
            }, function() {
                return va
            }), a.registerattribute("floorstylebordercolor", "0x000000", function(a) {
                a != wa && (wa = a)
            }, function() {
                return wa
            }), a.registerattribute("floorstylecirclecolor", "0xfafafa", function(a) {
                a != xa && (xa = a)
            }, function() {
                return xa
            }), a.mode = "pro", Za(), fb(), Xa(), ab(), Ma && db())
    };
    Ba.unloadplugin = function() {
        f = a = null
    };
    var t = [],
        Ca = [],
        G = [],
        Ka, T, O, I, za, Aa, W, X, Y, Z, qa, ra, J, P, aa, Q, B, K, L, ba, ca, da, ea, fa, ha, ia, D, F, R, ja, ka, la, S, M, Ma, N, Na, sa, ta, ua, va, wa, xa, u, V = !0,
        U, Qa = !1,
        m, Ja;
    La(".slidecontainer,.slider{width:100%}.slider{-webkit-appearance:none;height:25px;background:#000;outline:0;opacity:.5;-webkit-transition:.2s;transition:opacity .2s;border-radius:5px;z-index:10}.text{-webkit-appearance:none;height:25px;background:#000;outline:0;-webkit-transition:.2s;transition:opacity .2s;border-radius:5px;z-index:10;margin-top:5px;height:25px;padding:0 10px;font-size:small;color:#fff;background:rgba(0,0,0,.5)}.slider::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;width:10px;height:25px;background:#44a9dd;cursor:pointer}.slider::-moz-range-thumb{width:25px;height:25px;background:#44a9dd;cursor:pointer}input[type=number]::-webkit-inner-spin-button{opacity:1}input[type=range i]{margin:0!important}button,select{margin-top:0px;height:25px;padding:0 10px;font-size:small;color:#fff;background:rgba(0,0,0,.5)}button{line-height:20px;outline:0;border:none;border-radius:5px}button:hover{background:rgba(0,0,0,.6)}select::-ms-expand{display:none}#ex1Slider .slider-selection{background:#bababa}");
    La('.collapsible{background-color:#777;color:#fff;cursor:pointer;padding:6px;width:100%;border:none;text-align:left;outline:0;font-size:15px}.active,.collapsible:hover{background-color:#555}.collapsible:after{content:"\u2193";color:#fff;font-weight:700;float:right;margin-left:5px}.active:after{content:"\u2191"}.content{padding:0 18px;max-height:0;overflow:hidden;transition:max-height .2s ease-out}');
    var pa = [{
            name: "leftkey",
            value: "65"
        }, {
            name: "rightkey",
            value: "68"
        }, {
            name: "forwardkey",
            value: "87"
        }, {
            name: "backwardkey",
            value: "83"
        }, {
            name: "upkey",
            value: "81"
        }, {
            name: "downkey",
            value: "69"
        }, {
            name: "angletolerance",
            value: 60
        }, {
            name: "hotspotvisibility",
            value: "scene"
        }, {
            name: "notfoundmove",
            value: 10
        }, {
            name: "notfoundtime",
            value: .3
        }, {
            name: "navigationmode",
            value: "jumping"
        }, {
            name: "navigationclick",
            value: !0
        }, {
            name: "navigationspeed",
            value: 100
        }, {
            name: "walkingspeed",
            value: .1
        }, {
            name: "walkingfriction",
            value: .9
        }, {
            name: "walkratiochange",
            value: .8
        }, {
            name: "walktransition",
            value: !0
        }, {
            name: "loadsceneflags",
            value: "MERGE|KEEPVIEW|KEEPMOVING"
        },
        {
            name: "loadscenevars",
            value: null
        }, {
            name: "loadsceneblend",
            value: "BLEND"
        }, {
            name: "loadsceneblendtime",
            value: null
        }, {
            name: "modereturn",
            value: !1
        }, {
            name: "returnaction",
            value: null
        }, {
            name: "depthmapuse",
            value: !0
        }, {
            name: "hapticfeedback",
            value: !1
        }, {
            name: "editmode",
            value: !0
        }
    ];
    La("[class*=hint--]{position:relative;display:inline-block}[class*=hint--]:after,[class*=hint--]:before{position:absolute;-webkit-transform:translate3d(0,0,0);-moz-transform:translate3d(0,0,0);transform:translate3d(0,0,0);visibility:hidden;opacity:0;z-index:1000000;pointer-events:none;-webkit-transition:.3s ease;-moz-transition:.3s ease;transition:.3s ease;-webkit-transition-delay:0s;-moz-transition-delay:0s;transition-delay:0s}[class*=hint--]:hover:after,[class*=hint--]:hover:before{visibility:visible;opacity:1;-webkit-transition-delay:.1s;-moz-transition-delay:.1s;transition-delay:.1s}[class*=hint--]:before{content:'';position:absolute;background:0 0;border:6px solid transparent;z-index:1000001}[class*=hint--]:after{background:#000000;color:#fff;padding:8px 10px;font-size:12px;font-family:Helvetica Neue,Helvetica,Arial,sans-serif; -webkit-font-smoothing: antialiased;line-height:12px;white-space:nowrap;text-shadow:0 -1px 0 #000;box-shadow:4px 4px 8px rgba(0,0,0,.3)}[class*=hint--][aria-label]:after{content:attr(aria-label)}[class*=hint--][data-hint]:after{content:attr(data-hint)}[aria-label='']:after,[aria-label='']:before,[data-hint='']:after,[data-hint='']:before{display:none!important}.hint--top-left:before,.hint--top-right:before,.hint--top:before{border-top-color:#000000}.hint--bottom-left:before,.hint--bottom-right:before,.hint--bottom:before{border-bottom-color:#000000}.hint--top:after,.hint--top:before{bottom:100%;left:50%}.hint--top:before{margin-bottom:-11px;left:calc(50% - 6px)}.hint--top:after{-webkit-transform:translateX(-50%);-moz-transform:translateX(-50%);transform:translateX(-50%)}.hint--top:hover:before{-webkit-transform:translateY(-8px);-moz-transform:translateY(-8px);transform:translateY(-8px)}.hint--top:hover:after{-webkit-transform:translateX(-50%) translateY(-8px);-moz-transform:translateX(-50%) translateY(-8px);transform:translateX(-50%) translateY(-8px)}.hint--bottom:after,.hint--bottom:before{top:100%;left:50%}.hint--bottom:before{margin-top:-11px;left:calc(50% - 6px)}.hint--bottom:after{-webkit-transform:translateX(-50%);-moz-transform:translateX(-50%);transform:translateX(-50%)}.hint--bottom:hover:before{-webkit-transform:translateY(8px);-moz-transform:translateY(8px);transform:translateY(8px)}.hint--bottom:hover:after{-webkit-transform:translateX(-50%) translateY(8px);-moz-transform:translateX(-50%) translateY(8px);transform:translateX(-50%) translateY(8px)}.hint--right:before{border-right-color:#000000;margin-left:-11px;margin-bottom:-6px}.hint--right:after{margin-bottom:-14px}.hint--right:after,.hint--right:before{left:100%;bottom:50%}.hint--right:hover:after,.hint--right:hover:before{-webkit-transform:translateX(8px);-moz-transform:translateX(8px);transform:translateX(8px)}.hint--left:before{border-left-color:#000000;margin-right:-11px;margin-bottom:-6px}.hint--left:after{margin-bottom:-14px}.hint--left:after,.hint--left:before{right:100%;bottom:50%}.hint--left:hover:after,.hint--left:hover:before{-webkit-transform:translateX(-8px);-moz-transform:translateX(-8px);transform:translateX(-8px)}.hint--top-left:after,.hint--top-left:before{bottom:100%;left:50%}.hint--top-left:before{margin-bottom:-11px;left:calc(50% - 6px)}.hint--top-left:after{-webkit-transform:translateX(-100%);-moz-transform:translateX(-100%);transform:translateX(-100%);margin-left:12px}.hint--top-left:hover:before{-webkit-transform:translateY(-8px);-moz-transform:translateY(-8px);transform:translateY(-8px)}.hint--top-left:hover:after{-webkit-transform:translateX(-100%) translateY(-8px);-moz-transform:translateX(-100%) translateY(-8px);transform:translateX(-100%) translateY(-8px)}.hint--top-right:after,.hint--top-right:before{bottom:100%;left:50%}.hint--top-right:before{margin-bottom:-11px;left:calc(50% - 6px)}.hint--top-right:after{-webkit-transform:translateX(0);-moz-transform:translateX(0);transform:translateX(0);margin-left:-12px}.hint--top-right:hover:after,.hint--top-right:hover:before{-webkit-transform:translateY(-8px);-moz-transform:translateY(-8px);transform:translateY(-8px)}.hint--bottom-left:after,.hint--bottom-left:before{top:100%;left:50%}.hint--bottom-left:before{margin-top:-11px;left:calc(50% - 6px)}.hint--bottom-left:after{-webkit-transform:translateX(-100%);-moz-transform:translateX(-100%);transform:translateX(-100%);margin-left:12px}.hint--bottom-left:hover:before{-webkit-transform:translateY(8px);-moz-transform:translateY(8px);transform:translateY(8px)}.hint--bottom-left:hover:after{-webkit-transform:translateX(-100%) translateY(8px);-moz-transform:translateX(-100%) translateY(8px);transform:translateX(-100%) translateY(8px)}.hint--bottom-right:after,.hint--bottom-right:before{top:100%;left:50%}.hint--bottom-right:before{margin-top:-11px;left:calc(50% - 6px)}.hint--bottom-right:after{-webkit-transform:translateX(0);-moz-transform:translateX(0);transform:translateX(0);margin-left:-12px}.hint--bottom-right:hover:after,.hint--bottom-right:hover:before{-webkit-transform:translateY(8px);-moz-transform:translateY(8px);transform:translateY(8px)}.hint--large:after,.hint--medium:after,.hint--small:after{white-space:normal;line-height:1.4em;word-wrap:break-word}.hint--small:after{width:80px}.hint--medium:after{width:150px}.hint--large:after{width:300px}.hint--error:after{background-color:#b34e4d;text-shadow:0 -1px 0 #592726}.hint--error.hint--top-left:before,.hint--error.hint--top-right:before,.hint--error.hint--top:before{border-top-color:#b34e4d}.hint--error.hint--bottom-left:before,.hint--error.hint--bottom-right:before,.hint--error.hint--bottom:before{border-bottom-color:#b34e4d}.hint--error.hint--left:before{border-left-color:#b34e4d}.hint--error.hint--right:before{border-right-color:#b34e4d}.hint--warning:after{background-color:#c09854;text-shadow:0 -1px 0 #6c5328}.hint--warning.hint--top-left:before,.hint--warning.hint--top-right:before,.hint--warning.hint--top:before{border-top-color:#c09854}.hint--warning.hint--bottom-left:before,.hint--warning.hint--bottom-right:before,.hint--warning.hint--bottom:before{border-bottom-color:#c09854}.hint--warning.hint--left:before{border-left-color:#c09854}.hint--warning.hint--right:before{border-right-color:#c09854}.hint--info:after{background-color:#3986ac;text-shadow:0 -1px 0 #1a3c4d}.hint--info.hint--top-left:before,.hint--info.hint--top-right:before,.hint--info.hint--top:before{border-top-color:#3986ac}.hint--info.hint--bottom-left:before,.hint--info.hint--bottom-right:before,.hint--info.hint--bottom:before{border-bottom-color:#3986ac}.hint--info.hint--left:before{border-left-color:#3986ac}.hint--info.hint--right:before{border-right-color:#3986ac}.hint--success:after{background-color:#458746;text-shadow:0 -1px 0 #1a321a}.hint--success.hint--top-left:before,.hint--success.hint--top-right:before,.hint--success.hint--top:before{border-top-color:#458746}.hint--success.hint--bottom-left:before,.hint--success.hint--bottom-right:before,.hint--success.hint--bottom:before{border-bottom-color:#458746}.hint--success.hint--left:before{border-left-color:#458746}.hint--success.hint--right:before{border-right-color:#458746}.hint--always:after,.hint--always:before{opacity:1;visibility:visible}.hint--always.hint--top:before{-webkit-transform:translateY(-8px);-moz-transform:translateY(-8px);transform:translateY(-8px)}.hint--always.hint--top:after{-webkit-transform:translateX(-50%) translateY(-8px);-moz-transform:translateX(-50%) translateY(-8px);transform:translateX(-50%) translateY(-8px)}.hint--always.hint--top-left:before{-webkit-transform:translateY(-8px);-moz-transform:translateY(-8px);transform:translateY(-8px)}.hint--always.hint--top-left:after{-webkit-transform:translateX(-100%) translateY(-8px);-moz-transform:translateX(-100%) translateY(-8px);transform:translateX(-100%) translateY(-8px)}.hint--always.hint--top-right:after,.hint--always.hint--top-right:before{-webkit-transform:translateY(-8px);-moz-transform:translateY(-8px);transform:translateY(-8px)}.hint--always.hint--bottom:before{-webkit-transform:translateY(8px);-moz-transform:translateY(8px);transform:translateY(8px)}.hint--always.hint--bottom:after{-webkit-transform:translateX(-50%) translateY(8px);-moz-transform:translateX(-50%) translateY(8px);transform:translateX(-50%) translateY(8px)}.hint--always.hint--bottom-left:before{-webkit-transform:translateY(8px);-moz-transform:translateY(8px);transform:translateY(8px)}.hint--always.hint--bottom-left:after{-webkit-transform:translateX(-100%) translateY(8px);-moz-transform:translateX(-100%) translateY(8px);transform:translateX(-100%) translateY(8px)}.hint--always.hint--bottom-right:after,.hint--always.hint--bottom-right:before{-webkit-transform:translateY(8px);-moz-transform:translateY(8px);transform:translateY(8px)}.hint--always.hint--left:after,.hint--always.hint--left:before{-webkit-transform:translateX(-8px);-moz-transform:translateX(-8px);transform:translateX(-8px)}.hint--always.hint--right:after,.hint--always.hint--right:before{-webkit-transform:translateX(8px);-moz-transform:translateX(8px);transform:translateX(8px)}.hint--rounded:after{border-radius:4px}.hint--no-animate:after,.hint--no-animate:before{-webkit-transition-duration:0s;-moz-transition-duration:0s;transition-duration:0s}.hint--bounce:after,.hint--bounce:before{-webkit-transition:opacity .3s ease,visibility .3s ease,-webkit-transform .3s cubic-bezier(.71,1.7,.77,1.24);-moz-transition:opacity .3s ease,visibility .3s ease,-moz-transform .3s cubic-bezier(.71,1.7,.77,1.24);transition:opacity .3s ease,visibility .3s ease,transform .3s cubic-bezier(.71,1.7,.77,1.24)}")
})