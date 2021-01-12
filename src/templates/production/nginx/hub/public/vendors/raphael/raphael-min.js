// ┌────────────────────────────────────────────────────────────────────┐ \\
// │ Raphaël 2.1.4 - JavaScript Vector Library                          │ \\
// ├────────────────────────────────────────────────────────────────────┤ \\
// │ Copyright © 2008-2012 Dmitry Baranovskiy (http://raphaeljs.com)    │ \\
// │ Copyright © 2008-2012 Sencha Labs (http://sencha.com)              │ \\
// ├────────────────────────────────────────────────────────────────────┤ \\
// │ Licensed under the MIT (http://raphaeljs.com/license.html) license.│ \\
// └────────────────────────────────────────────────────────────────────┘ \\
!(function(a, b) {
  "function" == typeof define && define.amd
    ? define("eve", function() {
        return b();
      })
    : "object" == typeof exports
    ? (module.exports = b())
    : (a.eve = b());
})(this, function() {
  var a,
    b,
    c = "0.4.2",
    d = "hasOwnProperty",
    e = /[\.\/]/,
    f = "*",
    g = function() {},
    h = function(a, b) {
      return a - b;
    },
    i = { n: {} },
    j = function(c, d) {
      c = String(c);
      var e,
        f = b,
        g = Array.prototype.slice.call(arguments, 2),
        i = j.listeners(c),
        k = 0,
        l = [],
        m = {},
        n = [],
        o = a;
      (a = c), (b = 0);
      for (var p = 0, q = i.length; q > p; p++)
        "zIndex" in i[p] &&
          (l.push(i[p].zIndex), i[p].zIndex < 0 && (m[i[p].zIndex] = i[p]));
      for (l.sort(h); l[k] < 0; )
        if (((e = m[l[k++]]), n.push(e.apply(d, g)), b)) return (b = f), n;
      for (p = 0; q > p; p++)
        if (((e = i[p]), "zIndex" in e))
          if (e.zIndex == l[k]) {
            if ((n.push(e.apply(d, g)), b)) break;
            do if ((k++, (e = m[l[k]]), e && n.push(e.apply(d, g)), b)) break;
            while (e);
          } else m[e.zIndex] = e;
        else if ((n.push(e.apply(d, g)), b)) break;
      return (b = f), (a = o), n.length ? n : null;
    };
  return (
    (j._events = i),
    (j.listeners = function(a) {
      var b,
        c,
        d,
        g,
        h,
        j,
        k,
        l,
        m = a.split(e),
        n = i,
        o = [n],
        p = [];
      for (g = 0, h = m.length; h > g; g++) {
        for (l = [], j = 0, k = o.length; k > j; j++)
          for (n = o[j].n, c = [n[m[g]], n[f]], d = 2; d--; )
            (b = c[d]), b && (l.push(b), (p = p.concat(b.f || [])));
        o = l;
      }
      return p;
    }),
    (j.on = function(a, b) {
      if (((a = String(a)), "function" != typeof b)) return function() {};
      for (var c = a.split(e), d = i, f = 0, h = c.length; h > f; f++)
        (d = d.n),
          (d = (d.hasOwnProperty(c[f]) && d[c[f]]) || (d[c[f]] = { n: {} }));
      for (d.f = d.f || [], f = 0, h = d.f.length; h > f; f++)
        if (d.f[f] == b) return g;
      return (
        d.f.push(b),
        function(a) {
          +a == +a && (b.zIndex = +a);
        }
      );
    }),
    (j.f = function(a) {
      var b = [].slice.call(arguments, 1);
      return function() {
        j.apply(null, [a, null].concat(b).concat([].slice.call(arguments, 0)));
      };
    }),
    (j.stop = function() {
      b = 1;
    }),
    (j.nt = function(b) {
      return b ? new RegExp("(?:\\.|\\/|^)" + b + "(?:\\.|\\/|$)").test(a) : a;
    }),
    (j.nts = function() {
      return a.split(e);
    }),
    (j.off = j.unbind = function(a, b) {
      if (!a) return void (j._events = i = { n: {} });
      var c,
        g,
        h,
        k,
        l,
        m,
        n,
        o = a.split(e),
        p = [i];
      for (k = 0, l = o.length; l > k; k++)
        for (m = 0; m < p.length; m += h.length - 2) {
          if (((h = [m, 1]), (c = p[m].n), o[k] != f))
            c[o[k]] && h.push(c[o[k]]);
          else for (g in c) c[d](g) && h.push(c[g]);
          p.splice.apply(p, h);
        }
      for (k = 0, l = p.length; l > k; k++)
        for (c = p[k]; c.n; ) {
          if (b) {
            if (c.f) {
              for (m = 0, n = c.f.length; n > m; m++)
                if (c.f[m] == b) {
                  c.f.splice(m, 1);
                  break;
                }
              !c.f.length && delete c.f;
            }
            for (g in c.n)
              if (c.n[d](g) && c.n[g].f) {
                var q = c.n[g].f;
                for (m = 0, n = q.length; n > m; m++)
                  if (q[m] == b) {
                    q.splice(m, 1);
                    break;
                  }
                !q.length && delete c.n[g].f;
              }
          } else {
            delete c.f;
            for (g in c.n) c.n[d](g) && c.n[g].f && delete c.n[g].f;
          }
          c = c.n;
        }
    }),
    (j.once = function(a, b) {
      var c = function() {
        return j.unbind(a, c), b.apply(this, arguments);
      };
      return j.on(a, c);
    }),
    (j.version = c),
    (j.toString = function() {
      return "You are running Eve " + c;
    }),
    j
  );
}),
  (function(a, b) {
    "function" == typeof define && define.amd
      ? define("raphael.core", ["eve"], function(a) {
          return b(a);
        })
      : "object" == typeof exports
      ? (module.exports = b(require("eve")))
      : (a.Raphael = b(a.eve));
  })(this, function(a) {
    function b(c) {
      if (b.is(c, "function")) return t ? c() : a.on("raphael.DOMload", c);
      if (b.is(c, U))
        return b._engine.create[C](b, c.splice(0, 3 + b.is(c[0], S))).add(c);
      var d = Array.prototype.slice.call(arguments, 0);
      if (b.is(d[d.length - 1], "function")) {
        var e = d.pop();
        return t
          ? e.call(b._engine.create[C](b, d))
          : a.on("raphael.DOMload", function() {
              e.call(b._engine.create[C](b, d));
            });
      }
      return b._engine.create[C](b, arguments);
    }
    function c(a) {
      if ("function" == typeof a || Object(a) !== a) return a;
      var b = new a.constructor();
      for (var d in a) a[y](d) && (b[d] = c(a[d]));
      return b;
    }
    function d(a, b) {
      for (var c = 0, d = a.length; d > c; c++)
        if (a[c] === b) return a.push(a.splice(c, 1)[0]);
    }
    function e(a, b, c) {
      function e() {
        var f = Array.prototype.slice.call(arguments, 0),
          g = f.join("␀"),
          h = (e.cache = e.cache || {}),
          i = (e.count = e.count || []);
        return h[y](g)
          ? (d(i, g), c ? c(h[g]) : h[g])
          : (i.length >= 1e3 && delete h[i.shift()],
            i.push(g),
            (h[g] = a[C](b, f)),
            c ? c(h[g]) : h[g]);
      }
      return e;
    }
    function f() {
      return this.hex;
    }
    function g(a, b) {
      for (var c = [], d = 0, e = a.length; e - 2 * !b > d; d += 2) {
        var f = [
          { x: +a[d - 2], y: +a[d - 1] },
          { x: +a[d], y: +a[d + 1] },
          { x: +a[d + 2], y: +a[d + 3] },
          { x: +a[d + 4], y: +a[d + 5] }
        ];
        b
          ? d
            ? e - 4 == d
              ? (f[3] = { x: +a[0], y: +a[1] })
              : e - 2 == d &&
                ((f[2] = { x: +a[0], y: +a[1] }),
                (f[3] = { x: +a[2], y: +a[3] }))
            : (f[0] = { x: +a[e - 2], y: +a[e - 1] })
          : e - 4 == d
          ? (f[3] = f[2])
          : d || (f[0] = { x: +a[d], y: +a[d + 1] }),
          c.push([
            "C",
            (-f[0].x + 6 * f[1].x + f[2].x) / 6,
            (-f[0].y + 6 * f[1].y + f[2].y) / 6,
            (f[1].x + 6 * f[2].x - f[3].x) / 6,
            (f[1].y + 6 * f[2].y - f[3].y) / 6,
            f[2].x,
            f[2].y
          ]);
      }
      return c;
    }
    function h(a, b, c, d, e) {
      var f = -3 * b + 9 * c - 9 * d + 3 * e,
        g = a * f + 6 * b - 12 * c + 6 * d;
      return a * g - 3 * b + 3 * c;
    }
    function i(a, b, c, d, e, f, g, i, j) {
      null == j && (j = 1), (j = j > 1 ? 1 : 0 > j ? 0 : j);
      for (
        var k = j / 2,
          l = 12,
          m = [
            -0.1252,
            0.1252,
            -0.3678,
            0.3678,
            -0.5873,
            0.5873,
            -0.7699,
            0.7699,
            -0.9041,
            0.9041,
            -0.9816,
            0.9816
          ],
          n = [
            0.2491,
            0.2491,
            0.2335,
            0.2335,
            0.2032,
            0.2032,
            0.1601,
            0.1601,
            0.1069,
            0.1069,
            0.0472,
            0.0472
          ],
          o = 0,
          p = 0;
        l > p;
        p++
      ) {
        var q = k * m[p] + k,
          r = h(q, a, c, e, g),
          s = h(q, b, d, f, i),
          t = r * r + s * s;
        o += n[p] * M.sqrt(t);
      }
      return k * o;
    }
    function j(a, b, c, d, e, f, g, h, j) {
      if (!(0 > j || i(a, b, c, d, e, f, g, h) < j)) {
        var k,
          l = 1,
          m = l / 2,
          n = l - m,
          o = 0.01;
        for (k = i(a, b, c, d, e, f, g, h, n); P(k - j) > o; )
          (m /= 2),
            (n += (j > k ? 1 : -1) * m),
            (k = i(a, b, c, d, e, f, g, h, n));
        return n;
      }
    }
    function k(a, b, c, d, e, f, g, h) {
      if (
        !(
          N(a, c) < O(e, g) ||
          O(a, c) > N(e, g) ||
          N(b, d) < O(f, h) ||
          O(b, d) > N(f, h)
        )
      ) {
        var i = (a * d - b * c) * (e - g) - (a - c) * (e * h - f * g),
          j = (a * d - b * c) * (f - h) - (b - d) * (e * h - f * g),
          k = (a - c) * (f - h) - (b - d) * (e - g);
        if (k) {
          var l = i / k,
            m = j / k,
            n = +l.toFixed(2),
            o = +m.toFixed(2);
          if (
            !(
              n < +O(a, c).toFixed(2) ||
              n > +N(a, c).toFixed(2) ||
              n < +O(e, g).toFixed(2) ||
              n > +N(e, g).toFixed(2) ||
              o < +O(b, d).toFixed(2) ||
              o > +N(b, d).toFixed(2) ||
              o < +O(f, h).toFixed(2) ||
              o > +N(f, h).toFixed(2)
            )
          )
            return { x: l, y: m };
        }
      }
    }
    function l(a, c, d) {
      var e = b.bezierBBox(a),
        f = b.bezierBBox(c);
      if (!b.isBBoxIntersect(e, f)) return d ? 0 : [];
      for (
        var g = i.apply(0, a),
          h = i.apply(0, c),
          j = N(~~(g / 5), 1),
          l = N(~~(h / 5), 1),
          m = [],
          n = [],
          o = {},
          p = d ? 0 : [],
          q = 0;
        j + 1 > q;
        q++
      ) {
        var r = b.findDotsAtSegment.apply(b, a.concat(q / j));
        m.push({ x: r.x, y: r.y, t: q / j });
      }
      for (q = 0; l + 1 > q; q++)
        (r = b.findDotsAtSegment.apply(b, c.concat(q / l))),
          n.push({ x: r.x, y: r.y, t: q / l });
      for (q = 0; j > q; q++)
        for (var s = 0; l > s; s++) {
          var t = m[q],
            u = m[q + 1],
            v = n[s],
            w = n[s + 1],
            x = P(u.x - t.x) < 0.001 ? "y" : "x",
            y = P(w.x - v.x) < 0.001 ? "y" : "x",
            z = k(t.x, t.y, u.x, u.y, v.x, v.y, w.x, w.y);
          if (z) {
            if (o[z.x.toFixed(4)] == z.y.toFixed(4)) continue;
            o[z.x.toFixed(4)] = z.y.toFixed(4);
            var A = t.t + P((z[x] - t[x]) / (u[x] - t[x])) * (u.t - t.t),
              B = v.t + P((z[y] - v[y]) / (w[y] - v[y])) * (w.t - v.t);
            A >= 0 &&
              1.001 >= A &&
              B >= 0 &&
              1.001 >= B &&
              (d ? p++ : p.push({ x: z.x, y: z.y, t1: O(A, 1), t2: O(B, 1) }));
          }
        }
      return p;
    }
    function m(a, c, d) {
      (a = b._path2curve(a)), (c = b._path2curve(c));
      for (
        var e, f, g, h, i, j, k, m, n, o, p = d ? 0 : [], q = 0, r = a.length;
        r > q;
        q++
      ) {
        var s = a[q];
        if ("M" == s[0]) (e = i = s[1]), (f = j = s[2]);
        else {
          "C" == s[0]
            ? ((n = [e, f].concat(s.slice(1))), (e = n[6]), (f = n[7]))
            : ((n = [e, f, e, f, i, j, i, j]), (e = i), (f = j));
          for (var t = 0, u = c.length; u > t; t++) {
            var v = c[t];
            if ("M" == v[0]) (g = k = v[1]), (h = m = v[2]);
            else {
              "C" == v[0]
                ? ((o = [g, h].concat(v.slice(1))), (g = o[6]), (h = o[7]))
                : ((o = [g, h, g, h, k, m, k, m]), (g = k), (h = m));
              var w = l(n, o, d);
              if (d) p += w;
              else {
                for (var x = 0, y = w.length; y > x; x++)
                  (w[x].segment1 = q),
                    (w[x].segment2 = t),
                    (w[x].bez1 = n),
                    (w[x].bez2 = o);
                p = p.concat(w);
              }
            }
          }
        }
      }
      return p;
    }
    function n(a, b, c, d, e, f) {
      null != a
        ? ((this.a = +a),
          (this.b = +b),
          (this.c = +c),
          (this.d = +d),
          (this.e = +e),
          (this.f = +f))
        : ((this.a = 1),
          (this.b = 0),
          (this.c = 0),
          (this.d = 1),
          (this.e = 0),
          (this.f = 0));
    }
    function o() {
      return this.x + G + this.y + G + this.width + " × " + this.height;
    }
    function p(a, b, c, d, e, f) {
      function g(a) {
        return ((l * a + k) * a + j) * a;
      }
      function h(a, b) {
        var c = i(a, b);
        return ((o * c + n) * c + m) * c;
      }
      function i(a, b) {
        var c, d, e, f, h, i;
        for (e = a, i = 0; 8 > i; i++) {
          if (((f = g(e) - a), P(f) < b)) return e;
          if (((h = (3 * l * e + 2 * k) * e + j), P(h) < 1e-6)) break;
          e -= f / h;
        }
        if (((c = 0), (d = 1), (e = a), c > e)) return c;
        if (e > d) return d;
        for (; d > c; ) {
          if (((f = g(e)), P(f - a) < b)) return e;
          a > f ? (c = e) : (d = e), (e = (d - c) / 2 + c);
        }
        return e;
      }
      var j = 3 * b,
        k = 3 * (d - b) - j,
        l = 1 - j - k,
        m = 3 * c,
        n = 3 * (e - c) - m,
        o = 1 - m - n;
      return h(a, 1 / (200 * f));
    }
    function q(a, b) {
      var c = [],
        d = {};
      if (((this.ms = b), (this.times = 1), a)) {
        for (var e in a) a[y](e) && ((d[$(e)] = a[e]), c.push($(e)));
        c.sort(ka);
      }
      (this.anim = d), (this.top = c[c.length - 1]), (this.percents = c);
    }
    function r(c, d, e, f, g, h) {
      e = $(e);
      var i,
        j,
        k,
        l,
        m,
        o,
        q = c.ms,
        r = {},
        s = {},
        t = {};
      if (f)
        for (w = 0, x = fb.length; x > w; w++) {
          var u = fb[w];
          if (u.el.id == d.id && u.anim == c) {
            u.percent != e ? (fb.splice(w, 1), (k = 1)) : (j = u),
              d.attr(u.totalOrigin);
            break;
          }
        }
      else f = +s;
      for (var w = 0, x = c.percents.length; x > w; w++) {
        if (c.percents[w] == e || c.percents[w] > f * c.top) {
          (e = c.percents[w]),
            (m = c.percents[w - 1] || 0),
            (q = (q / c.top) * (e - m)),
            (l = c.percents[w + 1]),
            (i = c.anim[e]);
          break;
        }
        f && d.attr(c.anim[c.percents[w]]);
      }
      if (i) {
        if (j) (j.initstatus = f), (j.start = new Date() - j.ms * f);
        else {
          for (var z in i)
            if (i[y](z) && (ca[y](z) || d.paper.customAttributes[y](z)))
              switch (
                ((r[z] = d.attr(z)),
                null == r[z] && (r[z] = ba[z]),
                (s[z] = i[z]),
                ca[z])
              ) {
                case S:
                  t[z] = (s[z] - r[z]) / q;
                  break;
                case "colour":
                  r[z] = b.getRGB(r[z]);
                  var A = b.getRGB(s[z]);
                  t[z] = {
                    r: (A.r - r[z].r) / q,
                    g: (A.g - r[z].g) / q,
                    b: (A.b - r[z].b) / q
                  };
                  break;
                case "path":
                  var B = Ia(r[z], s[z]),
                    C = B[1];
                  for (
                    r[z] = B[0], t[z] = [], w = 0, x = r[z].length;
                    x > w;
                    w++
                  ) {
                    t[z][w] = [0];
                    for (var E = 1, F = r[z][w].length; F > E; E++)
                      t[z][w][E] = (C[w][E] - r[z][w][E]) / q;
                  }
                  break;
                case "transform":
                  var G = d._,
                    J = Na(G[z], s[z]);
                  if (J)
                    for (
                      r[z] = J.from,
                        s[z] = J.to,
                        t[z] = [],
                        t[z].real = !0,
                        w = 0,
                        x = r[z].length;
                      x > w;
                      w++
                    )
                      for (
                        t[z][w] = [r[z][w][0]], E = 1, F = r[z][w].length;
                        F > E;
                        E++
                      )
                        t[z][w][E] = (s[z][w][E] - r[z][w][E]) / q;
                  else {
                    var K = d.matrix || new n(),
                      L = {
                        _: { transform: G.transform },
                        getBBox: function() {
                          return d.getBBox(1);
                        }
                      };
                    (r[z] = [K.a, K.b, K.c, K.d, K.e, K.f]),
                      La(L, s[z]),
                      (s[z] = L._.transform),
                      (t[z] = [
                        (L.matrix.a - K.a) / q,
                        (L.matrix.b - K.b) / q,
                        (L.matrix.c - K.c) / q,
                        (L.matrix.d - K.d) / q,
                        (L.matrix.e - K.e) / q,
                        (L.matrix.f - K.f) / q
                      ]);
                  }
                  break;
                case "csv":
                  var M = H(i[z])[I](v),
                    N = H(r[z])[I](v);
                  if ("clip-rect" == z)
                    for (r[z] = N, t[z] = [], w = N.length; w--; )
                      t[z][w] = (M[w] - r[z][w]) / q;
                  s[z] = M;
                  break;
                default:
                  for (
                    M = [][D](i[z]),
                      N = [][D](r[z]),
                      t[z] = [],
                      w = d.paper.customAttributes[z].length;
                    w--;

                  )
                    t[z][w] = ((M[w] || 0) - (N[w] || 0)) / q;
              }
          var O = i.easing,
            P = b.easing_formulas[O];
          if (!P)
            if (((P = H(O).match(Y)), P && 5 == P.length)) {
              var Q = P;
              P = function(a) {
                return p(a, +Q[1], +Q[2], +Q[3], +Q[4], q);
              };
            } else P = la;
          if (
            ((o = i.start || c.start || +new Date()),
            (u = {
              anim: c,
              percent: e,
              timestamp: o,
              start: o + (c.del || 0),
              status: 0,
              initstatus: f || 0,
              stop: !1,
              ms: q,
              easing: P,
              from: r,
              diff: t,
              to: s,
              el: d,
              callback: i.callback,
              prev: m,
              next: l,
              repeat: h || c.times,
              origin: d.attr(),
              totalOrigin: g
            }),
            fb.push(u),
            f &&
              !j &&
              !k &&
              ((u.stop = !0), (u.start = new Date() - q * f), 1 == fb.length))
          )
            return hb();
          k && (u.start = new Date() - u.ms * f), 1 == fb.length && gb(hb);
        }
        a("raphael.anim.start." + d.id, d, c);
      }
    }
    function s(a) {
      for (var b = 0; b < fb.length; b++)
        fb[b].el.paper == a && fb.splice(b--, 1);
    }
    (b.version = "2.1.4"), (b.eve = a);
    var t,
      u,
      v = /[, ]+/,
      w = { circle: 1, rect: 1, path: 1, ellipse: 1, text: 1, image: 1 },
      x = /\{(\d+)\}/g,
      y = "hasOwnProperty",
      z = { doc: document, win: window },
      A = {
        was: Object.prototype[y].call(z.win, "Raphael"),
        is: z.win.Raphael
      },
      B = function() {
        this.ca = this.customAttributes = {};
      },
      C = "apply",
      D = "concat",
      E =
        "ontouchstart" in z.win ||
        (z.win.DocumentTouch && z.doc instanceof DocumentTouch),
      F = "",
      G = " ",
      H = String,
      I = "split",
      J = "click dblclick mousedown mousemove mouseout mouseover mouseup touchstart touchmove touchend touchcancel"[
        I
      ](G),
      K = {
        mousedown: "touchstart",
        mousemove: "touchmove",
        mouseup: "touchend"
      },
      L = H.prototype.toLowerCase,
      M = Math,
      N = M.max,
      O = M.min,
      P = M.abs,
      Q = M.pow,
      R = M.PI,
      S = "number",
      T = "string",
      U = "array",
      V = Object.prototype.toString,
      W =
        ((b._ISURL = /^url\(['"]?(.+?)['"]?\)$/i),
        /^\s*((#[a-f\d]{6})|(#[a-f\d]{3})|rgba?\(\s*([\d\.]+%?\s*,\s*[\d\.]+%?\s*,\s*[\d\.]+%?(?:\s*,\s*[\d\.]+%?)?)\s*\)|hsba?\(\s*([\d\.]+(?:deg|\xb0|%)?\s*,\s*[\d\.]+%?\s*,\s*[\d\.]+(?:%?\s*,\s*[\d\.]+)?)%?\s*\)|hsla?\(\s*([\d\.]+(?:deg|\xb0|%)?\s*,\s*[\d\.]+%?\s*,\s*[\d\.]+(?:%?\s*,\s*[\d\.]+)?)%?\s*\))\s*$/i),
      X = { NaN: 1, Infinity: 1, "-Infinity": 1 },
      Y = /^(?:cubic-)?bezier\(([^,]+),([^,]+),([^,]+),([^\)]+)\)/,
      Z = M.round,
      $ = parseFloat,
      _ = parseInt,
      aa = H.prototype.toUpperCase,
      ba = (b._availableAttrs = {
        "arrow-end": "none",
        "arrow-start": "none",
        blur: 0,
        "clip-rect": "0 0 1e9 1e9",
        cursor: "default",
        cx: 0,
        cy: 0,
        fill: "#fff",
        "fill-opacity": 1,
        font: '10px "Arial"',
        "font-family": '"Arial"',
        "font-size": "10",
        "font-style": "normal",
        "font-weight": 400,
        gradient: 0,
        height: 0,
        href: "http://raphaeljs.com/",
        "letter-spacing": 0,
        opacity: 1,
        path: "M0,0",
        r: 0,
        rx: 0,
        ry: 0,
        src: "",
        stroke: "#000",
        "stroke-dasharray": "",
        "stroke-linecap": "butt",
        "stroke-linejoin": "butt",
        "stroke-miterlimit": 0,
        "stroke-opacity": 1,
        "stroke-width": 1,
        target: "_blank",
        "text-anchor": "middle",
        title: "Raphael",
        transform: "",
        width: 0,
        x: 0,
        y: 0
      }),
      ca = (b._availableAnimAttrs = {
        blur: S,
        "clip-rect": "csv",
        cx: S,
        cy: S,
        fill: "colour",
        "fill-opacity": S,
        "font-size": S,
        height: S,
        opacity: S,
        path: "path",
        r: S,
        rx: S,
        ry: S,
        stroke: "colour",
        "stroke-opacity": S,
        "stroke-width": S,
        transform: "transform",
        width: S,
        x: S,
        y: S
      }),
      da = /[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*,[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*/,
      ea = { hs: 1, rg: 1 },
      fa = /,?([achlmqrstvxz]),?/gi,
      ga = /([achlmrqstvz])[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029,]*((-?\d*\.?\d*(?:e[\-+]?\d+)?[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*,?[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*)+)/gi,
      ha = /([rstm])[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029,]*((-?\d*\.?\d*(?:e[\-+]?\d+)?[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*,?[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*)+)/gi,
      ia = /(-?\d*\.?\d*(?:e[\-+]?\d+)?)[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*,?[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*/gi,
      ja =
        ((b._radial_gradient = /^r(?:\(([^,]+?)[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*,[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*([^\)]+?)\))?/),
        {}),
      ka = function(a, b) {
        return $(a) - $(b);
      },
      la = function(a) {
        return a;
      },
      ma = (b._rectPath = function(a, b, c, d, e) {
        return e
          ? [
              ["M", a + e, b],
              ["l", c - 2 * e, 0],
              ["a", e, e, 0, 0, 1, e, e],
              ["l", 0, d - 2 * e],
              ["a", e, e, 0, 0, 1, -e, e],
              ["l", 2 * e - c, 0],
              ["a", e, e, 0, 0, 1, -e, -e],
              ["l", 0, 2 * e - d],
              ["a", e, e, 0, 0, 1, e, -e],
              ["z"]
            ]
          : [["M", a, b], ["l", c, 0], ["l", 0, d], ["l", -c, 0], ["z"]];
      }),
      na = function(a, b, c, d) {
        return (
          null == d && (d = c),
          [
            ["M", a, b],
            ["m", 0, -d],
            ["a", c, d, 0, 1, 1, 0, 2 * d],
            ["a", c, d, 0, 1, 1, 0, -2 * d],
            ["z"]
          ]
        );
      },
      oa = (b._getPath = {
        path: function(a) {
          return a.attr("path");
        },
        circle: function(a) {
          var b = a.attrs;
          return na(b.cx, b.cy, b.r);
        },
        ellipse: function(a) {
          var b = a.attrs;
          return na(b.cx, b.cy, b.rx, b.ry);
        },
        rect: function(a) {
          var b = a.attrs;
          return ma(b.x, b.y, b.width, b.height, b.r);
        },
        image: function(a) {
          var b = a.attrs;
          return ma(b.x, b.y, b.width, b.height);
        },
        text: function(a) {
          var b = a._getBBox();
          return ma(b.x, b.y, b.width, b.height);
        },
        set: function(a) {
          var b = a._getBBox();
          return ma(b.x, b.y, b.width, b.height);
        }
      }),
      pa = (b.mapPath = function(a, b) {
        if (!b) return a;
        var c, d, e, f, g, h, i;
        for (a = Ia(a), e = 0, g = a.length; g > e; e++)
          for (i = a[e], f = 1, h = i.length; h > f; f += 2)
            (c = b.x(i[f], i[f + 1])),
              (d = b.y(i[f], i[f + 1])),
              (i[f] = c),
              (i[f + 1] = d);
        return a;
      });
    if (
      ((b._g = z),
      (b.type =
        z.win.SVGAngle ||
        z.doc.implementation.hasFeature(
          "http://www.w3.org/TR/SVG11/feature#BasicStructure",
          "1.1"
        )
          ? "SVG"
          : "VML"),
      "VML" == b.type)
    ) {
      var qa,
        ra = z.doc.createElement("div");
      if (
        ((ra.innerHTML = '<v:shape adj="1"/>'),
        (qa = ra.firstChild),
        (qa.style.behavior = "url(#default#VML)"),
        !qa || "object" != typeof qa.adj)
      )
        return (b.type = F);
      ra = null;
    }
    (b.svg = !(b.vml = "VML" == b.type)),
      (b._Paper = B),
      (b.fn = u = B.prototype = b.prototype),
      (b._id = 0),
      (b._oid = 0),
      (b.is = function(a, b) {
        return (
          (b = L.call(b)),
          "finite" == b
            ? !X[y](+a)
            : "array" == b
            ? a instanceof Array
            : ("null" == b && null === a) ||
              (b == typeof a && null !== a) ||
              ("object" == b && a === Object(a)) ||
              ("array" == b && Array.isArray && Array.isArray(a)) ||
              V.call(a)
                .slice(8, -1)
                .toLowerCase() == b
        );
      }),
      (b.angle = function(a, c, d, e, f, g) {
        if (null == f) {
          var h = a - d,
            i = c - e;
          return h || i ? (180 + (180 * M.atan2(-i, -h)) / R + 360) % 360 : 0;
        }
        return b.angle(a, c, f, g) - b.angle(d, e, f, g);
      }),
      (b.rad = function(a) {
        return ((a % 360) * R) / 180;
      }),
      (b.deg = function(a) {
        return Math.round((((180 * a) / R) % 360) * 1e3) / 1e3;
      }),
      (b.snapTo = function(a, c, d) {
        if (((d = b.is(d, "finite") ? d : 10), b.is(a, U))) {
          for (var e = a.length; e--; ) if (P(a[e] - c) <= d) return a[e];
        } else {
          a = +a;
          var f = c % a;
          if (d > f) return c - f;
          if (f > a - d) return c - f + a;
        }
        return c;
      });
    b.createUUID = (function(a, b) {
      return function() {
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx"
          .replace(a, b)
          .toUpperCase();
      };
    })(/[xy]/g, function(a) {
      var b = (16 * M.random()) | 0,
        c = "x" == a ? b : (3 & b) | 8;
      return c.toString(16);
    });
    b.setWindow = function(c) {
      a("raphael.setWindow", b, z.win, c),
        (z.win = c),
        (z.doc = z.win.document),
        b._engine.initWin && b._engine.initWin(z.win);
    };
    var sa = function(a) {
        if (b.vml) {
          var c,
            d = /^\s+|\s+$/g;
          try {
            var f = new ActiveXObject("htmlfile");
            f.write("<body>"), f.close(), (c = f.body);
          } catch (g) {
            c = createPopup().document.body;
          }
          var h = c.createTextRange();
          sa = e(function(a) {
            try {
              c.style.color = H(a).replace(d, F);
              var b = h.queryCommandValue("ForeColor");
              return (
                (b = ((255 & b) << 16) | (65280 & b) | ((16711680 & b) >>> 16)),
                "#" + ("000000" + b.toString(16)).slice(-6)
              );
            } catch (e) {
              return "none";
            }
          });
        } else {
          var i = z.doc.createElement("i");
          (i.title = "Raphaël Colour Picker"),
            (i.style.display = "none"),
            z.doc.body.appendChild(i),
            (sa = e(function(a) {
              return (
                (i.style.color = a),
                z.doc.defaultView
                  .getComputedStyle(i, F)
                  .getPropertyValue("color")
              );
            }));
        }
        return sa(a);
      },
      ta = function() {
        return "hsb(" + [this.h, this.s, this.b] + ")";
      },
      ua = function() {
        return "hsl(" + [this.h, this.s, this.l] + ")";
      },
      va = function() {
        return this.hex;
      },
      wa = function(a, c, d) {
        if (
          (null == c &&
            b.is(a, "object") &&
            "r" in a &&
            "g" in a &&
            "b" in a &&
            ((d = a.b), (c = a.g), (a = a.r)),
          null == c && b.is(a, T))
        ) {
          var e = b.getRGB(a);
          (a = e.r), (c = e.g), (d = e.b);
        }
        return (
          (a > 1 || c > 1 || d > 1) && ((a /= 255), (c /= 255), (d /= 255)),
          [a, c, d]
        );
      },
      xa = function(a, c, d, e) {
        (a *= 255), (c *= 255), (d *= 255);
        var f = { r: a, g: c, b: d, hex: b.rgb(a, c, d), toString: va };
        return b.is(e, "finite") && (f.opacity = e), f;
      };
    (b.color = function(a) {
      var c;
      return (
        b.is(a, "object") && "h" in a && "s" in a && "b" in a
          ? ((c = b.hsb2rgb(a)),
            (a.r = c.r),
            (a.g = c.g),
            (a.b = c.b),
            (a.hex = c.hex))
          : b.is(a, "object") && "h" in a && "s" in a && "l" in a
          ? ((c = b.hsl2rgb(a)),
            (a.r = c.r),
            (a.g = c.g),
            (a.b = c.b),
            (a.hex = c.hex))
          : (b.is(a, "string") && (a = b.getRGB(a)),
            b.is(a, "object") && "r" in a && "g" in a && "b" in a
              ? ((c = b.rgb2hsl(a)),
                (a.h = c.h),
                (a.s = c.s),
                (a.l = c.l),
                (c = b.rgb2hsb(a)),
                (a.v = c.b))
              : ((a = { hex: "none" }),
                (a.r = a.g = a.b = a.h = a.s = a.v = a.l = -1))),
        (a.toString = va),
        a
      );
    }),
      (b.hsb2rgb = function(a, b, c, d) {
        this.is(a, "object") &&
          "h" in a &&
          "s" in a &&
          "b" in a &&
          ((c = a.b), (b = a.s), (d = a.o), (a = a.h)),
          (a *= 360);
        var e, f, g, h, i;
        return (
          (a = (a % 360) / 60),
          (i = c * b),
          (h = i * (1 - P((a % 2) - 1))),
          (e = f = g = c - i),
          (a = ~~a),
          (e += [i, h, 0, 0, h, i][a]),
          (f += [h, i, i, h, 0, 0][a]),
          (g += [0, 0, h, i, i, h][a]),
          xa(e, f, g, d)
        );
      }),
      (b.hsl2rgb = function(a, b, c, d) {
        this.is(a, "object") &&
          "h" in a &&
          "s" in a &&
          "l" in a &&
          ((c = a.l), (b = a.s), (a = a.h)),
          (a > 1 || b > 1 || c > 1) && ((a /= 360), (b /= 100), (c /= 100)),
          (a *= 360);
        var e, f, g, h, i;
        return (
          (a = (a % 360) / 60),
          (i = 2 * b * (0.5 > c ? c : 1 - c)),
          (h = i * (1 - P((a % 2) - 1))),
          (e = f = g = c - i / 2),
          (a = ~~a),
          (e += [i, h, 0, 0, h, i][a]),
          (f += [h, i, i, h, 0, 0][a]),
          (g += [0, 0, h, i, i, h][a]),
          xa(e, f, g, d)
        );
      }),
      (b.rgb2hsb = function(a, b, c) {
        (c = wa(a, b, c)), (a = c[0]), (b = c[1]), (c = c[2]);
        var d, e, f, g;
        return (
          (f = N(a, b, c)),
          (g = f - O(a, b, c)),
          (d =
            0 == g
              ? null
              : f == a
              ? (b - c) / g
              : f == b
              ? (c - a) / g + 2
              : (a - b) / g + 4),
          (d = (((d + 360) % 6) * 60) / 360),
          (e = 0 == g ? 0 : g / f),
          { h: d, s: e, b: f, toString: ta }
        );
      }),
      (b.rgb2hsl = function(a, b, c) {
        (c = wa(a, b, c)), (a = c[0]), (b = c[1]), (c = c[2]);
        var d, e, f, g, h, i;
        return (
          (g = N(a, b, c)),
          (h = O(a, b, c)),
          (i = g - h),
          (d =
            0 == i
              ? null
              : g == a
              ? (b - c) / i
              : g == b
              ? (c - a) / i + 2
              : (a - b) / i + 4),
          (d = (((d + 360) % 6) * 60) / 360),
          (f = (g + h) / 2),
          (e = 0 == i ? 0 : 0.5 > f ? i / (2 * f) : i / (2 - 2 * f)),
          { h: d, s: e, l: f, toString: ua }
        );
      }),
      (b._path2string = function() {
        return this.join(",").replace(fa, "$1");
      });
    b._preload = function(a, b) {
      var c = z.doc.createElement("img");
      (c.style.cssText = "position:absolute;left:-9999em;top:-9999em"),
        (c.onload = function() {
          b.call(this), (this.onload = null), z.doc.body.removeChild(this);
        }),
        (c.onerror = function() {
          z.doc.body.removeChild(this);
        }),
        z.doc.body.appendChild(c),
        (c.src = a);
    };
    (b.getRGB = e(function(a) {
      if (!a || (a = H(a)).indexOf("-") + 1)
        return { r: -1, g: -1, b: -1, hex: "none", error: 1, toString: f };
      if ("none" == a) return { r: -1, g: -1, b: -1, hex: "none", toString: f };
      !(ea[y](a.toLowerCase().substring(0, 2)) || "#" == a.charAt()) &&
        (a = sa(a));
      var c,
        d,
        e,
        g,
        h,
        i,
        j = a.match(W);
      return j
        ? (j[2] &&
            ((e = _(j[2].substring(5), 16)),
            (d = _(j[2].substring(3, 5), 16)),
            (c = _(j[2].substring(1, 3), 16))),
          j[3] &&
            ((e = _((h = j[3].charAt(3)) + h, 16)),
            (d = _((h = j[3].charAt(2)) + h, 16)),
            (c = _((h = j[3].charAt(1)) + h, 16))),
          j[4] &&
            ((i = j[4][I](da)),
            (c = $(i[0])),
            "%" == i[0].slice(-1) && (c *= 2.55),
            (d = $(i[1])),
            "%" == i[1].slice(-1) && (d *= 2.55),
            (e = $(i[2])),
            "%" == i[2].slice(-1) && (e *= 2.55),
            "rgba" == j[1].toLowerCase().slice(0, 4) && (g = $(i[3])),
            i[3] && "%" == i[3].slice(-1) && (g /= 100)),
          j[5]
            ? ((i = j[5][I](da)),
              (c = $(i[0])),
              "%" == i[0].slice(-1) && (c *= 2.55),
              (d = $(i[1])),
              "%" == i[1].slice(-1) && (d *= 2.55),
              (e = $(i[2])),
              "%" == i[2].slice(-1) && (e *= 2.55),
              ("deg" == i[0].slice(-3) || "°" == i[0].slice(-1)) && (c /= 360),
              "hsba" == j[1].toLowerCase().slice(0, 4) && (g = $(i[3])),
              i[3] && "%" == i[3].slice(-1) && (g /= 100),
              b.hsb2rgb(c, d, e, g))
            : j[6]
            ? ((i = j[6][I](da)),
              (c = $(i[0])),
              "%" == i[0].slice(-1) && (c *= 2.55),
              (d = $(i[1])),
              "%" == i[1].slice(-1) && (d *= 2.55),
              (e = $(i[2])),
              "%" == i[2].slice(-1) && (e *= 2.55),
              ("deg" == i[0].slice(-3) || "°" == i[0].slice(-1)) && (c /= 360),
              "hsla" == j[1].toLowerCase().slice(0, 4) && (g = $(i[3])),
              i[3] && "%" == i[3].slice(-1) && (g /= 100),
              b.hsl2rgb(c, d, e, g))
            : ((j = { r: c, g: d, b: e, toString: f }),
              (j.hex =
                "#" +
                (16777216 | e | (d << 8) | (c << 16)).toString(16).slice(1)),
              b.is(g, "finite") && (j.opacity = g),
              j))
        : { r: -1, g: -1, b: -1, hex: "none", error: 1, toString: f };
    }, b)),
      (b.hsb = e(function(a, c, d) {
        return b.hsb2rgb(a, c, d).hex;
      })),
      (b.hsl = e(function(a, c, d) {
        return b.hsl2rgb(a, c, d).hex;
      })),
      (b.rgb = e(function(a, b, c) {
        function d(a) {
          return (a + 0.5) | 0;
        }
        return (
          "#" +
          (16777216 | d(c) | (d(b) << 8) | (d(a) << 16)).toString(16).slice(1)
        );
      })),
      (b.getColor = function(a) {
        var b = (this.getColor.start = this.getColor.start || {
            h: 0,
            s: 1,
            b: a || 0.75
          }),
          c = this.hsb2rgb(b.h, b.s, b.b);
        return (
          (b.h += 0.075),
          b.h > 1 &&
            ((b.h = 0),
            (b.s -= 0.2),
            b.s <= 0 && (this.getColor.start = { h: 0, s: 1, b: b.b })),
          c.hex
        );
      }),
      (b.getColor.reset = function() {
        delete this.start;
      }),
      (b.parsePathString = function(a) {
        if (!a) return null;
        var c = ya(a);
        if (c.arr) return Aa(c.arr);
        var d = {
            a: 7,
            c: 6,
            h: 1,
            l: 2,
            m: 2,
            r: 4,
            q: 4,
            s: 4,
            t: 2,
            v: 1,
            z: 0
          },
          e = [];
        return (
          b.is(a, U) && b.is(a[0], U) && (e = Aa(a)),
          e.length ||
            H(a).replace(ga, function(a, b, c) {
              var f = [],
                g = b.toLowerCase();
              if (
                (c.replace(ia, function(a, b) {
                  b && f.push(+b);
                }),
                "m" == g &&
                  f.length > 2 &&
                  (e.push([b][D](f.splice(0, 2))),
                  (g = "l"),
                  (b = "m" == b ? "l" : "L")),
                "r" == g)
              )
                e.push([b][D](f));
              else
                for (
                  ;
                  f.length >= d[g] && (e.push([b][D](f.splice(0, d[g]))), d[g]);

                );
            }),
          (e.toString = b._path2string),
          (c.arr = Aa(e)),
          e
        );
      }),
      (b.parseTransformString = e(function(a) {
        if (!a) return null;
        var c = [];
        return (
          b.is(a, U) && b.is(a[0], U) && (c = Aa(a)),
          c.length ||
            H(a).replace(ha, function(a, b, d) {
              {
                var e = [];
                L.call(b);
              }
              d.replace(ia, function(a, b) {
                b && e.push(+b);
              }),
                c.push([b][D](e));
            }),
          (c.toString = b._path2string),
          c
        );
      }));
    var ya = function(a) {
      var b = (ya.ps = ya.ps || {});
      return (
        b[a] ? (b[a].sleep = 100) : (b[a] = { sleep: 100 }),
        setTimeout(function() {
          for (var c in b)
            b[y](c) && c != a && (b[c].sleep--, !b[c].sleep && delete b[c]);
        }),
        b[a]
      );
    };
    (b.findDotsAtSegment = function(a, b, c, d, e, f, g, h, i) {
      var j = 1 - i,
        k = Q(j, 3),
        l = Q(j, 2),
        m = i * i,
        n = m * i,
        o = k * a + 3 * l * i * c + 3 * j * i * i * e + n * g,
        p = k * b + 3 * l * i * d + 3 * j * i * i * f + n * h,
        q = a + 2 * i * (c - a) + m * (e - 2 * c + a),
        r = b + 2 * i * (d - b) + m * (f - 2 * d + b),
        s = c + 2 * i * (e - c) + m * (g - 2 * e + c),
        t = d + 2 * i * (f - d) + m * (h - 2 * f + d),
        u = j * a + i * c,
        v = j * b + i * d,
        w = j * e + i * g,
        x = j * f + i * h,
        y = 90 - (180 * M.atan2(q - s, r - t)) / R;
      return (
        (q > s || t > r) && (y += 180),
        {
          x: o,
          y: p,
          m: { x: q, y: r },
          n: { x: s, y: t },
          start: { x: u, y: v },
          end: { x: w, y: x },
          alpha: y
        }
      );
    }),
      (b.bezierBBox = function(a, c, d, e, f, g, h, i) {
        b.is(a, "array") || (a = [a, c, d, e, f, g, h, i]);
        var j = Ha.apply(null, a);
        return {
          x: j.min.x,
          y: j.min.y,
          x2: j.max.x,
          y2: j.max.y,
          width: j.max.x - j.min.x,
          height: j.max.y - j.min.y
        };
      }),
      (b.isPointInsideBBox = function(a, b, c) {
        return b >= a.x && b <= a.x2 && c >= a.y && c <= a.y2;
      }),
      (b.isBBoxIntersect = function(a, c) {
        var d = b.isPointInsideBBox;
        return (
          d(c, a.x, a.y) ||
          d(c, a.x2, a.y) ||
          d(c, a.x, a.y2) ||
          d(c, a.x2, a.y2) ||
          d(a, c.x, c.y) ||
          d(a, c.x2, c.y) ||
          d(a, c.x, c.y2) ||
          d(a, c.x2, c.y2) ||
          (((a.x < c.x2 && a.x > c.x) || (c.x < a.x2 && c.x > a.x)) &&
            ((a.y < c.y2 && a.y > c.y) || (c.y < a.y2 && c.y > a.y)))
        );
      }),
      (b.pathIntersection = function(a, b) {
        return m(a, b);
      }),
      (b.pathIntersectionNumber = function(a, b) {
        return m(a, b, 1);
      }),
      (b.isPointInsidePath = function(a, c, d) {
        var e = b.pathBBox(a);
        return (
          b.isPointInsideBBox(e, c, d) &&
          m(
            a,
            [
              ["M", c, d],
              ["H", e.x2 + 10]
            ],
            1
          ) %
            2 ==
            1
        );
      }),
      (b._removedFactory = function(b) {
        return function() {
          a(
            "raphael.log",
            null,
            "Raphaël: you are calling to method “" + b + "” of removed object",
            b
          );
        };
      });
    var za = (b.pathBBox = function(a) {
        var b = ya(a);
        if (b.bbox) return c(b.bbox);
        if (!a) return { x: 0, y: 0, width: 0, height: 0, x2: 0, y2: 0 };
        a = Ia(a);
        for (
          var d, e = 0, f = 0, g = [], h = [], i = 0, j = a.length;
          j > i;
          i++
        )
          if (((d = a[i]), "M" == d[0]))
            (e = d[1]), (f = d[2]), g.push(e), h.push(f);
          else {
            var k = Ha(e, f, d[1], d[2], d[3], d[4], d[5], d[6]);
            (g = g[D](k.min.x, k.max.x)),
              (h = h[D](k.min.y, k.max.y)),
              (e = d[5]),
              (f = d[6]);
          }
        var l = O[C](0, g),
          m = O[C](0, h),
          n = N[C](0, g),
          o = N[C](0, h),
          p = n - l,
          q = o - m,
          r = {
            x: l,
            y: m,
            x2: n,
            y2: o,
            width: p,
            height: q,
            cx: l + p / 2,
            cy: m + q / 2
          };
        return (b.bbox = c(r)), r;
      }),
      Aa = function(a) {
        var d = c(a);
        return (d.toString = b._path2string), d;
      },
      Ba = (b._pathToRelative = function(a) {
        var c = ya(a);
        if (c.rel) return Aa(c.rel);
        (b.is(a, U) && b.is(a && a[0], U)) || (a = b.parsePathString(a));
        var d = [],
          e = 0,
          f = 0,
          g = 0,
          h = 0,
          i = 0;
        "M" == a[0][0] &&
          ((e = a[0][1]),
          (f = a[0][2]),
          (g = e),
          (h = f),
          i++,
          d.push(["M", e, f]));
        for (var j = i, k = a.length; k > j; j++) {
          var l = (d[j] = []),
            m = a[j];
          if (m[0] != L.call(m[0]))
            switch (((l[0] = L.call(m[0])), l[0])) {
              case "a":
                (l[1] = m[1]),
                  (l[2] = m[2]),
                  (l[3] = m[3]),
                  (l[4] = m[4]),
                  (l[5] = m[5]),
                  (l[6] = +(m[6] - e).toFixed(3)),
                  (l[7] = +(m[7] - f).toFixed(3));
                break;
              case "v":
                l[1] = +(m[1] - f).toFixed(3);
                break;
              case "m":
                (g = m[1]), (h = m[2]);
              default:
                for (var n = 1, o = m.length; o > n; n++)
                  l[n] = +(m[n] - (n % 2 ? e : f)).toFixed(3);
            }
          else {
            (l = d[j] = []), "m" == m[0] && ((g = m[1] + e), (h = m[2] + f));
            for (var p = 0, q = m.length; q > p; p++) d[j][p] = m[p];
          }
          var r = d[j].length;
          switch (d[j][0]) {
            case "z":
              (e = g), (f = h);
              break;
            case "h":
              e += +d[j][r - 1];
              break;
            case "v":
              f += +d[j][r - 1];
              break;
            default:
              (e += +d[j][r - 2]), (f += +d[j][r - 1]);
          }
        }
        return (d.toString = b._path2string), (c.rel = Aa(d)), d;
      }),
      Ca = (b._pathToAbsolute = function(a) {
        var c = ya(a);
        if (c.abs) return Aa(c.abs);
        if (
          ((b.is(a, U) && b.is(a && a[0], U)) || (a = b.parsePathString(a)),
          !a || !a.length)
        )
          return [["M", 0, 0]];
        var d = [],
          e = 0,
          f = 0,
          h = 0,
          i = 0,
          j = 0;
        "M" == a[0][0] &&
          ((e = +a[0][1]),
          (f = +a[0][2]),
          (h = e),
          (i = f),
          j++,
          (d[0] = ["M", e, f]));
        for (
          var k,
            l,
            m =
              3 == a.length &&
              "M" == a[0][0] &&
              "R" == a[1][0].toUpperCase() &&
              "Z" == a[2][0].toUpperCase(),
            n = j,
            o = a.length;
          o > n;
          n++
        ) {
          if ((d.push((k = [])), (l = a[n]), l[0] != aa.call(l[0])))
            switch (((k[0] = aa.call(l[0])), k[0])) {
              case "A":
                (k[1] = l[1]),
                  (k[2] = l[2]),
                  (k[3] = l[3]),
                  (k[4] = l[4]),
                  (k[5] = l[5]),
                  (k[6] = +(l[6] + e)),
                  (k[7] = +(l[7] + f));
                break;
              case "V":
                k[1] = +l[1] + f;
                break;
              case "H":
                k[1] = +l[1] + e;
                break;
              case "R":
                for (
                  var p = [e, f][D](l.slice(1)), q = 2, r = p.length;
                  r > q;
                  q++
                )
                  (p[q] = +p[q] + e), (p[++q] = +p[q] + f);
                d.pop(), (d = d[D](g(p, m)));
                break;
              case "M":
                (h = +l[1] + e), (i = +l[2] + f);
              default:
                for (q = 1, r = l.length; r > q; q++)
                  k[q] = +l[q] + (q % 2 ? e : f);
            }
          else if ("R" == l[0])
            (p = [e, f][D](l.slice(1))),
              d.pop(),
              (d = d[D](g(p, m))),
              (k = ["R"][D](l.slice(-2)));
          else for (var s = 0, t = l.length; t > s; s++) k[s] = l[s];
          switch (k[0]) {
            case "Z":
              (e = h), (f = i);
              break;
            case "H":
              e = k[1];
              break;
            case "V":
              f = k[1];
              break;
            case "M":
              (h = k[k.length - 2]), (i = k[k.length - 1]);
            default:
              (e = k[k.length - 2]), (f = k[k.length - 1]);
          }
        }
        return (d.toString = b._path2string), (c.abs = Aa(d)), d;
      }),
      Da = function(a, b, c, d) {
        return [a, b, c, d, c, d];
      },
      Ea = function(a, b, c, d, e, f) {
        var g = 1 / 3,
          h = 2 / 3;
        return [
          g * a + h * c,
          g * b + h * d,
          g * e + h * c,
          g * f + h * d,
          e,
          f
        ];
      },
      Fa = function(a, b, c, d, f, g, h, i, j, k) {
        var l,
          m = (120 * R) / 180,
          n = (R / 180) * (+f || 0),
          o = [],
          p = e(function(a, b, c) {
            var d = a * M.cos(c) - b * M.sin(c),
              e = a * M.sin(c) + b * M.cos(c);
            return { x: d, y: e };
          });
        if (k) (y = k[0]), (z = k[1]), (w = k[2]), (x = k[3]);
        else {
          (l = p(a, b, -n)),
            (a = l.x),
            (b = l.y),
            (l = p(i, j, -n)),
            (i = l.x),
            (j = l.y);
          var q = (M.cos((R / 180) * f), M.sin((R / 180) * f), (a - i) / 2),
            r = (b - j) / 2,
            s = (q * q) / (c * c) + (r * r) / (d * d);
          s > 1 && ((s = M.sqrt(s)), (c = s * c), (d = s * d));
          var t = c * c,
            u = d * d,
            v =
              (g == h ? -1 : 1) *
              M.sqrt(
                P((t * u - t * r * r - u * q * q) / (t * r * r + u * q * q))
              ),
            w = (v * c * r) / d + (a + i) / 2,
            x = (v * -d * q) / c + (b + j) / 2,
            y = M.asin(((b - x) / d).toFixed(9)),
            z = M.asin(((j - x) / d).toFixed(9));
          (y = w > a ? R - y : y),
            (z = w > i ? R - z : z),
            0 > y && (y = 2 * R + y),
            0 > z && (z = 2 * R + z),
            h && y > z && (y -= 2 * R),
            !h && z > y && (z -= 2 * R);
        }
        var A = z - y;
        if (P(A) > m) {
          var B = z,
            C = i,
            E = j;
          (z = y + m * (h && z > y ? 1 : -1)),
            (i = w + c * M.cos(z)),
            (j = x + d * M.sin(z)),
            (o = Fa(i, j, c, d, f, 0, h, C, E, [z, B, w, x]));
        }
        A = z - y;
        var F = M.cos(y),
          G = M.sin(y),
          H = M.cos(z),
          J = M.sin(z),
          K = M.tan(A / 4),
          L = (4 / 3) * c * K,
          N = (4 / 3) * d * K,
          O = [a, b],
          Q = [a + L * G, b - N * F],
          S = [i + L * J, j - N * H],
          T = [i, j];
        if (((Q[0] = 2 * O[0] - Q[0]), (Q[1] = 2 * O[1] - Q[1]), k))
          return [Q, S, T][D](o);
        o = [Q, S, T]
          [D](o)
          .join()
          [I](",");
        for (var U = [], V = 0, W = o.length; W > V; V++)
          U[V] = V % 2 ? p(o[V - 1], o[V], n).y : p(o[V], o[V + 1], n).x;
        return U;
      },
      Ga = function(a, b, c, d, e, f, g, h, i) {
        var j = 1 - i;
        return {
          x:
            Q(j, 3) * a + 3 * Q(j, 2) * i * c + 3 * j * i * i * e + Q(i, 3) * g,
          y: Q(j, 3) * b + 3 * Q(j, 2) * i * d + 3 * j * i * i * f + Q(i, 3) * h
        };
      },
      Ha = e(function(a, b, c, d, e, f, g, h) {
        var i,
          j = e - 2 * c + a - (g - 2 * e + c),
          k = 2 * (c - a) - 2 * (e - c),
          l = a - c,
          m = (-k + M.sqrt(k * k - 4 * j * l)) / 2 / j,
          n = (-k - M.sqrt(k * k - 4 * j * l)) / 2 / j,
          o = [b, h],
          p = [a, g];
        return (
          P(m) > "1e12" && (m = 0.5),
          P(n) > "1e12" && (n = 0.5),
          m > 0 &&
            1 > m &&
            ((i = Ga(a, b, c, d, e, f, g, h, m)), p.push(i.x), o.push(i.y)),
          n > 0 &&
            1 > n &&
            ((i = Ga(a, b, c, d, e, f, g, h, n)), p.push(i.x), o.push(i.y)),
          (j = f - 2 * d + b - (h - 2 * f + d)),
          (k = 2 * (d - b) - 2 * (f - d)),
          (l = b - d),
          (m = (-k + M.sqrt(k * k - 4 * j * l)) / 2 / j),
          (n = (-k - M.sqrt(k * k - 4 * j * l)) / 2 / j),
          P(m) > "1e12" && (m = 0.5),
          P(n) > "1e12" && (n = 0.5),
          m > 0 &&
            1 > m &&
            ((i = Ga(a, b, c, d, e, f, g, h, m)), p.push(i.x), o.push(i.y)),
          n > 0 &&
            1 > n &&
            ((i = Ga(a, b, c, d, e, f, g, h, n)), p.push(i.x), o.push(i.y)),
          {
            min: { x: O[C](0, p), y: O[C](0, o) },
            max: { x: N[C](0, p), y: N[C](0, o) }
          }
        );
      }),
      Ia = (b._path2curve = e(
        function(a, b) {
          var c = !b && ya(a);
          if (!b && c.curve) return Aa(c.curve);
          for (
            var d = Ca(a),
              e = b && Ca(b),
              f = { x: 0, y: 0, bx: 0, by: 0, X: 0, Y: 0, qx: null, qy: null },
              g = { x: 0, y: 0, bx: 0, by: 0, X: 0, Y: 0, qx: null, qy: null },
              h = function(a, b, c) {
                var d,
                  e,
                  f = { T: 1, Q: 1 };
                if (!a) return ["C", b.x, b.y, b.x, b.y, b.x, b.y];
                switch ((!(a[0] in f) && (b.qx = b.qy = null), a[0])) {
                  case "M":
                    (b.X = a[1]), (b.Y = a[2]);
                    break;
                  case "A":
                    a = ["C"][D](Fa[C](0, [b.x, b.y][D](a.slice(1))));
                    break;
                  case "S":
                    "C" == c || "S" == c
                      ? ((d = 2 * b.x - b.bx), (e = 2 * b.y - b.by))
                      : ((d = b.x), (e = b.y)),
                      (a = ["C", d, e][D](a.slice(1)));
                    break;
                  case "T":
                    "Q" == c || "T" == c
                      ? ((b.qx = 2 * b.x - b.qx), (b.qy = 2 * b.y - b.qy))
                      : ((b.qx = b.x), (b.qy = b.y)),
                      (a = ["C"][D](Ea(b.x, b.y, b.qx, b.qy, a[1], a[2])));
                    break;
                  case "Q":
                    (b.qx = a[1]),
                      (b.qy = a[2]),
                      (a = ["C"][D](Ea(b.x, b.y, a[1], a[2], a[3], a[4])));
                    break;
                  case "L":
                    a = ["C"][D](Da(b.x, b.y, a[1], a[2]));
                    break;
                  case "H":
                    a = ["C"][D](Da(b.x, b.y, a[1], b.y));
                    break;
                  case "V":
                    a = ["C"][D](Da(b.x, b.y, b.x, a[1]));
                    break;
                  case "Z":
                    a = ["C"][D](Da(b.x, b.y, b.X, b.Y));
                }
                return a;
              },
              i = function(a, b) {
                if (a[b].length > 7) {
                  a[b].shift();
                  for (var c = a[b]; c.length; )
                    (k[b] = "A"),
                      e && (l[b] = "A"),
                      a.splice(b++, 0, ["C"][D](c.splice(0, 6)));
                  a.splice(b, 1), (p = N(d.length, (e && e.length) || 0));
                }
              },
              j = function(a, b, c, f, g) {
                a &&
                  b &&
                  "M" == a[g][0] &&
                  "M" != b[g][0] &&
                  (b.splice(g, 0, ["M", f.x, f.y]),
                  (c.bx = 0),
                  (c.by = 0),
                  (c.x = a[g][1]),
                  (c.y = a[g][2]),
                  (p = N(d.length, (e && e.length) || 0)));
              },
              k = [],
              l = [],
              m = "",
              n = "",
              o = 0,
              p = N(d.length, (e && e.length) || 0);
            p > o;
            o++
          ) {
            d[o] && (m = d[o][0]),
              "C" != m && ((k[o] = m), o && (n = k[o - 1])),
              (d[o] = h(d[o], f, n)),
              "A" != k[o] && "C" == m && (k[o] = "C"),
              i(d, o),
              e &&
                (e[o] && (m = e[o][0]),
                "C" != m && ((l[o] = m), o && (n = l[o - 1])),
                (e[o] = h(e[o], g, n)),
                "A" != l[o] && "C" == m && (l[o] = "C"),
                i(e, o)),
              j(d, e, f, g, o),
              j(e, d, g, f, o);
            var q = d[o],
              r = e && e[o],
              s = q.length,
              t = e && r.length;
            (f.x = q[s - 2]),
              (f.y = q[s - 1]),
              (f.bx = $(q[s - 4]) || f.x),
              (f.by = $(q[s - 3]) || f.y),
              (g.bx = e && ($(r[t - 4]) || g.x)),
              (g.by = e && ($(r[t - 3]) || g.y)),
              (g.x = e && r[t - 2]),
              (g.y = e && r[t - 1]);
          }
          return e || (c.curve = Aa(d)), e ? [d, e] : d;
        },
        null,
        Aa
      )),
      Ja =
        ((b._parseDots = e(function(a) {
          for (var c = [], d = 0, e = a.length; e > d; d++) {
            var f = {},
              g = a[d].match(/^([^:]*):?([\d\.]*)/);
            if (((f.color = b.getRGB(g[1])), f.color.error)) return null;
            (f.opacity = f.color.opacity),
              (f.color = f.color.hex),
              g[2] && (f.offset = g[2] + "%"),
              c.push(f);
          }
          for (d = 1, e = c.length - 1; e > d; d++)
            if (!c[d].offset) {
              for (
                var h = $(c[d - 1].offset || 0), i = 0, j = d + 1;
                e > j;
                j++
              )
                if (c[j].offset) {
                  i = c[j].offset;
                  break;
                }
              i || ((i = 100), (j = e)), (i = $(i));
              for (var k = (i - h) / (j - d + 1); j > d; d++)
                (h += k), (c[d].offset = h + "%");
            }
          return c;
        })),
        (b._tear = function(a, b) {
          a == b.top && (b.top = a.prev),
            a == b.bottom && (b.bottom = a.next),
            a.next && (a.next.prev = a.prev),
            a.prev && (a.prev.next = a.next);
        })),
      Ka =
        ((b._tofront = function(a, b) {
          b.top !== a &&
            (Ja(a, b),
            (a.next = null),
            (a.prev = b.top),
            (b.top.next = a),
            (b.top = a));
        }),
        (b._toback = function(a, b) {
          b.bottom !== a &&
            (Ja(a, b),
            (a.next = b.bottom),
            (a.prev = null),
            (b.bottom.prev = a),
            (b.bottom = a));
        }),
        (b._insertafter = function(a, b, c) {
          Ja(a, c),
            b == c.top && (c.top = a),
            b.next && (b.next.prev = a),
            (a.next = b.next),
            (a.prev = b),
            (b.next = a);
        }),
        (b._insertbefore = function(a, b, c) {
          Ja(a, c),
            b == c.bottom && (c.bottom = a),
            b.prev && (b.prev.next = a),
            (a.prev = b.prev),
            (b.prev = a),
            (a.next = b);
        }),
        (b.toMatrix = function(a, b) {
          var c = za(a),
            d = {
              _: { transform: F },
              getBBox: function() {
                return c;
              }
            };
          return La(d, b), d.matrix;
        })),
      La =
        ((b.transformPath = function(a, b) {
          return pa(a, Ka(a, b));
        }),
        (b._extractTransform = function(a, c) {
          if (null == c) return a._.transform;
          c = H(c).replace(/\.{3}|\u2026/g, a._.transform || F);
          var d = b.parseTransformString(c),
            e = 0,
            f = 0,
            g = 0,
            h = 1,
            i = 1,
            j = a._,
            k = new n();
          if (((j.transform = d || []), d))
            for (var l = 0, m = d.length; m > l; l++) {
              var o,
                p,
                q,
                r,
                s,
                t = d[l],
                u = t.length,
                v = H(t[0]).toLowerCase(),
                w = t[0] != v,
                x = w ? k.invert() : 0;
              "t" == v && 3 == u
                ? w
                  ? ((o = x.x(0, 0)),
                    (p = x.y(0, 0)),
                    (q = x.x(t[1], t[2])),
                    (r = x.y(t[1], t[2])),
                    k.translate(q - o, r - p))
                  : k.translate(t[1], t[2])
                : "r" == v
                ? 2 == u
                  ? ((s = s || a.getBBox(1)),
                    k.rotate(t[1], s.x + s.width / 2, s.y + s.height / 2),
                    (e += t[1]))
                  : 4 == u &&
                    (w
                      ? ((q = x.x(t[2], t[3])),
                        (r = x.y(t[2], t[3])),
                        k.rotate(t[1], q, r))
                      : k.rotate(t[1], t[2], t[3]),
                    (e += t[1]))
                : "s" == v
                ? 2 == u || 3 == u
                  ? ((s = s || a.getBBox(1)),
                    k.scale(
                      t[1],
                      t[u - 1],
                      s.x + s.width / 2,
                      s.y + s.height / 2
                    ),
                    (h *= t[1]),
                    (i *= t[u - 1]))
                  : 5 == u &&
                    (w
                      ? ((q = x.x(t[3], t[4])),
                        (r = x.y(t[3], t[4])),
                        k.scale(t[1], t[2], q, r))
                      : k.scale(t[1], t[2], t[3], t[4]),
                    (h *= t[1]),
                    (i *= t[2]))
                : "m" == v &&
                  7 == u &&
                  k.add(t[1], t[2], t[3], t[4], t[5], t[6]),
                (j.dirtyT = 1),
                (a.matrix = k);
            }
          (a.matrix = k),
            (j.sx = h),
            (j.sy = i),
            (j.deg = e),
            (j.dx = f = k.e),
            (j.dy = g = k.f),
            1 == h && 1 == i && !e && j.bbox
              ? ((j.bbox.x += +f), (j.bbox.y += +g))
              : (j.dirtyT = 1);
        })),
      Ma = function(a) {
        var b = a[0];
        switch (b.toLowerCase()) {
          case "t":
            return [b, 0, 0];
          case "m":
            return [b, 1, 0, 0, 1, 0, 0];
          case "r":
            return 4 == a.length ? [b, 0, a[2], a[3]] : [b, 0];
          case "s":
            return 5 == a.length
              ? [b, 1, 1, a[3], a[4]]
              : 3 == a.length
              ? [b, 1, 1]
              : [b, 1];
        }
      },
      Na = (b._equaliseTransform = function(a, c) {
        (c = H(c).replace(/\.{3}|\u2026/g, a)),
          (a = b.parseTransformString(a) || []),
          (c = b.parseTransformString(c) || []);
        for (
          var d, e, f, g, h = N(a.length, c.length), i = [], j = [], k = 0;
          h > k;
          k++
        ) {
          if (
            ((f = a[k] || Ma(c[k])),
            (g = c[k] || Ma(f)),
            f[0] != g[0] ||
              ("r" == f[0].toLowerCase() && (f[2] != g[2] || f[3] != g[3])) ||
              ("s" == f[0].toLowerCase() && (f[3] != g[3] || f[4] != g[4])))
          )
            return;
          for (
            i[k] = [], j[k] = [], d = 0, e = N(f.length, g.length);
            e > d;
            d++
          )
            d in f && (i[k][d] = f[d]), d in g && (j[k][d] = g[d]);
        }
        return { from: i, to: j };
      });
    (b._getContainer = function(a, c, d, e) {
      var f;
      return (
        (f = null != e || b.is(a, "object") ? a : z.doc.getElementById(a)),
        null != f
          ? f.tagName
            ? null == c
              ? {
                  container: f,
                  width: f.style.pixelWidth || f.offsetWidth,
                  height: f.style.pixelHeight || f.offsetHeight
                }
              : { container: f, width: c, height: d }
            : { container: 1, x: a, y: c, width: d, height: e }
          : void 0
      );
    }),
      (b.pathToRelative = Ba),
      (b._engine = {}),
      (b.path2curve = Ia),
      (b.matrix = function(a, b, c, d, e, f) {
        return new n(a, b, c, d, e, f);
      }),
      (function(a) {
        function c(a) {
          return a[0] * a[0] + a[1] * a[1];
        }
        function d(a) {
          var b = M.sqrt(c(a));
          a[0] && (a[0] /= b), a[1] && (a[1] /= b);
        }
        (a.add = function(a, b, c, d, e, f) {
          var g,
            h,
            i,
            j,
            k = [[], [], []],
            l = [
              [this.a, this.c, this.e],
              [this.b, this.d, this.f],
              [0, 0, 1]
            ],
            m = [
              [a, c, e],
              [b, d, f],
              [0, 0, 1]
            ];
          for (
            a &&
              a instanceof n &&
              (m = [
                [a.a, a.c, a.e],
                [a.b, a.d, a.f],
                [0, 0, 1]
              ]),
              g = 0;
            3 > g;
            g++
          )
            for (h = 0; 3 > h; h++) {
              for (j = 0, i = 0; 3 > i; i++) j += l[g][i] * m[i][h];
              k[g][h] = j;
            }
          (this.a = k[0][0]),
            (this.b = k[1][0]),
            (this.c = k[0][1]),
            (this.d = k[1][1]),
            (this.e = k[0][2]),
            (this.f = k[1][2]);
        }),
          (a.invert = function() {
            var a = this,
              b = a.a * a.d - a.b * a.c;
            return new n(
              a.d / b,
              -a.b / b,
              -a.c / b,
              a.a / b,
              (a.c * a.f - a.d * a.e) / b,
              (a.b * a.e - a.a * a.f) / b
            );
          }),
          (a.clone = function() {
            return new n(this.a, this.b, this.c, this.d, this.e, this.f);
          }),
          (a.translate = function(a, b) {
            this.add(1, 0, 0, 1, a, b);
          }),
          (a.scale = function(a, b, c, d) {
            null == b && (b = a),
              (c || d) && this.add(1, 0, 0, 1, c, d),
              this.add(a, 0, 0, b, 0, 0),
              (c || d) && this.add(1, 0, 0, 1, -c, -d);
          }),
          (a.rotate = function(a, c, d) {
            (a = b.rad(a)), (c = c || 0), (d = d || 0);
            var e = +M.cos(a).toFixed(9),
              f = +M.sin(a).toFixed(9);
            this.add(e, f, -f, e, c, d), this.add(1, 0, 0, 1, -c, -d);
          }),
          (a.x = function(a, b) {
            return a * this.a + b * this.c + this.e;
          }),
          (a.y = function(a, b) {
            return a * this.b + b * this.d + this.f;
          }),
          (a.get = function(a) {
            return +this[H.fromCharCode(97 + a)].toFixed(4);
          }),
          (a.toString = function() {
            return b.svg
              ? "matrix(" +
                  [
                    this.get(0),
                    this.get(1),
                    this.get(2),
                    this.get(3),
                    this.get(4),
                    this.get(5)
                  ].join() +
                  ")"
              : [
                  this.get(0),
                  this.get(2),
                  this.get(1),
                  this.get(3),
                  0,
                  0
                ].join();
          }),
          (a.toFilter = function() {
            return (
              "progid:DXImageTransform.Microsoft.Matrix(M11=" +
              this.get(0) +
              ", M12=" +
              this.get(2) +
              ", M21=" +
              this.get(1) +
              ", M22=" +
              this.get(3) +
              ", Dx=" +
              this.get(4) +
              ", Dy=" +
              this.get(5) +
              ", sizingmethod='auto expand')"
            );
          }),
          (a.offset = function() {
            return [this.e.toFixed(4), this.f.toFixed(4)];
          }),
          (a.split = function() {
            var a = {};
            (a.dx = this.e), (a.dy = this.f);
            var e = [
              [this.a, this.c],
              [this.b, this.d]
            ];
            (a.scalex = M.sqrt(c(e[0]))),
              d(e[0]),
              (a.shear = e[0][0] * e[1][0] + e[0][1] * e[1][1]),
              (e[1] = [
                e[1][0] - e[0][0] * a.shear,
                e[1][1] - e[0][1] * a.shear
              ]),
              (a.scaley = M.sqrt(c(e[1]))),
              d(e[1]),
              (a.shear /= a.scaley);
            var f = -e[0][1],
              g = e[1][1];
            return (
              0 > g
                ? ((a.rotate = b.deg(M.acos(g))),
                  0 > f && (a.rotate = 360 - a.rotate))
                : (a.rotate = b.deg(M.asin(f))),
              (a.isSimple = !(
                +a.shear.toFixed(9) ||
                (a.scalex.toFixed(9) != a.scaley.toFixed(9) && a.rotate)
              )),
              (a.isSuperSimple =
                !+a.shear.toFixed(9) &&
                a.scalex.toFixed(9) == a.scaley.toFixed(9) &&
                !a.rotate),
              (a.noRotation = !+a.shear.toFixed(9) && !a.rotate),
              a
            );
          }),
          (a.toTransformString = function(a) {
            var b = a || this[I]();
            return b.isSimple
              ? ((b.scalex = +b.scalex.toFixed(4)),
                (b.scaley = +b.scaley.toFixed(4)),
                (b.rotate = +b.rotate.toFixed(4)),
                (b.dx || b.dy ? "t" + [b.dx, b.dy] : F) +
                  (1 != b.scalex || 1 != b.scaley
                    ? "s" + [b.scalex, b.scaley, 0, 0]
                    : F) +
                  (b.rotate ? "r" + [b.rotate, 0, 0] : F))
              : "m" +
                  [
                    this.get(0),
                    this.get(1),
                    this.get(2),
                    this.get(3),
                    this.get(4),
                    this.get(5)
                  ];
          });
      })(n.prototype);
    for (
      var Oa = function() {
          this.returnValue = !1;
        },
        Pa = function() {
          return this.originalEvent.preventDefault();
        },
        Qa = function() {
          this.cancelBubble = !0;
        },
        Ra = function() {
          return this.originalEvent.stopPropagation();
        },
        Sa = function(a) {
          var b = z.doc.documentElement.scrollTop || z.doc.body.scrollTop,
            c = z.doc.documentElement.scrollLeft || z.doc.body.scrollLeft;
          return { x: a.clientX + c, y: a.clientY + b };
        },
        Ta = (function() {
          return z.doc.addEventListener
            ? function(a, b, c, d) {
                var e = function(a) {
                  var b = Sa(a);
                  return c.call(d, a, b.x, b.y);
                };
                if ((a.addEventListener(b, e, !1), E && K[b])) {
                  var f = function(b) {
                    for (
                      var e = Sa(b),
                        f = b,
                        g = 0,
                        h = b.targetTouches && b.targetTouches.length;
                      h > g;
                      g++
                    )
                      if (b.targetTouches[g].target == a) {
                        (b = b.targetTouches[g]),
                          (b.originalEvent = f),
                          (b.preventDefault = Pa),
                          (b.stopPropagation = Ra);
                        break;
                      }
                    return c.call(d, b, e.x, e.y);
                  };
                  a.addEventListener(K[b], f, !1);
                }
                return function() {
                  return (
                    a.removeEventListener(b, e, !1),
                    E && K[b] && a.removeEventListener(K[b], f, !1),
                    !0
                  );
                };
              }
            : z.doc.attachEvent
            ? function(a, b, c, d) {
                var e = function(a) {
                  a = a || z.win.event;
                  var b =
                      z.doc.documentElement.scrollTop || z.doc.body.scrollTop,
                    e =
                      z.doc.documentElement.scrollLeft || z.doc.body.scrollLeft,
                    f = a.clientX + e,
                    g = a.clientY + b;
                  return (
                    (a.preventDefault = a.preventDefault || Oa),
                    (a.stopPropagation = a.stopPropagation || Qa),
                    c.call(d, a, f, g)
                  );
                };
                a.attachEvent("on" + b, e);
                var f = function() {
                  return a.detachEvent("on" + b, e), !0;
                };
                return f;
              }
            : void 0;
        })(),
        Ua = [],
        Va = function(b) {
          for (
            var c,
              d = b.clientX,
              e = b.clientY,
              f = z.doc.documentElement.scrollTop || z.doc.body.scrollTop,
              g = z.doc.documentElement.scrollLeft || z.doc.body.scrollLeft,
              h = Ua.length;
            h--;

          ) {
            if (((c = Ua[h]), E && b.touches)) {
              for (var i, j = b.touches.length; j--; )
                if (((i = b.touches[j]), i.identifier == c.el._drag.id)) {
                  (d = i.clientX),
                    (e = i.clientY),
                    (b.originalEvent ? b.originalEvent : b).preventDefault();
                  break;
                }
            } else b.preventDefault();
            var k,
              l = c.el.node,
              m = l.nextSibling,
              n = l.parentNode,
              o = l.style.display;
            z.win.opera && n.removeChild(l),
              (l.style.display = "none"),
              (k = c.el.paper.getElementByPoint(d, e)),
              (l.style.display = o),
              z.win.opera && (m ? n.insertBefore(l, m) : n.appendChild(l)),
              k && a("raphael.drag.over." + c.el.id, c.el, k),
              (d += g),
              (e += f),
              a(
                "raphael.drag.move." + c.el.id,
                c.move_scope || c.el,
                d - c.el._drag.x,
                e - c.el._drag.y,
                d,
                e,
                b
              );
          }
        },
        Wa = function(c) {
          b.unmousemove(Va).unmouseup(Wa);
          for (var d, e = Ua.length; e--; )
            (d = Ua[e]),
              (d.el._drag = {}),
              a(
                "raphael.drag.end." + d.el.id,
                d.end_scope || d.start_scope || d.move_scope || d.el,
                c
              );
          Ua = [];
        },
        Xa = (b.el = {}),
        Ya = J.length;
      Ya--;

    )
      !(function(a) {
        (b[a] = Xa[a] = function(c, d) {
          return (
            b.is(c, "function") &&
              ((this.events = this.events || []),
              this.events.push({
                name: a,
                f: c,
                unbind: Ta(this.shape || this.node || z.doc, a, c, d || this)
              })),
            this
          );
        }),
          (b["un" + a] = Xa["un" + a] = function(c) {
            for (var d = this.events || [], e = d.length; e--; )
              d[e].name != a ||
                (!b.is(c, "undefined") && d[e].f != c) ||
                (d[e].unbind(),
                d.splice(e, 1),
                !d.length && delete this.events);
            return this;
          });
      })(J[Ya]);
    (Xa.data = function(c, d) {
      var e = (ja[this.id] = ja[this.id] || {});
      if (0 == arguments.length) return e;
      if (1 == arguments.length) {
        if (b.is(c, "object")) {
          for (var f in c) c[y](f) && this.data(f, c[f]);
          return this;
        }
        return a("raphael.data.get." + this.id, this, e[c], c), e[c];
      }
      return (e[c] = d), a("raphael.data.set." + this.id, this, d, c), this;
    }),
      (Xa.removeData = function(a) {
        return (
          null == a ? (ja[this.id] = {}) : ja[this.id] && delete ja[this.id][a],
          this
        );
      }),
      (Xa.getData = function() {
        return c(ja[this.id] || {});
      }),
      (Xa.hover = function(a, b, c, d) {
        return this.mouseover(a, c).mouseout(b, d || c);
      }),
      (Xa.unhover = function(a, b) {
        return this.unmouseover(a).unmouseout(b);
      });
    var Za = [];
    (Xa.drag = function(c, d, e, f, g, h) {
      function i(i) {
        (i.originalEvent || i).preventDefault();
        var j = i.clientX,
          k = i.clientY,
          l = z.doc.documentElement.scrollTop || z.doc.body.scrollTop,
          m = z.doc.documentElement.scrollLeft || z.doc.body.scrollLeft;
        if (((this._drag.id = i.identifier), E && i.touches))
          for (var n, o = i.touches.length; o--; )
            if (
              ((n = i.touches[o]),
              (this._drag.id = n.identifier),
              n.identifier == this._drag.id)
            ) {
              (j = n.clientX), (k = n.clientY);
              break;
            }
        (this._drag.x = j + m),
          (this._drag.y = k + l),
          !Ua.length && b.mousemove(Va).mouseup(Wa),
          Ua.push({ el: this, move_scope: f, start_scope: g, end_scope: h }),
          d && a.on("raphael.drag.start." + this.id, d),
          c && a.on("raphael.drag.move." + this.id, c),
          e && a.on("raphael.drag.end." + this.id, e),
          a(
            "raphael.drag.start." + this.id,
            g || f || this,
            i.clientX + m,
            i.clientY + l,
            i
          );
      }
      return (
        (this._drag = {}),
        Za.push({ el: this, start: i }),
        this.mousedown(i),
        this
      );
    }),
      (Xa.onDragOver = function(b) {
        b
          ? a.on("raphael.drag.over." + this.id, b)
          : a.unbind("raphael.drag.over." + this.id);
      }),
      (Xa.undrag = function() {
        for (var c = Za.length; c--; )
          Za[c].el == this &&
            (this.unmousedown(Za[c].start),
            Za.splice(c, 1),
            a.unbind("raphael.drag.*." + this.id));
        !Za.length && b.unmousemove(Va).unmouseup(Wa), (Ua = []);
      }),
      (u.circle = function(a, c, d) {
        var e = b._engine.circle(this, a || 0, c || 0, d || 0);
        return this.__set__ && this.__set__.push(e), e;
      }),
      (u.rect = function(a, c, d, e, f) {
        var g = b._engine.rect(this, a || 0, c || 0, d || 0, e || 0, f || 0);
        return this.__set__ && this.__set__.push(g), g;
      }),
      (u.ellipse = function(a, c, d, e) {
        var f = b._engine.ellipse(this, a || 0, c || 0, d || 0, e || 0);
        return this.__set__ && this.__set__.push(f), f;
      }),
      (u.path = function(a) {
        a && !b.is(a, T) && !b.is(a[0], U) && (a += F);
        var c = b._engine.path(b.format[C](b, arguments), this);
        return this.__set__ && this.__set__.push(c), c;
      }),
      (u.image = function(a, c, d, e, f) {
        var g = b._engine.image(
          this,
          a || "about:blank",
          c || 0,
          d || 0,
          e || 0,
          f || 0
        );
        return this.__set__ && this.__set__.push(g), g;
      }),
      (u.text = function(a, c, d) {
        var e = b._engine.text(this, a || 0, c || 0, H(d));
        return this.__set__ && this.__set__.push(e), e;
      }),
      (u.set = function(a) {
        !b.is(a, "array") &&
          (a = Array.prototype.splice.call(arguments, 0, arguments.length));
        var c = new jb(a);
        return (
          this.__set__ && this.__set__.push(c),
          (c.paper = this),
          (c.type = "set"),
          c
        );
      }),
      (u.setStart = function(a) {
        this.__set__ = a || this.set();
      }),
      (u.setFinish = function(a) {
        var b = this.__set__;
        return delete this.__set__, b;
      }),
      (u.getSize = function() {
        var a = this.canvas.parentNode;
        return { width: a.offsetWidth, height: a.offsetHeight };
      }),
      (u.setSize = function(a, c) {
        return b._engine.setSize.call(this, a, c);
      }),
      (u.setViewBox = function(a, c, d, e, f) {
        return b._engine.setViewBox.call(this, a, c, d, e, f);
      }),
      (u.top = u.bottom = null),
      (u.raphael = b);
    var $a = function(a) {
      var b = a.getBoundingClientRect(),
        c = a.ownerDocument,
        d = c.body,
        e = c.documentElement,
        f = e.clientTop || d.clientTop || 0,
        g = e.clientLeft || d.clientLeft || 0,
        h = b.top + (z.win.pageYOffset || e.scrollTop || d.scrollTop) - f,
        i = b.left + (z.win.pageXOffset || e.scrollLeft || d.scrollLeft) - g;
      return { y: h, x: i };
    };
    (u.getElementByPoint = function(a, b) {
      var c = this,
        d = c.canvas,
        e = z.doc.elementFromPoint(a, b);
      if (z.win.opera && "svg" == e.tagName) {
        var f = $a(d),
          g = d.createSVGRect();
        (g.x = a - f.x), (g.y = b - f.y), (g.width = g.height = 1);
        var h = d.getIntersectionList(g, null);
        h.length && (e = h[h.length - 1]);
      }
      if (!e) return null;
      for (; e.parentNode && e != d.parentNode && !e.raphael; )
        e = e.parentNode;
      return (
        e == c.canvas.parentNode && (e = d),
        (e = e && e.raphael ? c.getById(e.raphaelid) : null)
      );
    }),
      (u.getElementsByBBox = function(a) {
        var c = this.set();
        return (
          this.forEach(function(d) {
            b.isBBoxIntersect(d.getBBox(), a) && c.push(d);
          }),
          c
        );
      }),
      (u.getById = function(a) {
        for (var b = this.bottom; b; ) {
          if (b.id == a) return b;
          b = b.next;
        }
        return null;
      }),
      (u.forEach = function(a, b) {
        for (var c = this.bottom; c; ) {
          if (a.call(b, c) === !1) return this;
          c = c.next;
        }
        return this;
      }),
      (u.getElementsByPoint = function(a, b) {
        var c = this.set();
        return (
          this.forEach(function(d) {
            d.isPointInside(a, b) && c.push(d);
          }),
          c
        );
      }),
      (Xa.isPointInside = function(a, c) {
        var d = (this.realPath = oa[this.type](this));
        return (
          this.attr("transform") &&
            this.attr("transform").length &&
            (d = b.transformPath(d, this.attr("transform"))),
          b.isPointInsidePath(d, a, c)
        );
      }),
      (Xa.getBBox = function(a) {
        if (this.removed) return {};
        var b = this._;
        return a
          ? ((b.dirty || !b.bboxwt) &&
              ((this.realPath = oa[this.type](this)),
              (b.bboxwt = za(this.realPath)),
              (b.bboxwt.toString = o),
              (b.dirty = 0)),
            b.bboxwt)
          : ((b.dirty || b.dirtyT || !b.bbox) &&
              ((b.dirty || !this.realPath) &&
                ((b.bboxwt = 0), (this.realPath = oa[this.type](this))),
              (b.bbox = za(pa(this.realPath, this.matrix))),
              (b.bbox.toString = o),
              (b.dirty = b.dirtyT = 0)),
            b.bbox);
      }),
      (Xa.clone = function() {
        if (this.removed) return null;
        var a = this.paper[this.type]().attr(this.attr());
        return this.__set__ && this.__set__.push(a), a;
      }),
      (Xa.glow = function(a) {
        if ("text" == this.type) return null;
        a = a || {};
        var b = {
            width: (a.width || 10) + (+this.attr("stroke-width") || 1),
            fill: a.fill || !1,
            opacity: null == a.opacity ? 0.5 : a.opacity,
            offsetx: a.offsetx || 0,
            offsety: a.offsety || 0,
            color: a.color || "#000"
          },
          c = b.width / 2,
          d = this.paper,
          e = d.set(),
          f = this.realPath || oa[this.type](this);
        f = this.matrix ? pa(f, this.matrix) : f;
        for (var g = 1; c + 1 > g; g++)
          e.push(
            d.path(f).attr({
              stroke: b.color,
              fill: b.fill ? b.color : "none",
              "stroke-linejoin": "round",
              "stroke-linecap": "round",
              "stroke-width": +((b.width / c) * g).toFixed(3),
              opacity: +(b.opacity / c).toFixed(3)
            })
          );
        return e.insertBefore(this).translate(b.offsetx, b.offsety);
      });
    var _a = function(a, c, d, e, f, g, h, k, l) {
        return null == l
          ? i(a, c, d, e, f, g, h, k)
          : b.findDotsAtSegment(
              a,
              c,
              d,
              e,
              f,
              g,
              h,
              k,
              j(a, c, d, e, f, g, h, k, l)
            );
      },
      ab = function(a, c) {
        return function(d, e, f) {
          d = Ia(d);
          for (
            var g, h, i, j, k, l = "", m = {}, n = 0, o = 0, p = d.length;
            p > o;
            o++
          ) {
            if (((i = d[o]), "M" == i[0])) (g = +i[1]), (h = +i[2]);
            else {
              if (
                ((j = _a(g, h, i[1], i[2], i[3], i[4], i[5], i[6])), n + j > e)
              ) {
                if (c && !m.start) {
                  if (
                    ((k = _a(g, h, i[1], i[2], i[3], i[4], i[5], i[6], e - n)),
                    (l += ["C" + k.start.x, k.start.y, k.m.x, k.m.y, k.x, k.y]),
                    f)
                  )
                    return l;
                  (m.start = l),
                    (l = [
                      "M" + k.x,
                      k.y + "C" + k.n.x,
                      k.n.y,
                      k.end.x,
                      k.end.y,
                      i[5],
                      i[6]
                    ].join()),
                    (n += j),
                    (g = +i[5]),
                    (h = +i[6]);
                  continue;
                }
                if (!a && !c)
                  return (
                    (k = _a(g, h, i[1], i[2], i[3], i[4], i[5], i[6], e - n)),
                    { x: k.x, y: k.y, alpha: k.alpha }
                  );
              }
              (n += j), (g = +i[5]), (h = +i[6]);
            }
            l += i.shift() + i;
          }
          return (
            (m.end = l),
            (k = a
              ? n
              : c
              ? m
              : b.findDotsAtSegment(
                  g,
                  h,
                  i[0],
                  i[1],
                  i[2],
                  i[3],
                  i[4],
                  i[5],
                  1
                )),
            k.alpha && (k = { x: k.x, y: k.y, alpha: k.alpha }),
            k
          );
        };
      },
      bb = ab(1),
      cb = ab(),
      db = ab(0, 1);
    (b.getTotalLength = bb),
      (b.getPointAtLength = cb),
      (b.getSubpath = function(a, b, c) {
        if (this.getTotalLength(a) - c < 1e-6) return db(a, b).end;
        var d = db(a, c, 1);
        return b ? db(d, b).end : d;
      }),
      (Xa.getTotalLength = function() {
        var a = this.getPath();
        if (a)
          return this.node.getTotalLength ? this.node.getTotalLength() : bb(a);
      }),
      (Xa.getPointAtLength = function(a) {
        var b = this.getPath();
        if (b) return cb(b, a);
      }),
      (Xa.getPath = function() {
        var a,
          c = b._getPath[this.type];
        if ("text" != this.type && "set" != this.type)
          return c && (a = c(this)), a;
      }),
      (Xa.getSubpath = function(a, c) {
        var d = this.getPath();
        if (d) return b.getSubpath(d, a, c);
      });
    var eb = (b.easing_formulas = {
      linear: function(a) {
        return a;
      },
      "<": function(a) {
        return Q(a, 1.7);
      },
      ">": function(a) {
        return Q(a, 0.48);
      },
      "<>": function(a) {
        var b = 0.48 - a / 1.04,
          c = M.sqrt(0.1734 + b * b),
          d = c - b,
          e = Q(P(d), 1 / 3) * (0 > d ? -1 : 1),
          f = -c - b,
          g = Q(P(f), 1 / 3) * (0 > f ? -1 : 1),
          h = e + g + 0.5;
        return 3 * (1 - h) * h * h + h * h * h;
      },
      backIn: function(a) {
        var b = 1.70158;
        return a * a * ((b + 1) * a - b);
      },
      backOut: function(a) {
        a -= 1;
        var b = 1.70158;
        return a * a * ((b + 1) * a + b) + 1;
      },
      elastic: function(a) {
        return a == !!a
          ? a
          : Q(2, -10 * a) * M.sin((2 * (a - 0.075) * R) / 0.3) + 1;
      },
      bounce: function(a) {
        var b,
          c = 7.5625,
          d = 2.75;
        return (
          1 / d > a
            ? (b = c * a * a)
            : 2 / d > a
            ? ((a -= 1.5 / d), (b = c * a * a + 0.75))
            : 2.5 / d > a
            ? ((a -= 2.25 / d), (b = c * a * a + 0.9375))
            : ((a -= 2.625 / d), (b = c * a * a + 0.984375)),
          b
        );
      }
    });
    (eb.easeIn = eb["ease-in"] = eb["<"]),
      (eb.easeOut = eb["ease-out"] = eb[">"]),
      (eb.easeInOut = eb["ease-in-out"] = eb["<>"]),
      (eb["back-in"] = eb.backIn),
      (eb["back-out"] = eb.backOut);
    var fb = [],
      gb =
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function(a) {
          setTimeout(a, 16);
        },
      hb = function() {
        for (var c = +new Date(), d = 0; d < fb.length; d++) {
          var e = fb[d];
          if (!e.el.removed && !e.paused) {
            var f,
              g,
              h = c - e.start,
              i = e.ms,
              j = e.easing,
              k = e.from,
              l = e.diff,
              m = e.to,
              n = (e.t, e.el),
              o = {},
              p = {};
            if (
              (e.initstatus
                ? ((h =
                    ((e.initstatus * e.anim.top - e.prev) /
                      (e.percent - e.prev)) *
                    i),
                  (e.status = e.initstatus),
                  delete e.initstatus,
                  e.stop && fb.splice(d--, 1))
                : (e.status =
                    (e.prev + (e.percent - e.prev) * (h / i)) / e.anim.top),
              !(0 > h))
            )
              if (i > h) {
                var q = j(h / i);
                for (var s in k)
                  if (k[y](s)) {
                    switch (ca[s]) {
                      case S:
                        f = +k[s] + q * i * l[s];
                        break;
                      case "colour":
                        f =
                          "rgb(" +
                          [
                            ib(Z(k[s].r + q * i * l[s].r)),
                            ib(Z(k[s].g + q * i * l[s].g)),
                            ib(Z(k[s].b + q * i * l[s].b))
                          ].join(",") +
                          ")";
                        break;
                      case "path":
                        f = [];
                        for (var t = 0, u = k[s].length; u > t; t++) {
                          f[t] = [k[s][t][0]];
                          for (var v = 1, w = k[s][t].length; w > v; v++)
                            f[t][v] = +k[s][t][v] + q * i * l[s][t][v];
                          f[t] = f[t].join(G);
                        }
                        f = f.join(G);
                        break;
                      case "transform":
                        if (l[s].real)
                          for (f = [], t = 0, u = k[s].length; u > t; t++)
                            for (
                              f[t] = [k[s][t][0]], v = 1, w = k[s][t].length;
                              w > v;
                              v++
                            )
                              f[t][v] = k[s][t][v] + q * i * l[s][t][v];
                        else {
                          var x = function(a) {
                            return +k[s][a] + q * i * l[s][a];
                          };
                          f = [["m", x(0), x(1), x(2), x(3), x(4), x(5)]];
                        }
                        break;
                      case "csv":
                        if ("clip-rect" == s)
                          for (f = [], t = 4; t--; )
                            f[t] = +k[s][t] + q * i * l[s][t];
                        break;
                      default:
                        var z = [][D](k[s]);
                        for (
                          f = [], t = n.paper.customAttributes[s].length;
                          t--;

                        )
                          f[t] = +z[t] + q * i * l[s][t];
                    }
                    o[s] = f;
                  }
                n.attr(o),
                  (function(b, c, d) {
                    setTimeout(function() {
                      a("raphael.anim.frame." + b, c, d);
                    });
                  })(n.id, n, e.anim);
              } else {
                if (
                  ((function(c, d, e) {
                    setTimeout(function() {
                      a("raphael.anim.frame." + d.id, d, e),
                        a("raphael.anim.finish." + d.id, d, e),
                        b.is(c, "function") && c.call(d);
                    });
                  })(e.callback, n, e.anim),
                  n.attr(m),
                  fb.splice(d--, 1),
                  e.repeat > 1 && !e.next)
                ) {
                  for (g in m) m[y](g) && (p[g] = e.totalOrigin[g]);
                  e.el.attr(p),
                    r(
                      e.anim,
                      e.el,
                      e.anim.percents[0],
                      null,
                      e.totalOrigin,
                      e.repeat - 1
                    );
                }
                e.next &&
                  !e.stop &&
                  r(e.anim, e.el, e.next, null, e.totalOrigin, e.repeat);
              }
          }
        }
        fb.length && gb(hb);
      },
      ib = function(a) {
        return a > 255 ? 255 : 0 > a ? 0 : a;
      };
    (Xa.animateWith = function(a, c, d, e, f, g) {
      var h = this;
      if (h.removed) return g && g.call(h), h;
      var i = d instanceof q ? d : b.animation(d, e, f, g);
      r(i, h, i.percents[0], null, h.attr());
      for (var j = 0, k = fb.length; k > j; j++)
        if (fb[j].anim == c && fb[j].el == a) {
          fb[k - 1].start = fb[j].start;
          break;
        }
      return h;
    }),
      (Xa.onAnimation = function(b) {
        return (
          b
            ? a.on("raphael.anim.frame." + this.id, b)
            : a.unbind("raphael.anim.frame." + this.id),
          this
        );
      }),
      (q.prototype.delay = function(a) {
        var b = new q(this.anim, this.ms);
        return (b.times = this.times), (b.del = +a || 0), b;
      }),
      (q.prototype.repeat = function(a) {
        var b = new q(this.anim, this.ms);
        return (b.del = this.del), (b.times = M.floor(N(a, 0)) || 1), b;
      }),
      (b.animation = function(a, c, d, e) {
        if (a instanceof q) return a;
        (b.is(d, "function") || !d) && ((e = e || d || null), (d = null)),
          (a = Object(a)),
          (c = +c || 0);
        var f,
          g,
          h = {};
        for (g in a)
          a[y](g) && $(g) != g && $(g) + "%" != g && ((f = !0), (h[g] = a[g]));
        if (f)
          return (
            d && (h.easing = d), e && (h.callback = e), new q({ 100: h }, c)
          );
        if (e) {
          var i = 0;
          for (var j in a) {
            var k = _(j);
            a[y](j) && k > i && (i = k);
          }
          (i += "%"), !a[i].callback && (a[i].callback = e);
        }
        return new q(a, c);
      }),
      (Xa.animate = function(a, c, d, e) {
        var f = this;
        if (f.removed) return e && e.call(f), f;
        var g = a instanceof q ? a : b.animation(a, c, d, e);
        return r(g, f, g.percents[0], null, f.attr()), f;
      }),
      (Xa.setTime = function(a, b) {
        return a && null != b && this.status(a, O(b, a.ms) / a.ms), this;
      }),
      (Xa.status = function(a, b) {
        var c,
          d,
          e = [],
          f = 0;
        if (null != b) return r(a, this, -1, O(b, 1)), this;
        for (c = fb.length; c > f; f++)
          if (((d = fb[f]), d.el.id == this.id && (!a || d.anim == a))) {
            if (a) return d.status;
            e.push({ anim: d.anim, status: d.status });
          }
        return a ? 0 : e;
      }),
      (Xa.pause = function(b) {
        for (var c = 0; c < fb.length; c++)
          fb[c].el.id != this.id ||
            (b && fb[c].anim != b) ||
            (a("raphael.anim.pause." + this.id, this, fb[c].anim) !== !1 &&
              (fb[c].paused = !0));
        return this;
      }),
      (Xa.resume = function(b) {
        for (var c = 0; c < fb.length; c++)
          if (fb[c].el.id == this.id && (!b || fb[c].anim == b)) {
            var d = fb[c];
            a("raphael.anim.resume." + this.id, this, d.anim) !== !1 &&
              (delete d.paused, this.status(d.anim, d.status));
          }
        return this;
      }),
      (Xa.stop = function(b) {
        for (var c = 0; c < fb.length; c++)
          fb[c].el.id != this.id ||
            (b && fb[c].anim != b) ||
            (a("raphael.anim.stop." + this.id, this, fb[c].anim) !== !1 &&
              fb.splice(c--, 1));
        return this;
      }),
      a.on("raphael.remove", s),
      a.on("raphael.clear", s),
      (Xa.toString = function() {
        return "Raphaël’s object";
      });
    var jb = function(a) {
        if (((this.items = []), (this.length = 0), (this.type = "set"), a))
          for (var b = 0, c = a.length; c > b; b++)
            !a[b] ||
              (a[b].constructor != Xa.constructor && a[b].constructor != jb) ||
              ((this[this.items.length] = this.items[this.items.length] = a[b]),
              this.length++);
      },
      kb = jb.prototype;
    (kb.push = function() {
      for (var a, b, c = 0, d = arguments.length; d > c; c++)
        (a = arguments[c]),
          !a ||
            (a.constructor != Xa.constructor && a.constructor != jb) ||
            ((b = this.items.length),
            (this[b] = this.items[b] = a),
            this.length++);
      return this;
    }),
      (kb.pop = function() {
        return this.length && delete this[this.length--], this.items.pop();
      }),
      (kb.forEach = function(a, b) {
        for (var c = 0, d = this.items.length; d > c; c++)
          if (a.call(b, this.items[c], c) === !1) return this;
        return this;
      });
    for (var lb in Xa)
      Xa[y](lb) &&
        (kb[lb] = (function(a) {
          return function() {
            var b = arguments;
            return this.forEach(function(c) {
              c[a][C](c, b);
            });
          };
        })(lb));
    return (
      (kb.attr = function(a, c) {
        if (a && b.is(a, U) && b.is(a[0], "object"))
          for (var d = 0, e = a.length; e > d; d++) this.items[d].attr(a[d]);
        else
          for (var f = 0, g = this.items.length; g > f; f++)
            this.items[f].attr(a, c);
        return this;
      }),
      (kb.clear = function() {
        for (; this.length; ) this.pop();
      }),
      (kb.splice = function(a, b, c) {
        (a = 0 > a ? N(this.length + a, 0) : a),
          (b = N(0, O(this.length - a, b)));
        var d,
          e = [],
          f = [],
          g = [];
        for (d = 2; d < arguments.length; d++) g.push(arguments[d]);
        for (d = 0; b > d; d++) f.push(this[a + d]);
        for (; d < this.length - a; d++) e.push(this[a + d]);
        var h = g.length;
        for (d = 0; d < h + e.length; d++)
          this.items[a + d] = this[a + d] = h > d ? g[d] : e[d - h];
        for (d = this.items.length = this.length -= b - h; this[d]; )
          delete this[d++];
        return new jb(f);
      }),
      (kb.exclude = function(a) {
        for (var b = 0, c = this.length; c > b; b++)
          if (this[b] == a) return this.splice(b, 1), !0;
      }),
      (kb.animate = function(a, c, d, e) {
        (b.is(d, "function") || !d) && (e = d || null);
        var f,
          g,
          h = this.items.length,
          i = h,
          j = this;
        if (!h) return this;
        e &&
          (g = function() {
            !--h && e.call(j);
          }),
          (d = b.is(d, T) ? d : g);
        var k = b.animation(a, c, d, g);
        for (f = this.items[--i].animate(k); i--; )
          this.items[i] &&
            !this.items[i].removed &&
            this.items[i].animateWith(f, k, k),
            (this.items[i] && !this.items[i].removed) || h--;
        return this;
      }),
      (kb.insertAfter = function(a) {
        for (var b = this.items.length; b--; ) this.items[b].insertAfter(a);
        return this;
      }),
      (kb.getBBox = function() {
        for (var a = [], b = [], c = [], d = [], e = this.items.length; e--; )
          if (!this.items[e].removed) {
            var f = this.items[e].getBBox();
            a.push(f.x),
              b.push(f.y),
              c.push(f.x + f.width),
              d.push(f.y + f.height);
          }
        return (
          (a = O[C](0, a)),
          (b = O[C](0, b)),
          (c = N[C](0, c)),
          (d = N[C](0, d)),
          { x: a, y: b, x2: c, y2: d, width: c - a, height: d - b }
        );
      }),
      (kb.clone = function(a) {
        a = this.paper.set();
        for (var b = 0, c = this.items.length; c > b; b++)
          a.push(this.items[b].clone());
        return a;
      }),
      (kb.toString = function() {
        return "Raphaël‘s set";
      }),
      (kb.glow = function(a) {
        var b = this.paper.set();
        return (
          this.forEach(function(c, d) {
            var e = c.glow(a);
            null != e &&
              e.forEach(function(a, c) {
                b.push(a);
              });
          }),
          b
        );
      }),
      (kb.isPointInside = function(a, b) {
        var c = !1;
        return (
          this.forEach(function(d) {
            return d.isPointInside(a, b) ? ((c = !0), !1) : void 0;
          }),
          c
        );
      }),
      (b.registerFont = function(a) {
        if (!a.face) return a;
        this.fonts = this.fonts || {};
        var b = { w: a.w, face: {}, glyphs: {} },
          c = a.face["font-family"];
        for (var d in a.face) a.face[y](d) && (b.face[d] = a.face[d]);
        if (
          (this.fonts[c] ? this.fonts[c].push(b) : (this.fonts[c] = [b]),
          !a.svg)
        ) {
          b.face["units-per-em"] = _(a.face["units-per-em"], 10);
          for (var e in a.glyphs)
            if (a.glyphs[y](e)) {
              var f = a.glyphs[e];
              if (
                ((b.glyphs[e] = {
                  w: f.w,
                  k: {},
                  d:
                    f.d &&
                    "M" +
                      f.d.replace(/[mlcxtrv]/g, function(a) {
                        return (
                          { l: "L", c: "C", x: "z", t: "m", r: "l", v: "c" }[
                            a
                          ] || "M"
                        );
                      }) +
                      "z"
                }),
                f.k)
              )
                for (var g in f.k) f[y](g) && (b.glyphs[e].k[g] = f.k[g]);
            }
        }
        return a;
      }),
      (u.getFont = function(a, c, d, e) {
        if (
          ((e = e || "normal"),
          (d = d || "normal"),
          (c =
            +c ||
            { normal: 400, bold: 700, lighter: 300, bolder: 800 }[c] ||
            400),
          b.fonts)
        ) {
          var f = b.fonts[a];
          if (!f) {
            var g = new RegExp(
              "(^|\\s)" + a.replace(/[^\w\d\s+!~.:_-]/g, F) + "(\\s|$)",
              "i"
            );
            for (var h in b.fonts)
              if (b.fonts[y](h) && g.test(h)) {
                f = b.fonts[h];
                break;
              }
          }
          var i;
          if (f)
            for (
              var j = 0, k = f.length;
              k > j &&
              ((i = f[j]),
              i.face["font-weight"] != c ||
                (i.face["font-style"] != d && i.face["font-style"]) ||
                i.face["font-stretch"] != e);
              j++
            );
          return i;
        }
      }),
      (u.print = function(a, c, d, e, f, g, h, i) {
        (g = g || "middle"),
          (h = N(O(h || 0, 1), -1)),
          (i = N(O(i || 1, 3), 1));
        var j,
          k = H(d)[I](F),
          l = 0,
          m = 0,
          n = F;
        if ((b.is(e, "string") && (e = this.getFont(e)), e)) {
          j = (f || 16) / e.face["units-per-em"];
          for (
            var o = e.face.bbox[I](v),
              p = +o[0],
              q = o[3] - o[1],
              r = 0,
              s = +o[1] + ("baseline" == g ? q + +e.face.descent : q / 2),
              t = 0,
              u = k.length;
            u > t;
            t++
          ) {
            if ("\n" == k[t]) (l = 0), (x = 0), (m = 0), (r += q * i);
            else {
              var w = (m && e.glyphs[k[t - 1]]) || {},
                x = e.glyphs[k[t]];
              (l += m ? (w.w || e.w) + ((w.k && w.k[k[t]]) || 0) + e.w * h : 0),
                (m = 1);
            }
            x &&
              x.d &&
              (n += b.transformPath(x.d, [
                "t",
                l * j,
                r * j,
                "s",
                j,
                j,
                p,
                s,
                "t",
                (a - p) / j,
                (c - s) / j
              ]));
          }
        }
        return this.path(n).attr({ fill: "#000", stroke: "none" });
      }),
      (u.add = function(a) {
        if (b.is(a, "array"))
          for (var c, d = this.set(), e = 0, f = a.length; f > e; e++)
            (c = a[e] || {}), w[y](c.type) && d.push(this[c.type]().attr(c));
        return d;
      }),
      (b.format = function(a, c) {
        var d = b.is(c, U) ? [0][D](c) : arguments;
        return (
          a &&
            b.is(a, T) &&
            d.length - 1 &&
            (a = a.replace(x, function(a, b) {
              return null == d[++b] ? F : d[b];
            })),
          a || F
        );
      }),
      (b.fullfill = (function() {
        var a = /\{([^\}]+)\}/g,
          b = /(?:(?:^|\.)(.+?)(?=\[|\.|$|\()|\[('|")(.+?)\2\])(\(\))?/g,
          c = function(a, c, d) {
            var e = d;
            return (
              c.replace(b, function(a, b, c, d, f) {
                (b = b || d),
                  e &&
                    (b in e && (e = e[b]),
                    "function" == typeof e && f && (e = e()));
              }),
              (e = (null == e || e == d ? a : e) + "")
            );
          };
        return function(b, d) {
          return String(b).replace(a, function(a, b) {
            return c(a, b, d);
          });
        };
      })()),
      (b.ninja = function() {
        return A.was ? (z.win.Raphael = A.is) : delete Raphael, b;
      }),
      (b.st = kb),
      a.on("raphael.DOMload", function() {
        t = !0;
      }),
      (function(a, c, d) {
        function e() {
          /in/.test(a.readyState) ? setTimeout(e, 9) : b.eve("raphael.DOMload");
        }
        null == a.readyState &&
          a.addEventListener &&
          (a.addEventListener(
            c,
            (d = function() {
              a.removeEventListener(c, d, !1), (a.readyState = "complete");
            }),
            !1
          ),
          (a.readyState = "loading")),
          e();
      })(document, "DOMContentLoaded"),
      b
    );
  }),
  (function(a, b) {
    "function" == typeof define && define.amd
      ? define("raphael.svg", ["raphael.core"], function(a) {
          return b(a);
        })
      : b("object" == typeof exports ? require("./raphael.core") : a.Raphael);
  })(this, function(a) {
    if (!a || a.svg) {
      var b = "hasOwnProperty",
        c = String,
        d = parseFloat,
        e = parseInt,
        f = Math,
        g = f.max,
        h = f.abs,
        i = f.pow,
        j = /[, ]+/,
        k = a.eve,
        l = "",
        m = " ",
        n = "http://www.w3.org/1999/xlink",
        o = {
          block: "M5,0 0,2.5 5,5z",
          classic: "M5,0 0,2.5 5,5 3.5,3 3.5,2z",
          diamond: "M2.5,0 5,2.5 2.5,5 0,2.5z",
          open: "M6,1 1,3.5 6,6",
          oval: "M2.5,0A2.5,2.5,0,0,1,2.5,5 2.5,2.5,0,0,1,2.5,0z"
        },
        p = {};
      a.toString = function() {
        return (
          "Your browser supports SVG.\nYou are running Raphaël " + this.version
        );
      };
      var q = function(d, e) {
          if (e) {
            "string" == typeof d && (d = q(d));
            for (var f in e)
              e[b](f) &&
                ("xlink:" == f.substring(0, 6)
                  ? d.setAttributeNS(n, f.substring(6), c(e[f]))
                  : d.setAttribute(f, c(e[f])));
          } else
            (d = a._g.doc.createElementNS("http://www.w3.org/2000/svg", d)),
              d.style && (d.style.webkitTapHighlightColor = "rgba(0,0,0,0)");
          return d;
        },
        r = function(b, e) {
          var j = "linear",
            k = b.id + e,
            m = 0.5,
            n = 0.5,
            o = b.node,
            p = b.paper,
            r = o.style,
            s = a._g.doc.getElementById(k);
          if (!s) {
            if (
              ((e = c(e).replace(a._radial_gradient, function(a, b, c) {
                if (((j = "radial"), b && c)) {
                  (m = d(b)), (n = d(c));
                  var e = 2 * (n > 0.5) - 1;
                  i(m - 0.5, 2) + i(n - 0.5, 2) > 0.25 &&
                    (n = f.sqrt(0.25 - i(m - 0.5, 2)) * e + 0.5) &&
                    0.5 != n &&
                    (n = n.toFixed(5) - 1e-5 * e);
                }
                return l;
              })),
              (e = e.split(/\s*\-\s*/)),
              "linear" == j)
            ) {
              var t = e.shift();
              if (((t = -d(t)), isNaN(t))) return null;
              var u = [0, 0, f.cos(a.rad(t)), f.sin(a.rad(t))],
                v = 1 / (g(h(u[2]), h(u[3])) || 1);
              (u[2] *= v),
                (u[3] *= v),
                u[2] < 0 && ((u[0] = -u[2]), (u[2] = 0)),
                u[3] < 0 && ((u[1] = -u[3]), (u[3] = 0));
            }
            var w = a._parseDots(e);
            if (!w) return null;
            if (
              ((k = k.replace(/[\(\)\s,\xb0#]/g, "_")),
              b.gradient &&
                k != b.gradient.id &&
                (p.defs.removeChild(b.gradient), delete b.gradient),
              !b.gradient)
            ) {
              (s = q(j + "Gradient", { id: k })),
                (b.gradient = s),
                q(
                  s,
                  "radial" == j
                    ? { fx: m, fy: n }
                    : {
                        x1: u[0],
                        y1: u[1],
                        x2: u[2],
                        y2: u[3],
                        gradientTransform: b.matrix.invert()
                      }
                ),
                p.defs.appendChild(s);
              for (var x = 0, y = w.length; y > x; x++)
                s.appendChild(
                  q("stop", {
                    offset: w[x].offset ? w[x].offset : x ? "100%" : "0%",
                    "stop-color": w[x].color || "#fff",
                    "stop-opacity": isFinite(w[x].opacity) ? w[x].opacity : 1
                  })
                );
            }
          }
          return (
            q(o, {
              fill:
                "url('" +
                document.location.origin +
                document.location.pathname +
                "#" +
                k +
                "')",
              opacity: 1,
              "fill-opacity": 1
            }),
            (r.fill = l),
            (r.opacity = 1),
            (r.fillOpacity = 1),
            1
          );
        },
        s = function(a) {
          var b = a.getBBox(1);
          q(a.pattern, {
            patternTransform:
              a.matrix.invert() + " translate(" + b.x + "," + b.y + ")"
          });
        },
        t = function(d, e, f) {
          if ("path" == d.type) {
            for (
              var g,
                h,
                i,
                j,
                k,
                m = c(e)
                  .toLowerCase()
                  .split("-"),
                n = d.paper,
                r = f ? "end" : "start",
                s = d.node,
                t = d.attrs,
                u = t["stroke-width"],
                v = m.length,
                w = "classic",
                x = 3,
                y = 3,
                z = 5;
              v--;

            )
              switch (m[v]) {
                case "block":
                case "classic":
                case "oval":
                case "diamond":
                case "open":
                case "none":
                  w = m[v];
                  break;
                case "wide":
                  y = 5;
                  break;
                case "narrow":
                  y = 2;
                  break;
                case "long":
                  x = 5;
                  break;
                case "short":
                  x = 2;
              }
            if (
              ("open" == w
                ? ((x += 2),
                  (y += 2),
                  (z += 2),
                  (i = 1),
                  (j = f ? 4 : 1),
                  (k = { fill: "none", stroke: t.stroke }))
                : ((j = i = x / 2), (k = { fill: t.stroke, stroke: "none" })),
              d._.arrows
                ? f
                  ? (d._.arrows.endPath && p[d._.arrows.endPath]--,
                    d._.arrows.endMarker && p[d._.arrows.endMarker]--)
                  : (d._.arrows.startPath && p[d._.arrows.startPath]--,
                    d._.arrows.startMarker && p[d._.arrows.startMarker]--)
                : (d._.arrows = {}),
              "none" != w)
            ) {
              var A = "raphael-marker-" + w,
                B = "raphael-marker-" + r + w + x + y + "-obj" + d.id;
              a._g.doc.getElementById(A)
                ? p[A]++
                : (n.defs.appendChild(
                    q(q("path"), { "stroke-linecap": "round", d: o[w], id: A })
                  ),
                  (p[A] = 1));
              var C,
                D = a._g.doc.getElementById(B);
              D
                ? (p[B]++, (C = D.getElementsByTagName("use")[0]))
                : ((D = q(q("marker"), {
                    id: B,
                    markerHeight: y,
                    markerWidth: x,
                    orient: "auto",
                    refX: j,
                    refY: y / 2
                  })),
                  (C = q(q("use"), {
                    "xlink:href": "#" + A,
                    transform:
                      (f ? "rotate(180 " + x / 2 + " " + y / 2 + ") " : l) +
                      "scale(" +
                      x / z +
                      "," +
                      y / z +
                      ")",
                    "stroke-width": (1 / ((x / z + y / z) / 2)).toFixed(4)
                  })),
                  D.appendChild(C),
                  n.defs.appendChild(D),
                  (p[B] = 1)),
                q(C, k);
              var E = i * ("diamond" != w && "oval" != w);
              f
                ? ((g = d._.arrows.startdx * u || 0),
                  (h = a.getTotalLength(t.path) - E * u))
                : ((g = E * u),
                  (h = a.getTotalLength(t.path) - (d._.arrows.enddx * u || 0))),
                (k = {}),
                (k["marker-" + r] = "url(#" + B + ")"),
                (h || g) && (k.d = a.getSubpath(t.path, g, h)),
                q(s, k),
                (d._.arrows[r + "Path"] = A),
                (d._.arrows[r + "Marker"] = B),
                (d._.arrows[r + "dx"] = E),
                (d._.arrows[r + "Type"] = w),
                (d._.arrows[r + "String"] = e);
            } else
              f
                ? ((g = d._.arrows.startdx * u || 0),
                  (h = a.getTotalLength(t.path) - g))
                : ((g = 0),
                  (h = a.getTotalLength(t.path) - (d._.arrows.enddx * u || 0))),
                d._.arrows[r + "Path"] &&
                  q(s, { d: a.getSubpath(t.path, g, h) }),
                delete d._.arrows[r + "Path"],
                delete d._.arrows[r + "Marker"],
                delete d._.arrows[r + "dx"],
                delete d._.arrows[r + "Type"],
                delete d._.arrows[r + "String"];
            for (k in p)
              if (p[b](k) && !p[k]) {
                var F = a._g.doc.getElementById(k);
                F && F.parentNode.removeChild(F);
              }
          }
        },
        u = {
          "-": [3, 1],
          ".": [1, 1],
          "-.": [3, 1, 1, 1],
          "-..": [3, 1, 1, 1, 1, 1],
          ". ": [1, 3],
          "- ": [4, 3],
          "--": [8, 3],
          "- .": [4, 3, 1, 3],
          "--.": [8, 3, 1, 3],
          "--..": [8, 3, 1, 3, 1, 3]
        },
        v = function(a, b, d) {
          if ((b = u[c(b).toLowerCase()])) {
            for (
              var e = a.attrs["stroke-width"] || "1",
                f =
                  { round: e, square: e, butt: 0 }[
                    a.attrs["stroke-linecap"] || d["stroke-linecap"]
                  ] || 0,
                g = [],
                h = b.length;
              h--;

            )
              g[h] = b[h] * e + (h % 2 ? 1 : -1) * f;
            q(a.node, { "stroke-dasharray": g.join(",") });
          } else q(a.node, { "stroke-dasharray": "none" });
        },
        w = function(d, f) {
          var i = d.node,
            k = d.attrs,
            m = i.style.visibility;
          i.style.visibility = "hidden";
          for (var o in f)
            if (f[b](o)) {
              if (!a._availableAttrs[b](o)) continue;
              var p = f[o];
              switch (((k[o] = p), o)) {
                case "blur":
                  d.blur(p);
                  break;
                case "title":
                  var u = i.getElementsByTagName("title");
                  if (u.length && (u = u[0])) u.firstChild.nodeValue = p;
                  else {
                    u = q("title");
                    var w = a._g.doc.createTextNode(p);
                    u.appendChild(w), i.appendChild(u);
                  }
                  break;
                case "href":
                case "target":
                  var x = i.parentNode;
                  if ("a" != x.tagName.toLowerCase()) {
                    var z = q("a");
                    x.insertBefore(z, i), z.appendChild(i), (x = z);
                  }
                  "target" == o
                    ? x.setAttributeNS(n, "show", "blank" == p ? "new" : p)
                    : x.setAttributeNS(n, o, p);
                  break;
                case "cursor":
                  i.style.cursor = p;
                  break;
                case "transform":
                  d.transform(p);
                  break;
                case "arrow-start":
                  t(d, p);
                  break;
                case "arrow-end":
                  t(d, p, 1);
                  break;
                case "clip-rect":
                  var A = c(p).split(j);
                  if (4 == A.length) {
                    d.clip &&
                      d.clip.parentNode.parentNode.removeChild(
                        d.clip.parentNode
                      );
                    var B = q("clipPath"),
                      C = q("rect");
                    (B.id = a.createUUID()),
                      q(C, { x: A[0], y: A[1], width: A[2], height: A[3] }),
                      B.appendChild(C),
                      d.paper.defs.appendChild(B),
                      q(i, { "clip-path": "url(#" + B.id + ")" }),
                      (d.clip = C);
                  }
                  if (!p) {
                    var D = i.getAttribute("clip-path");
                    if (D) {
                      var E = a._g.doc.getElementById(
                        D.replace(/(^url\(#|\)$)/g, l)
                      );
                      E && E.parentNode.removeChild(E),
                        q(i, { "clip-path": l }),
                        delete d.clip;
                    }
                  }
                  break;
                case "path":
                  "path" == d.type &&
                    (q(i, { d: p ? (k.path = a._pathToAbsolute(p)) : "M0,0" }),
                    (d._.dirty = 1),
                    d._.arrows &&
                      ("startString" in d._.arrows &&
                        t(d, d._.arrows.startString),
                      "endString" in d._.arrows &&
                        t(d, d._.arrows.endString, 1)));
                  break;
                case "width":
                  if ((i.setAttribute(o, p), (d._.dirty = 1), !k.fx)) break;
                  (o = "x"), (p = k.x);
                case "x":
                  k.fx && (p = -k.x - (k.width || 0));
                case "rx":
                  if ("rx" == o && "rect" == d.type) break;
                case "cx":
                  i.setAttribute(o, p), d.pattern && s(d), (d._.dirty = 1);
                  break;
                case "height":
                  if ((i.setAttribute(o, p), (d._.dirty = 1), !k.fy)) break;
                  (o = "y"), (p = k.y);
                case "y":
                  k.fy && (p = -k.y - (k.height || 0));
                case "ry":
                  if ("ry" == o && "rect" == d.type) break;
                case "cy":
                  i.setAttribute(o, p), d.pattern && s(d), (d._.dirty = 1);
                  break;
                case "r":
                  "rect" == d.type
                    ? q(i, { rx: p, ry: p })
                    : i.setAttribute(o, p),
                    (d._.dirty = 1);
                  break;
                case "src":
                  "image" == d.type && i.setAttributeNS(n, "href", p);
                  break;
                case "stroke-width":
                  (1 != d._.sx || 1 != d._.sy) &&
                    (p /= g(h(d._.sx), h(d._.sy)) || 1),
                    i.setAttribute(o, p),
                    k["stroke-dasharray"] && v(d, k["stroke-dasharray"], f),
                    d._.arrows &&
                      ("startString" in d._.arrows &&
                        t(d, d._.arrows.startString),
                      "endString" in d._.arrows &&
                        t(d, d._.arrows.endString, 1));
                  break;
                case "stroke-dasharray":
                  v(d, p, f);
                  break;
                case "fill":
                  var F = c(p).match(a._ISURL);
                  if (F) {
                    B = q("pattern");
                    var G = q("image");
                    (B.id = a.createUUID()),
                      q(B, {
                        x: 0,
                        y: 0,
                        patternUnits: "userSpaceOnUse",
                        height: 1,
                        width: 1
                      }),
                      q(G, { x: 0, y: 0, "xlink:href": F[1] }),
                      B.appendChild(G),
                      (function(b) {
                        a._preload(F[1], function() {
                          var a = this.offsetWidth,
                            c = this.offsetHeight;
                          q(b, { width: a, height: c }),
                            q(G, { width: a, height: c });
                        });
                      })(B),
                      d.paper.defs.appendChild(B),
                      q(i, { fill: "url(#" + B.id + ")" }),
                      (d.pattern = B),
                      d.pattern && s(d);
                    break;
                  }
                  var H = a.getRGB(p);
                  if (H.error) {
                    if (
                      ("circle" == d.type ||
                        "ellipse" == d.type ||
                        "r" != c(p).charAt()) &&
                      r(d, p)
                    ) {
                      if ("opacity" in k || "fill-opacity" in k) {
                        var I = a._g.doc.getElementById(
                          i.getAttribute("fill").replace(/^url\(#|\)$/g, l)
                        );
                        if (I) {
                          var J = I.getElementsByTagName("stop");
                          q(J[J.length - 1], {
                            "stop-opacity":
                              ("opacity" in k ? k.opacity : 1) *
                              ("fill-opacity" in k ? k["fill-opacity"] : 1)
                          });
                        }
                      }
                      (k.gradient = p), (k.fill = "none");
                      break;
                    }
                  } else
                    delete f.gradient,
                      delete k.gradient,
                      !a.is(k.opacity, "undefined") &&
                        a.is(f.opacity, "undefined") &&
                        q(i, { opacity: k.opacity }),
                      !a.is(k["fill-opacity"], "undefined") &&
                        a.is(f["fill-opacity"], "undefined") &&
                        q(i, { "fill-opacity": k["fill-opacity"] });
                  H[b]("opacity") &&
                    q(i, {
                      "fill-opacity":
                        H.opacity > 1 ? H.opacity / 100 : H.opacity
                    });
                case "stroke":
                  (H = a.getRGB(p)),
                    i.setAttribute(o, H.hex),
                    "stroke" == o &&
                      H[b]("opacity") &&
                      q(i, {
                        "stroke-opacity":
                          H.opacity > 1 ? H.opacity / 100 : H.opacity
                      }),
                    "stroke" == o &&
                      d._.arrows &&
                      ("startString" in d._.arrows &&
                        t(d, d._.arrows.startString),
                      "endString" in d._.arrows &&
                        t(d, d._.arrows.endString, 1));
                  break;
                case "gradient":
                  ("circle" == d.type ||
                    "ellipse" == d.type ||
                    "r" != c(p).charAt()) &&
                    r(d, p);

                  break;
                case "opacity":
                  k.gradient &&
                    !k[b]("stroke-opacity") &&
                    q(i, { "stroke-opacity": p > 1 ? p / 100 : p });
                case "fill-opacity":
                  if (k.gradient) {
                    (I = a._g.doc.getElementById(
                      i.getAttribute("fill").replace(/^url\(#|\)$/g, l)
                    )),
                      I &&
                        ((J = I.getElementsByTagName("stop")),
                        q(J[J.length - 1], { "stop-opacity": p }));
                    break;
                  }
                default:
                  "font-size" == o && (p = e(p, 10) + "px");
                  var K = o.replace(/(\-.)/g, function(a) {
                    return a.substring(1).toUpperCase();
                  });
                  (i.style[K] = p), (d._.dirty = 1), i.setAttribute(o, p);
              }
            }
          y(d, f), (i.style.visibility = m);
        },
        x = 1.2,
        y = function(d, f) {
          if (
            "text" == d.type &&
            (f[b]("text") ||
              f[b]("font") ||
              f[b]("font-size") ||
              f[b]("x") ||
              f[b]("y"))
          ) {
            var g = d.attrs,
              h = d.node,
              i = h.firstChild
                ? e(
                    a._g.doc.defaultView
                      .getComputedStyle(h.firstChild, l)
                      .getPropertyValue("font-size"),
                    10
                  )
                : 10;
            if (f[b]("text")) {
              for (g.text = f.text; h.firstChild; ) h.removeChild(h.firstChild);
              for (
                var j, k = c(f.text).split("\n"), m = [], n = 0, o = k.length;
                o > n;
                n++
              )
                (j = q("tspan")),
                  n && q(j, { dy: i * x, x: g.x }),
                  j.appendChild(a._g.doc.createTextNode(k[n])),
                  h.appendChild(j),
                  (m[n] = j);
            } else
              for (
                m = h.getElementsByTagName("tspan"), n = 0, o = m.length;
                o > n;
                n++
              )
                n ? q(m[n], { dy: i * x, x: g.x }) : q(m[0], { dy: 0 });
            q(h, { x: g.x, y: g.y }), (d._.dirty = 1);
            var p = d._getBBox(),
              r = g.y - (p.y + p.height / 2);
            r && a.is(r, "finite") && q(m[0], { dy: r });
          }
        },
        z = function(a) {
          return a.parentNode && "a" === a.parentNode.tagName.toLowerCase()
            ? a.parentNode
            : a;
        },
        A = function(b, c) {
          (this[0] = this.node = b),
            (b.raphael = !0),
            (this.id = a._oid++),
            (b.raphaelid = this.id),
            (this.matrix = a.matrix()),
            (this.realPath = null),
            (this.paper = c),
            (this.attrs = this.attrs || {}),
            (this._ = {
              transform: [],
              sx: 1,
              sy: 1,
              deg: 0,
              dx: 0,
              dy: 0,
              dirty: 1
            }),
            !c.bottom && (c.bottom = this),
            (this.prev = c.top),
            c.top && (c.top.next = this),
            (c.top = this),
            (this.next = null);
        },
        B = a.el;
      (A.prototype = B),
        (B.constructor = A),
        (a._engine.path = function(a, b) {
          var c = q("path");
          b.canvas && b.canvas.appendChild(c);
          var d = new A(c, b);
          return (
            (d.type = "path"),
            w(d, { fill: "none", stroke: "#000", path: a }),
            d
          );
        }),
        (B.rotate = function(a, b, e) {
          if (this.removed) return this;
          if (
            ((a = c(a).split(j)),
            a.length - 1 && ((b = d(a[1])), (e = d(a[2]))),
            (a = d(a[0])),
            null == e && (b = e),
            null == b || null == e)
          ) {
            var f = this.getBBox(1);
            (b = f.x + f.width / 2), (e = f.y + f.height / 2);
          }
          return (
            this.transform(this._.transform.concat([["r", a, b, e]])), this
          );
        }),
        (B.scale = function(a, b, e, f) {
          if (this.removed) return this;
          if (
            ((a = c(a).split(j)),
            a.length - 1 && ((b = d(a[1])), (e = d(a[2])), (f = d(a[3]))),
            (a = d(a[0])),
            null == b && (b = a),
            null == f && (e = f),
            null == e || null == f)
          )
            var g = this.getBBox(1);
          return (
            (e = null == e ? g.x + g.width / 2 : e),
            (f = null == f ? g.y + g.height / 2 : f),
            this.transform(this._.transform.concat([["s", a, b, e, f]])),
            this
          );
        }),
        (B.translate = function(a, b) {
          return this.removed
            ? this
            : ((a = c(a).split(j)),
              a.length - 1 && (b = d(a[1])),
              (a = d(a[0]) || 0),
              (b = +b || 0),
              this.transform(this._.transform.concat([["t", a, b]])),
              this);
        }),
        (B.transform = function(c) {
          var d = this._;
          if (null == c) return d.transform;
          if (
            (a._extractTransform(this, c),
            this.clip && q(this.clip, { transform: this.matrix.invert() }),
            this.pattern && s(this),
            this.node && q(this.node, { transform: this.matrix }),
            1 != d.sx || 1 != d.sy)
          ) {
            var e = this.attrs[b]("stroke-width")
              ? this.attrs["stroke-width"]
              : 1;
            this.attr({ "stroke-width": e });
          }
          return (d.transform = this.matrix.toTransformString()), this;
        }),
        (B.hide = function() {
          return this.removed || (this.node.style.display = "none"), this;
        }),
        (B.show = function() {
          return this.removed || (this.node.style.display = ""), this;
        }),
        (B.remove = function() {
          var b = z(this.node);
          if (!this.removed && b.parentNode) {
            var c = this.paper;
            c.__set__ && c.__set__.exclude(this),
              k.unbind("raphael.*.*." + this.id),
              this.gradient && c.defs.removeChild(this.gradient),
              a._tear(this, c),
              b.parentNode.removeChild(b),
              this.removeData();
            for (var d in this)
              this[d] =
                "function" == typeof this[d] ? a._removedFactory(d) : null;
            this.removed = !0;
          }
        }),
        (B._getBBox = function() {
          if ("none" == this.node.style.display) {
            this.show();
            var a = !0;
          }
          var b,
            c = !1;
          this.paper.canvas.parentElement
            ? (b = this.paper.canvas.parentElement.style)
            : this.paper.canvas.parentNode &&
              (b = this.paper.canvas.parentNode.style),
            b && "none" == b.display && ((c = !0), (b.display = ""));
          var d = {};
          try {
            d = this.node.getBBox();
          } catch (e) {
            d = {
              x: this.node.clientLeft,
              y: this.node.clientTop,
              width: this.node.clientWidth,
              height: this.node.clientHeight
            };
          } finally {
            (d = d || {}), c && (b.display = "none");
          }
          return a && this.hide(), d;
        }),
        (B.attr = function(c, d) {
          if (this.removed) return this;
          if (null == c) {
            var e = {};
            for (var f in this.attrs)
              this.attrs[b](f) && (e[f] = this.attrs[f]);
            return (
              e.gradient &&
                "none" == e.fill &&
                (e.fill = e.gradient) &&
                delete e.gradient,
              (e.transform = this._.transform),
              e
            );
          }
          if (null == d && a.is(c, "string")) {
            if ("fill" == c && "none" == this.attrs.fill && this.attrs.gradient)
              return this.attrs.gradient;
            if ("transform" == c) return this._.transform;
            for (var g = c.split(j), h = {}, i = 0, l = g.length; l > i; i++)
              (c = g[i]),
                c in this.attrs
                  ? (h[c] = this.attrs[c])
                  : a.is(this.paper.customAttributes[c], "function")
                  ? (h[c] = this.paper.customAttributes[c].def)
                  : (h[c] = a._availableAttrs[c]);
            return l - 1 ? h : h[g[0]];
          }
          if (null == d && a.is(c, "array")) {
            for (h = {}, i = 0, l = c.length; l > i; i++)
              h[c[i]] = this.attr(c[i]);
            return h;
          }
          if (null != d) {
            var m = {};
            m[c] = d;
          } else null != c && a.is(c, "object") && (m = c);
          for (var n in m) k("raphael.attr." + n + "." + this.id, this, m[n]);
          for (n in this.paper.customAttributes)
            if (
              this.paper.customAttributes[b](n) &&
              m[b](n) &&
              a.is(this.paper.customAttributes[n], "function")
            ) {
              var o = this.paper.customAttributes[n].apply(
                this,
                [].concat(m[n])
              );
              this.attrs[n] = m[n];
              for (var p in o) o[b](p) && (m[p] = o[p]);
            }
          return w(this, m), this;
        }),
        (B.toFront = function() {
          if (this.removed) return this;
          var b = z(this.node);
          b.parentNode.appendChild(b);
          var c = this.paper;
          return c.top != this && a._tofront(this, c), this;
        }),
        (B.toBack = function() {
          if (this.removed) return this;
          var b = z(this.node),
            c = b.parentNode;
          c.insertBefore(b, c.firstChild), a._toback(this, this.paper);
          this.paper;
          return this;
        }),
        (B.insertAfter = function(b) {
          if (this.removed || !b) return this;
          var c = z(this.node),
            d = z(b.node || b[b.length - 1].node);
          return (
            d.nextSibling
              ? d.parentNode.insertBefore(c, d.nextSibling)
              : d.parentNode.appendChild(c),
            a._insertafter(this, b, this.paper),
            this
          );
        }),
        (B.insertBefore = function(b) {
          if (this.removed || !b) return this;
          var c = z(this.node),
            d = z(b.node || b[0].node);
          return (
            d.parentNode.insertBefore(c, d),
            a._insertbefore(this, b, this.paper),
            this
          );
        }),
        (B.blur = function(b) {
          var c = this;
          if (0 !== +b) {
            var d = q("filter"),
              e = q("feGaussianBlur");
            (c.attrs.blur = b),
              (d.id = a.createUUID()),
              q(e, { stdDeviation: +b || 1.5 }),
              d.appendChild(e),
              c.paper.defs.appendChild(d),
              (c._blur = d),
              q(c.node, { filter: "url(#" + d.id + ")" });
          } else
            c._blur &&
              (c._blur.parentNode.removeChild(c._blur),
              delete c._blur,
              delete c.attrs.blur),
              c.node.removeAttribute("filter");
          return c;
        }),
        (a._engine.circle = function(a, b, c, d) {
          var e = q("circle");
          a.canvas && a.canvas.appendChild(e);
          var f = new A(e, a);
          return (
            (f.attrs = { cx: b, cy: c, r: d, fill: "none", stroke: "#000" }),
            (f.type = "circle"),
            q(e, f.attrs),
            f
          );
        }),
        (a._engine.rect = function(a, b, c, d, e, f) {
          var g = q("rect");
          a.canvas && a.canvas.appendChild(g);
          var h = new A(g, a);
          return (
            (h.attrs = {
              x: b,
              y: c,
              width: d,
              height: e,
              rx: f || 0,
              ry: f || 0,
              fill: "none",
              stroke: "#000"
            }),
            (h.type = "rect"),
            q(g, h.attrs),
            h
          );
        }),
        (a._engine.ellipse = function(a, b, c, d, e) {
          var f = q("ellipse");
          a.canvas && a.canvas.appendChild(f);
          var g = new A(f, a);
          return (
            (g.attrs = {
              cx: b,
              cy: c,
              rx: d,
              ry: e,
              fill: "none",
              stroke: "#000"
            }),
            (g.type = "ellipse"),
            q(f, g.attrs),
            g
          );
        }),
        (a._engine.image = function(a, b, c, d, e, f) {
          var g = q("image");
          q(g, {
            x: c,
            y: d,
            width: e,
            height: f,
            preserveAspectRatio: "none"
          }),
            g.setAttributeNS(n, "href", b),
            a.canvas && a.canvas.appendChild(g);
          var h = new A(g, a);
          return (
            (h.attrs = { x: c, y: d, width: e, height: f, src: b }),
            (h.type = "image"),
            h
          );
        }),
        (a._engine.text = function(b, c, d, e) {
          var f = q("text");
          b.canvas && b.canvas.appendChild(f);
          var g = new A(f, b);
          return (
            (g.attrs = {
              x: c,
              y: d,
              "text-anchor": "middle",
              text: e,
              "font-family": a._availableAttrs["font-family"],
              "font-size": a._availableAttrs["font-size"],
              stroke: "none",
              fill: "#000"
            }),
            (g.type = "text"),
            w(g, g.attrs),
            g
          );
        }),
        (a._engine.setSize = function(a, b) {
          return (
            (this.width = a || this.width),
            (this.height = b || this.height),
            this.canvas.setAttribute("width", this.width),
            this.canvas.setAttribute("height", this.height),
            this._viewBox && this.setViewBox.apply(this, this._viewBox),
            this
          );
        }),
        (a._engine.create = function() {
          var b = a._getContainer.apply(0, arguments),
            c = b && b.container,
            d = b.x,
            e = b.y,
            f = b.width,
            g = b.height;
          if (!c) throw new Error("SVG container not found.");
          var h,
            i = q("svg"),
            j = "overflow:hidden;";
          return (
            (d = d || 0),
            (e = e || 0),
            (f = f || 512),
            (g = g || 342),
            q(i, {
              height: g,
              version: 1.1,
              width: f,
              xmlns: "http://www.w3.org/2000/svg",
              "xmlns:xlink": "http://www.w3.org/1999/xlink"
            }),
            1 == c
              ? ((i.style.cssText =
                  j + "position:absolute;left:" + d + "px;top:" + e + "px"),
                a._g.doc.body.appendChild(i),
                (h = 1))
              : ((i.style.cssText = j + "position:relative"),
                c.firstChild
                  ? c.insertBefore(i, c.firstChild)
                  : c.appendChild(i)),
            (c = new a._Paper()),
            (c.width = f),
            (c.height = g),
            (c.canvas = i),
            c.clear(),
            (c._left = c._top = 0),
            h && (c.renderfix = function() {}),
            c.renderfix(),
            c
          );
        }),
        (a._engine.setViewBox = function(a, b, c, d, e) {
          k("raphael.setViewBox", this, this._viewBox, [a, b, c, d, e]);
          var f,
            h,
            i = this.getSize(),
            j = g(c / i.width, d / i.height),
            l = this.top,
            n = e ? "xMidYMid meet" : "xMinYMin";
          for (
            null == a
              ? (this._vbSize && (j = 1),
                delete this._vbSize,
                (f = "0 0 " + this.width + m + this.height))
              : ((this._vbSize = j), (f = a + m + b + m + c + m + d)),
              q(this.canvas, { viewBox: f, preserveAspectRatio: n });
            j && l;

          )
            (h = "stroke-width" in l.attrs ? l.attrs["stroke-width"] : 1),
              l.attr({ "stroke-width": h }),
              (l._.dirty = 1),
              (l._.dirtyT = 1),
              (l = l.prev);
          return (this._viewBox = [a, b, c, d, !!e]), this;
        }),
        (a.prototype.renderfix = function() {
          var a,
            b = this.canvas,
            c = b.style;
          try {
            a = b.getScreenCTM() || b.createSVGMatrix();
          } catch (d) {
            a = b.createSVGMatrix();
          }
          var e = -a.e % 1,
            f = -a.f % 1;
          (e || f) &&
            (e &&
              ((this._left = (this._left + e) % 1),
              (c.left = this._left + "px")),
            f &&
              ((this._top = (this._top + f) % 1), (c.top = this._top + "px")));
        }),
        (a.prototype.clear = function() {
          a.eve("raphael.clear", this);
          for (var b = this.canvas; b.firstChild; ) b.removeChild(b.firstChild);
          (this.bottom = this.top = null),
            (this.desc = q("desc")).appendChild(
              a._g.doc.createTextNode("Created with Raphaël " + a.version)
            ),
            b.appendChild(this.desc),
            b.appendChild((this.defs = q("defs")));
        }),
        (a.prototype.remove = function() {
          k("raphael.remove", this),
            this.canvas.parentNode &&
              this.canvas.parentNode.removeChild(this.canvas);
          for (var b in this)
            this[b] =
              "function" == typeof this[b] ? a._removedFactory(b) : null;
        });
      var C = a.st;
      for (var D in B)
        B[b](D) &&
          !C[b](D) &&
          (C[D] = (function(a) {
            return function() {
              var b = arguments;
              return this.forEach(function(c) {
                c[a].apply(c, b);
              });
            };
          })(D));
    }
  }),
  (function(a, b) {
    "function" == typeof define && define.amd
      ? define("raphael.vml", ["raphael.core"], function(a) {
          return b(a);
        })
      : b("object" == typeof exports ? require("./raphael.core") : a.Raphael);
  })(this, function(a) {
    if (!a || a.vml) {
      var b = "hasOwnProperty",
        c = String,
        d = parseFloat,
        e = Math,
        f = e.round,
        g = e.max,
        h = e.min,
        i = e.abs,
        j = "fill",
        k = /[, ]+/,
        l = a.eve,
        m = " progid:DXImageTransform.Microsoft",
        n = " ",
        o = "",
        p = { M: "m", L: "l", C: "c", Z: "x", m: "t", l: "r", c: "v", z: "x" },
        q = /([clmz]),?([^clmz]*)/gi,
        r = / progid:\S+Blur\([^\)]+\)/g,
        s = /-?[^,\s-]+/g,
        t =
          "position:absolute;left:0;top:0;width:1px;height:1px;behavior:url(#default#VML)",
        u = 21600,
        v = { path: 1, rect: 1, image: 1 },
        w = { circle: 1, ellipse: 1 },
        x = function(b) {
          var d = /[ahqstv]/gi,
            e = a._pathToAbsolute;
          if (
            (c(b).match(d) && (e = a._path2curve),
            (d = /[clmz]/g),
            e == a._pathToAbsolute && !c(b).match(d))
          ) {
            var g = c(b).replace(q, function(a, b, c) {
              var d = [],
                e = "m" == b.toLowerCase(),
                g = p[b];
              return (
                c.replace(s, function(a) {
                  e &&
                    2 == d.length &&
                    ((g += d + p["m" == b ? "l" : "L"]), (d = [])),
                    d.push(f(a * u));
                }),
                g + d
              );
            });
            return g;
          }
          var h,
            i,
            j = e(b);
          g = [];
          for (var k = 0, l = j.length; l > k; k++) {
            (h = j[k]), (i = j[k][0].toLowerCase()), "z" == i && (i = "x");
            for (var m = 1, r = h.length; r > m; m++)
              i += f(h[m] * u) + (m != r - 1 ? "," : o);
            g.push(i);
          }
          return g.join(n);
        },
        y = function(b, c, d) {
          var e = a.matrix();
          return e.rotate(-b, 0.5, 0.5), { dx: e.x(c, d), dy: e.y(c, d) };
        },
        z = function(a, b, c, d, e, f) {
          var g = a._,
            h = a.matrix,
            k = g.fillpos,
            l = a.node,
            m = l.style,
            o = 1,
            p = "",
            q = u / b,
            r = u / c;
          if (((m.visibility = "hidden"), b && c)) {
            if (
              ((l.coordsize = i(q) + n + i(r)),
              (m.rotation = f * (0 > b * c ? -1 : 1)),
              f)
            ) {
              var s = y(f, d, e);
              (d = s.dx), (e = s.dy);
            }
            if (
              (0 > b && (p += "x"),
              0 > c && (p += " y") && (o = -1),
              (m.flip = p),
              (l.coordorigin = d * -q + n + e * -r),
              k || g.fillsize)
            ) {
              var t = l.getElementsByTagName(j);
              (t = t && t[0]),
                l.removeChild(t),
                k &&
                  ((s = y(f, h.x(k[0], k[1]), h.y(k[0], k[1]))),
                  (t.position = s.dx * o + n + s.dy * o)),
                g.fillsize &&
                  (t.size = g.fillsize[0] * i(b) + n + g.fillsize[1] * i(c)),
                l.appendChild(t);
            }
            m.visibility = "visible";
          }
        };
      a.toString = function() {
        return (
          "Your browser doesn’t support SVG. Falling down to VML.\nYou are running Raphaël " +
          this.version
        );
      };
      var A = function(a, b, d) {
          for (
            var e = c(b)
                .toLowerCase()
                .split("-"),
              f = d ? "end" : "start",
              g = e.length,
              h = "classic",
              i = "medium",
              j = "medium";
            g--;

          )
            switch (e[g]) {
              case "block":
              case "classic":
              case "oval":
              case "diamond":
              case "open":
              case "none":
                h = e[g];
                break;
              case "wide":
              case "narrow":
                j = e[g];
                break;
              case "long":
              case "short":
                i = e[g];
            }
          var k = a.node.getElementsByTagName("stroke")[0];
          (k[f + "arrow"] = h),
            (k[f + "arrowlength"] = i),
            (k[f + "arrowwidth"] = j);
        },
        B = function(e, i) {
          e.attrs = e.attrs || {};
          var l = e.node,
            m = e.attrs,
            p = l.style,
            q =
              v[e.type] &&
              (i.x != m.x ||
                i.y != m.y ||
                i.width != m.width ||
                i.height != m.height ||
                i.cx != m.cx ||
                i.cy != m.cy ||
                i.rx != m.rx ||
                i.ry != m.ry ||
                i.r != m.r),
            r =
              w[e.type] &&
              (m.cx != i.cx ||
                m.cy != i.cy ||
                m.r != i.r ||
                m.rx != i.rx ||
                m.ry != i.ry),
            s = e;
          for (var t in i) i[b](t) && (m[t] = i[t]);
          if (
            (q && ((m.path = a._getPath[e.type](e)), (e._.dirty = 1)),
            i.href && (l.href = i.href),
            i.title && (l.title = i.title),
            i.target && (l.target = i.target),
            i.cursor && (p.cursor = i.cursor),
            "blur" in i && e.blur(i.blur),
            ((i.path && "path" == e.type) || q) &&
              ((l.path = x(
                ~c(m.path)
                  .toLowerCase()
                  .indexOf("r")
                  ? a._pathToAbsolute(m.path)
                  : m.path
              )),
              (e._.dirty = 1),
              "image" == e.type &&
                ((e._.fillpos = [m.x, m.y]),
                (e._.fillsize = [m.width, m.height]),
                z(e, 1, 1, 0, 0, 0))),
            "transform" in i && e.transform(i.transform),
            r)
          ) {
            var y = +m.cx,
              B = +m.cy,
              D = +m.rx || +m.r || 0,
              E = +m.ry || +m.r || 0;
            (l.path = a.format(
              "ar{0},{1},{2},{3},{4},{1},{4},{1}x",
              f((y - D) * u),
              f((B - E) * u),
              f((y + D) * u),
              f((B + E) * u),
              f(y * u)
            )),
              (e._.dirty = 1);
          }
          if ("clip-rect" in i) {
            var G = c(i["clip-rect"]).split(k);
            if (4 == G.length) {
              (G[2] = +G[2] + +G[0]), (G[3] = +G[3] + +G[1]);
              var H = l.clipRect || a._g.doc.createElement("div"),
                I = H.style;
              (I.clip = a.format("rect({1}px {2}px {3}px {0}px)", G)),
                l.clipRect ||
                  ((I.position = "absolute"),
                  (I.top = 0),
                  (I.left = 0),
                  (I.width = e.paper.width + "px"),
                  (I.height = e.paper.height + "px"),
                  l.parentNode.insertBefore(H, l),
                  H.appendChild(l),
                  (l.clipRect = H));
            }
            i["clip-rect"] || (l.clipRect && (l.clipRect.style.clip = "auto"));
          }
          if (e.textpath) {
            var J = e.textpath.style;
            i.font && (J.font = i.font),
              i["font-family"] &&
                (J.fontFamily =
                  '"' +
                  i["font-family"].split(",")[0].replace(/^['"]+|['"]+$/g, o) +
                  '"'),
              i["font-size"] && (J.fontSize = i["font-size"]),
              i["font-weight"] && (J.fontWeight = i["font-weight"]),
              i["font-style"] && (J.fontStyle = i["font-style"]);
          }
          if (
            ("arrow-start" in i && A(s, i["arrow-start"]),
            "arrow-end" in i && A(s, i["arrow-end"], 1),
            null != i.opacity ||
              null != i["stroke-width"] ||
              null != i.fill ||
              null != i.src ||
              null != i.stroke ||
              null != i["stroke-width"] ||
              null != i["stroke-opacity"] ||
              null != i["fill-opacity"] ||
              null != i["stroke-dasharray"] ||
              null != i["stroke-miterlimit"] ||
              null != i["stroke-linejoin"] ||
              null != i["stroke-linecap"])
          ) {
            var K = l.getElementsByTagName(j),
              L = !1;
            if (
              ((K = K && K[0]),
              !K && (L = K = F(j)),
              "image" == e.type && i.src && (K.src = i.src),
              i.fill && (K.on = !0),
              (null == K.on || "none" == i.fill || null === i.fill) &&
                (K.on = !1),
              K.on && i.fill)
            ) {
              var M = c(i.fill).match(a._ISURL);
              if (M) {
                K.parentNode == l && l.removeChild(K),
                  (K.rotate = !0),
                  (K.src = M[1]),
                  (K.type = "tile");
                var N = e.getBBox(1);
                (K.position = N.x + n + N.y),
                  (e._.fillpos = [N.x, N.y]),
                  a._preload(M[1], function() {
                    e._.fillsize = [this.offsetWidth, this.offsetHeight];
                  });
              } else
                (K.color = a.getRGB(i.fill).hex),
                  (K.src = o),
                  (K.type = "solid"),
                  a.getRGB(i.fill).error &&
                    (s.type in { circle: 1, ellipse: 1 } ||
                      "r" != c(i.fill).charAt()) &&
                    C(s, i.fill, K) &&
                    ((m.fill = "none"), (m.gradient = i.fill), (K.rotate = !1));
            }
            if ("fill-opacity" in i || "opacity" in i) {
              var O =
                ((+m["fill-opacity"] + 1 || 2) - 1) *
                ((+m.opacity + 1 || 2) - 1) *
                ((+a.getRGB(i.fill).o + 1 || 2) - 1);
              (O = h(g(O, 0), 1)), (K.opacity = O), K.src && (K.color = "none");
            }
            l.appendChild(K);
            var P =
                l.getElementsByTagName("stroke") &&
                l.getElementsByTagName("stroke")[0],
              Q = !1;
            !P && (Q = P = F("stroke")),
              ((i.stroke && "none" != i.stroke) ||
                i["stroke-width"] ||
                null != i["stroke-opacity"] ||
                i["stroke-dasharray"] ||
                i["stroke-miterlimit"] ||
                i["stroke-linejoin"] ||
                i["stroke-linecap"]) &&
                (P.on = !0),
              ("none" == i.stroke ||
                null === i.stroke ||
                null == P.on ||
                0 == i.stroke ||
                0 == i["stroke-width"]) &&
                (P.on = !1);
            var R = a.getRGB(i.stroke);
            P.on && i.stroke && (P.color = R.hex),
              (O =
                ((+m["stroke-opacity"] + 1 || 2) - 1) *
                ((+m.opacity + 1 || 2) - 1) *
                ((+R.o + 1 || 2) - 1));
            var S = 0.75 * (d(i["stroke-width"]) || 1);
            if (
              ((O = h(g(O, 0), 1)),
              null == i["stroke-width"] && (S = m["stroke-width"]),
              i["stroke-width"] && (P.weight = S),
              S && 1 > S && (O *= S) && (P.weight = 1),
              (P.opacity = O),
              i["stroke-linejoin"] &&
                (P.joinstyle = i["stroke-linejoin"] || "miter"),
              (P.miterlimit = i["stroke-miterlimit"] || 8),
              i["stroke-linecap"] &&
                (P.endcap =
                  "butt" == i["stroke-linecap"]
                    ? "flat"
                    : "square" == i["stroke-linecap"]
                    ? "square"
                    : "round"),
              "stroke-dasharray" in i)
            ) {
              var T = {
                "-": "shortdash",
                ".": "shortdot",
                "-.": "shortdashdot",
                "-..": "shortdashdotdot",
                ". ": "dot",
                "- ": "dash",
                "--": "longdash",
                "- .": "dashdot",
                "--.": "longdashdot",
                "--..": "longdashdotdot"
              };
              P.dashstyle = T[b](i["stroke-dasharray"])
                ? T[i["stroke-dasharray"]]
                : o;
            }
            Q && l.appendChild(P);
          }
          if ("text" == s.type) {
            s.paper.canvas.style.display = o;
            var U = s.paper.span,
              V = 100,
              W = m.font && m.font.match(/\d+(?:\.\d*)?(?=px)/);
            (p = U.style),
              m.font && (p.font = m.font),
              m["font-family"] && (p.fontFamily = m["font-family"]),
              m["font-weight"] && (p.fontWeight = m["font-weight"]),
              m["font-style"] && (p.fontStyle = m["font-style"]),
              (W = d(m["font-size"] || (W && W[0])) || 10),
              (p.fontSize = W * V + "px"),
              s.textpath.string &&
                (U.innerHTML = c(s.textpath.string)
                  .replace(/</g, "&#60;")
                  .replace(/&/g, "&#38;")
                  .replace(/\n/g, "<br>"));
            var X = U.getBoundingClientRect();
            (s.W = m.w = (X.right - X.left) / V),
              (s.H = m.h = (X.bottom - X.top) / V),
              (s.X = m.x),
              (s.Y = m.y + s.H / 2),
              ("x" in i || "y" in i) &&
                (s.path.v = a.format(
                  "m{0},{1}l{2},{1}",
                  f(m.x * u),
                  f(m.y * u),
                  f(m.x * u) + 1
                ));
            for (
              var Y = [
                  "x",
                  "y",
                  "text",
                  "font",
                  "font-family",
                  "font-weight",
                  "font-style",
                  "font-size"
                ],
                Z = 0,
                $ = Y.length;
              $ > Z;
              Z++
            )
              if (Y[Z] in i) {
                s._.dirty = 1;
                break;
              }
            switch (m["text-anchor"]) {
              case "start":
                (s.textpath.style["v-text-align"] = "left"), (s.bbx = s.W / 2);
                break;
              case "end":
                (s.textpath.style["v-text-align"] = "right"),
                  (s.bbx = -s.W / 2);
                break;
              default:
                (s.textpath.style["v-text-align"] = "center"), (s.bbx = 0);
            }
            s.textpath.style["v-text-kern"] = !0;
          }
        },
        C = function(b, f, g) {
          b.attrs = b.attrs || {};
          var h = (b.attrs, Math.pow),
            i = "linear",
            j = ".5 .5";
          if (
            ((b.attrs.gradient = f),
            (f = c(f).replace(a._radial_gradient, function(a, b, c) {
              return (
                (i = "radial"),
                b &&
                  c &&
                  ((b = d(b)),
                  (c = d(c)),
                  h(b - 0.5, 2) + h(c - 0.5, 2) > 0.25 &&
                    (c =
                      e.sqrt(0.25 - h(b - 0.5, 2)) * (2 * (c > 0.5) - 1) + 0.5),
                  (j = b + n + c)),
                o
              );
            })),
            (f = f.split(/\s*\-\s*/)),
            "linear" == i)
          ) {
            var k = f.shift();
            if (((k = -d(k)), isNaN(k))) return null;
          }
          var l = a._parseDots(f);
          if (!l) return null;
          if (((b = b.shape || b.node), l.length)) {
            b.removeChild(g),
              (g.on = !0),
              (g.method = "none"),
              (g.color = l[0].color),
              (g.color2 = l[l.length - 1].color);
            for (var m = [], p = 0, q = l.length; q > p; p++)
              l[p].offset && m.push(l[p].offset + n + l[p].color);
            (g.colors = m.length ? m.join() : "0% " + g.color),
              "radial" == i
                ? ((g.type = "gradientTitle"),
                  (g.focus = "100%"),
                  (g.focussize = "0 0"),
                  (g.focusposition = j),
                  (g.angle = 0))
                : ((g.type = "gradient"), (g.angle = (270 - k) % 360)),
              b.appendChild(g);
          }
          return 1;
        },
        D = function(b, c) {
          (this[0] = this.node = b),
            (b.raphael = !0),
            (this.id = a._oid++),
            (b.raphaelid = this.id),
            (this.X = 0),
            (this.Y = 0),
            (this.attrs = {}),
            (this.paper = c),
            (this.matrix = a.matrix()),
            (this._ = {
              transform: [],
              sx: 1,
              sy: 1,
              dx: 0,
              dy: 0,
              deg: 0,
              dirty: 1,
              dirtyT: 1
            }),
            !c.bottom && (c.bottom = this),
            (this.prev = c.top),
            c.top && (c.top.next = this),
            (c.top = this),
            (this.next = null);
        },
        E = a.el;
      (D.prototype = E),
        (E.constructor = D),
        (E.transform = function(b) {
          if (null == b) return this._.transform;
          var d,
            e = this.paper._viewBoxShift,
            f = e ? "s" + [e.scale, e.scale] + "-1-1t" + [e.dx, e.dy] : o;
          e && (d = b = c(b).replace(/\.{3}|\u2026/g, this._.transform || o)),
            a._extractTransform(this, f + b);
          var g,
            h = this.matrix.clone(),
            i = this.skew,
            j = this.node,
            k = ~c(this.attrs.fill).indexOf("-"),
            l = !c(this.attrs.fill).indexOf("url(");
          if ((h.translate(1, 1), l || k || "image" == this.type))
            if (
              ((i.matrix = "1 0 0 1"),
              (i.offset = "0 0"),
              (g = h.split()),
              (k && g.noRotation) || !g.isSimple)
            ) {
              j.style.filter = h.toFilter();
              var m = this.getBBox(),
                p = this.getBBox(1),
                q = m.x - p.x,
                r = m.y - p.y;
              (j.coordorigin = q * -u + n + r * -u), z(this, 1, 1, q, r, 0);
            } else
              (j.style.filter = o),
                z(this, g.scalex, g.scaley, g.dx, g.dy, g.rotate);
          else (j.style.filter = o), (i.matrix = c(h)), (i.offset = h.offset());
          return (
            null !== d &&
              ((this._.transform = d), a._extractTransform(this, d)),
            this
          );
        }),
        (E.rotate = function(a, b, e) {
          if (this.removed) return this;
          if (null != a) {
            if (
              ((a = c(a).split(k)),
              a.length - 1 && ((b = d(a[1])), (e = d(a[2]))),
              (a = d(a[0])),
              null == e && (b = e),
              null == b || null == e)
            ) {
              var f = this.getBBox(1);
              (b = f.x + f.width / 2), (e = f.y + f.height / 2);
            }
            return (
              (this._.dirtyT = 1),
              this.transform(this._.transform.concat([["r", a, b, e]])),
              this
            );
          }
        }),
        (E.translate = function(a, b) {
          return this.removed
            ? this
            : ((a = c(a).split(k)),
              a.length - 1 && (b = d(a[1])),
              (a = d(a[0]) || 0),
              (b = +b || 0),
              this._.bbox && ((this._.bbox.x += a), (this._.bbox.y += b)),
              this.transform(this._.transform.concat([["t", a, b]])),
              this);
        }),
        (E.scale = function(a, b, e, f) {
          if (this.removed) return this;
          if (
            ((a = c(a).split(k)),
            a.length - 1 &&
              ((b = d(a[1])),
              (e = d(a[2])),
              (f = d(a[3])),
              isNaN(e) && (e = null),
              isNaN(f) && (f = null)),
            (a = d(a[0])),
            null == b && (b = a),
            null == f && (e = f),
            null == e || null == f)
          )
            var g = this.getBBox(1);
          return (
            (e = null == e ? g.x + g.width / 2 : e),
            (f = null == f ? g.y + g.height / 2 : f),
            this.transform(this._.transform.concat([["s", a, b, e, f]])),
            (this._.dirtyT = 1),
            this
          );
        }),
        (E.hide = function() {
          return !this.removed && (this.node.style.display = "none"), this;
        }),
        (E.show = function() {
          return !this.removed && (this.node.style.display = o), this;
        }),
        (E.auxGetBBox = a.el.getBBox),
        (E.getBBox = function() {
          var a = this.auxGetBBox();
          if (this.paper && this.paper._viewBoxShift) {
            var b = {},
              c = 1 / this.paper._viewBoxShift.scale;
            return (
              (b.x = a.x - this.paper._viewBoxShift.dx),
              (b.x *= c),
              (b.y = a.y - this.paper._viewBoxShift.dy),
              (b.y *= c),
              (b.width = a.width * c),
              (b.height = a.height * c),
              (b.x2 = b.x + b.width),
              (b.y2 = b.y + b.height),
              b
            );
          }
          return a;
        }),
        (E._getBBox = function() {
          return this.removed
            ? {}
            : {
                x: this.X + (this.bbx || 0) - this.W / 2,
                y: this.Y - this.H,
                width: this.W,
                height: this.H
              };
        }),
        (E.remove = function() {
          if (!this.removed && this.node.parentNode) {
            this.paper.__set__ && this.paper.__set__.exclude(this),
              a.eve.unbind("raphael.*.*." + this.id),
              a._tear(this, this.paper),
              this.node.parentNode.removeChild(this.node),
              this.shape && this.shape.parentNode.removeChild(this.shape);
            for (var b in this)
              this[b] =
                "function" == typeof this[b] ? a._removedFactory(b) : null;
            this.removed = !0;
          }
        }),
        (E.attr = function(c, d) {
          if (this.removed) return this;
          if (null == c) {
            var e = {};
            for (var f in this.attrs)
              this.attrs[b](f) && (e[f] = this.attrs[f]);
            return (
              e.gradient &&
                "none" == e.fill &&
                (e.fill = e.gradient) &&
                delete e.gradient,
              (e.transform = this._.transform),
              e
            );
          }
          if (null == d && a.is(c, "string")) {
            if (c == j && "none" == this.attrs.fill && this.attrs.gradient)
              return this.attrs.gradient;
            for (var g = c.split(k), h = {}, i = 0, m = g.length; m > i; i++)
              (c = g[i]),
                c in this.attrs
                  ? (h[c] = this.attrs[c])
                  : a.is(this.paper.customAttributes[c], "function")
                  ? (h[c] = this.paper.customAttributes[c].def)
                  : (h[c] = a._availableAttrs[c]);
            return m - 1 ? h : h[g[0]];
          }
          if (this.attrs && null == d && a.is(c, "array")) {
            for (h = {}, i = 0, m = c.length; m > i; i++)
              h[c[i]] = this.attr(c[i]);
            return h;
          }
          var n;
          null != d && ((n = {}), (n[c] = d)),
            null == d && a.is(c, "object") && (n = c);
          for (var o in n) l("raphael.attr." + o + "." + this.id, this, n[o]);
          if (n) {
            for (o in this.paper.customAttributes)
              if (
                this.paper.customAttributes[b](o) &&
                n[b](o) &&
                a.is(this.paper.customAttributes[o], "function")
              ) {
                var p = this.paper.customAttributes[o].apply(
                  this,
                  [].concat(n[o])
                );
                this.attrs[o] = n[o];
                for (var q in p) p[b](q) && (n[q] = p[q]);
              }
            n.text && "text" == this.type && (this.textpath.string = n.text),
              B(this, n);
          }
          return this;
        }),
        (E.toFront = function() {
          return (
            !this.removed && this.node.parentNode.appendChild(this.node),
            this.paper &&
              this.paper.top != this &&
              a._tofront(this, this.paper),
            this
          );
        }),
        (E.toBack = function() {
          return this.removed
            ? this
            : (this.node.parentNode.firstChild != this.node &&
                (this.node.parentNode.insertBefore(
                  this.node,
                  this.node.parentNode.firstChild
                ),
                a._toback(this, this.paper)),
              this);
        }),
        (E.insertAfter = function(b) {
          return this.removed
            ? this
            : (b.constructor == a.st.constructor && (b = b[b.length - 1]),
              b.node.nextSibling
                ? b.node.parentNode.insertBefore(this.node, b.node.nextSibling)
                : b.node.parentNode.appendChild(this.node),
              a._insertafter(this, b, this.paper),
              this);
        }),
        (E.insertBefore = function(b) {
          return this.removed
            ? this
            : (b.constructor == a.st.constructor && (b = b[0]),
              b.node.parentNode.insertBefore(this.node, b.node),
              a._insertbefore(this, b, this.paper),
              this);
        }),
        (E.blur = function(b) {
          var c = this.node.runtimeStyle,
            d = c.filter;
          return (
            (d = d.replace(r, o)),
            0 !== +b
              ? ((this.attrs.blur = b),
                (c.filter =
                  d + n + m + ".Blur(pixelradius=" + (+b || 1.5) + ")"),
                (c.margin = a.format("-{0}px 0 0 -{0}px", f(+b || 1.5))))
              : ((c.filter = d), (c.margin = 0), delete this.attrs.blur),
            this
          );
        }),
        (a._engine.path = function(a, b) {
          var c = F("shape");
          (c.style.cssText = t),
            (c.coordsize = u + n + u),
            (c.coordorigin = b.coordorigin);
          var d = new D(c, b),
            e = { fill: "none", stroke: "#000" };
          a && (e.path = a),
            (d.type = "path"),
            (d.path = []),
            (d.Path = o),
            B(d, e),
            b.canvas.appendChild(c);
          var f = F("skew");
          return (f.on = !0), c.appendChild(f), (d.skew = f), d.transform(o), d;
        }),
        (a._engine.rect = function(b, c, d, e, f, g) {
          var h = a._rectPath(c, d, e, f, g),
            i = b.path(h),
            j = i.attrs;
          return (
            (i.X = j.x = c),
            (i.Y = j.y = d),
            (i.W = j.width = e),
            (i.H = j.height = f),
            (j.r = g),
            (j.path = h),
            (i.type = "rect"),
            i
          );
        }),
        (a._engine.ellipse = function(a, b, c, d, e) {
          {
            var f = a.path();
            f.attrs;
          }
          return (
            (f.X = b - d),
            (f.Y = c - e),
            (f.W = 2 * d),
            (f.H = 2 * e),
            (f.type = "ellipse"),
            B(f, { cx: b, cy: c, rx: d, ry: e }),
            f
          );
        }),
        (a._engine.circle = function(a, b, c, d) {
          {
            var e = a.path();
            e.attrs;
          }
          return (
            (e.X = b - d),
            (e.Y = c - d),
            (e.W = e.H = 2 * d),
            (e.type = "circle"),
            B(e, { cx: b, cy: c, r: d }),
            e
          );
        }),
        (a._engine.image = function(b, c, d, e, f, g) {
          var h = a._rectPath(d, e, f, g),
            i = b.path(h).attr({ stroke: "none" }),
            k = i.attrs,
            l = i.node,
            m = l.getElementsByTagName(j)[0];
          return (
            (k.src = c),
            (i.X = k.x = d),
            (i.Y = k.y = e),
            (i.W = k.width = f),
            (i.H = k.height = g),
            (k.path = h),
            (i.type = "image"),
            m.parentNode == l && l.removeChild(m),
            (m.rotate = !0),
            (m.src = c),
            (m.type = "tile"),
            (i._.fillpos = [d, e]),
            (i._.fillsize = [f, g]),
            l.appendChild(m),
            z(i, 1, 1, 0, 0, 0),
            i
          );
        }),
        (a._engine.text = function(b, d, e, g) {
          var h = F("shape"),
            i = F("path"),
            j = F("textpath");
          (d = d || 0),
            (e = e || 0),
            (g = g || ""),
            (i.v = a.format(
              "m{0},{1}l{2},{1}",
              f(d * u),
              f(e * u),
              f(d * u) + 1
            )),
            (i.textpathok = !0),
            (j.string = c(g)),
            (j.on = !0),
            (h.style.cssText = t),
            (h.coordsize = u + n + u),
            (h.coordorigin = "0 0");
          var k = new D(h, b),
            l = {
              fill: "#000",
              stroke: "none",
              font: a._availableAttrs.font,
              text: g
            };
          (k.shape = h),
            (k.path = i),
            (k.textpath = j),
            (k.type = "text"),
            (k.attrs.text = c(g)),
            (k.attrs.x = d),
            (k.attrs.y = e),
            (k.attrs.w = 1),
            (k.attrs.h = 1),
            B(k, l),
            h.appendChild(j),
            h.appendChild(i),
            b.canvas.appendChild(h);
          var m = F("skew");
          return (m.on = !0), h.appendChild(m), (k.skew = m), k.transform(o), k;
        }),
        (a._engine.setSize = function(b, c) {
          var d = this.canvas.style;
          return (
            (this.width = b),
            (this.height = c),
            b == +b && (b += "px"),
            c == +c && (c += "px"),
            (d.width = b),
            (d.height = c),
            (d.clip = "rect(0 " + b + " " + c + " 0)"),
            this._viewBox && a._engine.setViewBox.apply(this, this._viewBox),
            this
          );
        }),
        (a._engine.setViewBox = function(b, c, d, e, f) {
          a.eve("raphael.setViewBox", this, this._viewBox, [b, c, d, e, f]);
          var g,
            h,
            i = this.getSize(),
            j = i.width,
            k = i.height;
          return (
            f &&
              ((g = k / e),
              (h = j / d),
              j > d * g && (b -= (j - d * g) / 2 / g),
              k > e * h && (c -= (k - e * h) / 2 / h)),
            (this._viewBox = [b, c, d, e, !!f]),
            (this._viewBoxShift = { dx: -b, dy: -c, scale: i }),
            this.forEach(function(a) {
              a.transform("...");
            }),
            this
          );
        });
      var F;
      (a._engine.initWin = function(a) {
        var b = a.document;
        b.styleSheets.length < 31
          ? b.createStyleSheet().addRule(".rvml", "behavior:url(#default#VML)")
          : b.styleSheets[0].addRule(".rvml", "behavior:url(#default#VML)");
        try {
          !b.namespaces.rvml &&
            b.namespaces.add("rvml", "urn:schemas-microsoft-com:vml"),
            (F = function(a) {
              return b.createElement("<rvml:" + a + ' class="rvml">');
            });
        } catch (c) {
          F = function(a) {
            return b.createElement(
              "<" + a + ' xmlns="urn:schemas-microsoft.com:vml" class="rvml">'
            );
          };
        }
      }),
        a._engine.initWin(a._g.win),
        (a._engine.create = function() {
          var b = a._getContainer.apply(0, arguments),
            c = b.container,
            d = b.height,
            e = b.width,
            f = b.x,
            g = b.y;
          if (!c) throw new Error("VML container not found.");
          var h = new a._Paper(),
            i = (h.canvas = a._g.doc.createElement("div")),
            j = i.style;
          return (
            (f = f || 0),
            (g = g || 0),
            (e = e || 512),
            (d = d || 342),
            (h.width = e),
            (h.height = d),
            e == +e && (e += "px"),
            d == +d && (d += "px"),
            (h.coordsize = 1e3 * u + n + 1e3 * u),
            (h.coordorigin = "0 0"),
            (h.span = a._g.doc.createElement("span")),
            (h.span.style.cssText =
              "position:absolute;left:-9999em;top:-9999em;padding:0;margin:0;line-height:1;"),
            i.appendChild(h.span),
            (j.cssText = a.format(
              "top:0;left:0;width:{0};height:{1};display:inline-block;position:relative;clip:rect(0 {0} {1} 0);overflow:hidden",
              e,
              d
            )),
            1 == c
              ? (a._g.doc.body.appendChild(i),
                (j.left = f + "px"),
                (j.top = g + "px"),
                (j.position = "absolute"))
              : c.firstChild
              ? c.insertBefore(i, c.firstChild)
              : c.appendChild(i),
            (h.renderfix = function() {}),
            h
          );
        }),
        (a.prototype.clear = function() {
          a.eve("raphael.clear", this),
            (this.canvas.innerHTML = o),
            (this.span = a._g.doc.createElement("span")),
            (this.span.style.cssText =
              "position:absolute;left:-9999em;top:-9999em;padding:0;margin:0;line-height:1;display:inline;"),
            this.canvas.appendChild(this.span),
            (this.bottom = this.top = null);
        }),
        (a.prototype.remove = function() {
          a.eve("raphael.remove", this),
            this.canvas.parentNode.removeChild(this.canvas);
          for (var b in this)
            this[b] =
              "function" == typeof this[b] ? a._removedFactory(b) : null;
          return !0;
        });
      var G = a.st;
      for (var H in E)
        E[b](H) &&
          !G[b](H) &&
          (G[H] = (function(a) {
            return function() {
              var b = arguments;
              return this.forEach(function(c) {
                c[a].apply(c, b);
              });
            };
          })(H));
    }
  }),
  (function(a, b) {
    if ("function" == typeof define && define.amd)
      define("raphael", [
        "raphael.core",
        "raphael.svg",
        "raphael.vml"
      ], function(c) {
        return (a.Raphael = b(c));
      });
    else if ("object" == typeof exports) {
      var c = require("raphael.core");
      require("raphael.svg"), require("raphael.vml"), (module.exports = b(c));
    } else a.Raphael = b(a.Raphael);
  })(this, function(a) {
    return a.ninja();
  });
