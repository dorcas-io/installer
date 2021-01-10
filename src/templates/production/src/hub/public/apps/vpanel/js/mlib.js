/**
 *	@desc	  	Mattheson Project Assist (Lite)
 *	@author	  	Ajonibode Oluwaseyi Matthew
 *	@copyright	Copyright(c) 2015-2018, Mattheson Engineering
 *	@url		https://mattheson.co
 *  @date       07/06/2018
 */
!(function(g) {
  var e;
  (e = function(p, e) {
    if (void 0 === e) throw new Error("_mthlib|jQuery is not defined!");
    var s,
      n,
      t,
      m = {},
      f = !1;
    return (
      (t = (document.body || document.documentElement).style),
      (f =
        void 0 !== t.animation ||
        void 0 !== t.WebkitAnimation ||
        void 0 !== t.MozAnimation ||
        void 0 !== t.MsAnimation ||
        void 0 !== t.OAnimation),
      g("html").on("keyup", function(e) {
        if (27 === e.keyCode) return m.closeByEscape();
      }),
      (n = function(e, t) {
        var n;
        return (
          (n = {}),
          g.each(
            g(e)
              .serializeArray()
              .reverse(),
            function() {
              return n[this.name]
                ? (n[this.name].push || (n[this.name] = [n[this.name]]),
                  n[this.name].push(this.value || ""))
                : t &&
                  "object" == typeof t.exclude &&
                  g.in_array(this.name, t.exclude)
                ? void 0
                : (n[this.name] = this.value || "");
            }
          ),
          n
        );
      }),
      (m.dialogIds = []),
      (m.Objs = {}),
      (m.dialogId = null),
      (m.animationEndEvent = {
        animation: "animationend",
        WebkitAnimation: "webkitAnimationEnd",
        MozAnimation: "mozAnimationEnd",
        MsAnimation: "MSAnimationEnd",
        OAnimation: "oanimationend"
      }),
      (m.classes = {
        wrapper: "dialog",
        content: "dialog-content",
        overlay: "dialog-overlay",
        close: "dialog-close",
        closing: "dialog-closing",
        open: "dialog-open",
        animation: {
          handler: "anim-handler",
          opening: "",
          closing: "",
          content: { open: "anim-sally-open", close: "anim-sally-close" },
          overlay: { open: "anim-fadein", close: "anim-fadeout" }
        }
      }),
      (m.buttons = {
        YAY: { text: "OK", type: "submit", className: "dialog-button-yay" },
        NAH: {
          text: "Cancel",
          type: "button",
          className: "dialog-button-nah",
          click: function(e) {
            return m.close(this.data);
          }
        }
      }),
      (m.defaultOpts = {
        type: "dialog",
        content: null,
        keepBuild: !0,
        showCloseButton: !0,
        closeEscape: !0,
        closeClick: !0,
        appendTo: "body",
        className: null,
        themeClass: "dialog-default",
        css: {},
        overlayClassName: null,
        overlayCSS: {},
        contentClassName: null,
        contentCSS: {},
        closeClassName: null,
        buttonsBaseClass: null,
        closeCSS: {},
        formClass: null,
        lock: !1,
        allowOverlay: !1,
        ifDialogsOpen: {},
        animate: !0,
        contentOpenAnimation: null,
        contentCloseAnimation: null,
        callback: function(e) {},
        afterOpen: function() {},
        message: "Message",
        input: '<input name="dialog" type="hidden" value="_input-empty" />',
        value: !1,
        buttons: [m.buttons.YAY, m.buttons.NAH],
        hideButtons: !1,
        reverseButtons: !1,
        onSubmit: function(e) {
          var t;
          return (
            e.preventDefault(),
            e.stopPropagation(),
            (t = g(this)),
            (id = t.data("id")),
            (m.Objs[id].opts.value = m.getFormValueOnSubmit(n(t))),
            (m.Objs[id].formobj = n(t, { exclude: ["dialog"] })),
            (m.Objs[id].form = t),
            m.close(id),
            !1
          );
        },
        focusFirstInput: !0
      }),
      (m.open = function(n) {
        var e, o, a, t;
        return n
          ? ((m.dialogId = new Date().getTime()),
            (n.id = m.dialogId),
            (m.Objs[n.id] = {}),
            !0 ===
              (t = m.Objs[n.id].opts = g.extend(null, {}, m.defaultOpts, n))
                .lock &&
              ((t.closeClick = !1),
              (t.closeEscape = !1),
              (t.showCloseButton = !1)),
            (s = n = g.extend(!0, {}, t, n)),
            0 < m.getAllDialogs().length &&
              n.ifDialogsOpen &&
              (n = g.extend(!0, {}, n, n.ifDialogsOpen)),
            (e = m.build(n)),
            (t.content = n.content = e),
            (o = n.beforeClose),
            (a = n.afterClose),
            (n.beforeClose = function(e, t) {
              return (
                n.callback(t.value), "function" == typeof o ? o(e, t) : void 0
              );
            }),
            (n.afterClose = function(e, t) {
              return "function" == typeof a ? a(e, t) : void 0;
            }),
            "function" == typeof n.beforeOpen && n.beforeOpen(this),
            m.dialogIds.push(m.dialogId),
            (m.Objs[n.id].beforeclose = n.beforeClose),
            (m.Objs[n.id].afterclose = n.afterClose),
            (n._dialogWrapper = document.createElement("div")),
            g(n._dialogWrapper)
              .addClass(m.classes.wrapper)
              .addClass(n.themeClass)
              .addClass(n.className)
              .addClass(m.classes.animation.handler)
              .css(n.css),
            (m.Objs[m.dialogId].wrapper = n._dialogWrapper),
            (n._dialogOverlay = document.createElement("div")),
            g(n._dialogOverlay)
              .addClass(m.classes.animation.opening)
              .addClass(m.classes.overlay)
              .addClass(m.classes.animation.overlay.open)
              .addClass(n.overlayClassName)
              .css(n.overlayCSS),
            n.closeClick &&
              g(n._dialogOverlay).on("click", function(e) {
                if (e.target === this) return m.close(n.id);
              }),
            (m.Objs[m.dialogId].overlay = n._dialogOverlay),
            0 < m.getAllDialogs().length &&
              !n.allowOverlay &&
              g(n._dialogOverlay).css({ background: "transparent" }),
            g(n._dialogWrapper).append(n._dialogOverlay),
            (contentOpenAnimation = n.animate
              ? n.contentOpenAnimation || m.classes.animation.content.open
              : null),
            (n._dialogContent = document.createElement("div")),
            g(n._dialogContent)
              .addClass(m.classes.animation.opening)
              .addClass(m.classes.content)
              .addClass(contentOpenAnimation)
              .addClass(n.contentClassName)
              .css(n.contentCSS)
              .append(n.content)
              .data("id", m.dialogId),
            (m.Objs[m.dialogId].content = n._dialogContent),
            g(n._dialogOverlay).append(n._dialogContent),
            n.showCloseButton &&
              ((n._dialogCloseButton = document.createElement("div")),
              g(n._dialogCloseButton)
                .addClass(m.classes.close)
                .addClass(n.closeClassName)
                .css(n.closeCSS)
                .on("click", function() {
                  return m.close(n.id);
                }),
              g(n._dialogContent).append(n._dialogCloseButton)),
            g(n.appendTo).append(n._dialogWrapper),
            g("body").addClass(m.classes.open),
            m._reposition(n._dialogContent),
            g(window).on("resize", function() {
              m._reposition(n._dialogContent);
            }),
            n.focusFirstInput &&
              g(e)
                .find(
                  'button[type="submit"], button[type="button"], input[type="submit"], input[type="button"], textarea, input[type="date"], input[type="datetime"], input[type="datetime-local"], input[type="email"], input[type="month"], input[type="number"], input[type="password"], input[type="search"], input[type="tel"], input[type="text"], input[type="time"], input[type="url"], input[type="week"]'
                )
                .first()
                .focus(),
            (s = g.extend({}, t, n)),
            (m.Objs[n.id].opts = s),
            n.afterOpen && n.afterOpen(n._dialogContent, n),
            setTimeout(function() {
              m._reposition(n._dialogContent);
            }, 200),
            n.id)
          : m.die();
      }),
      (m._reposition = function(e) {
        var t = e.offsetWidth || e.clientWidth,
          n = e.offsetHeight || e.clientHeight;
        e.style.margin = "-" + n / 2 + "px 0 0 -" + t / 2 + "px";
      }),
      (m.getSelectorFromBaseClass = function(e) {
        return "." + e.split(" ").join(".");
      }),
      (m.getAllDialogs = function() {
        return g(
          "." +
            m.classes.wrapper +
            ":not(." +
            m.classes.closing +
            ") " +
            m.getSelectorFromBaseClass(m.classes.content)
        );
      }),
      (m.getDialogByID = function(e) {
        m.getAllDialogs();
        return m.Objs[e];
      }),
      (m.close = function(e) {
        var t;
        if (!(e = Number(e))) {
          if (!(t = m.getAllDialogs().last()).length) return !1;
          e = g(t).data("id");
        }
        return m.closeByID(e);
      }),
      (m.closeAll = function() {
        return (
          g.each(m.dialogIds.reverse(), function(e, t) {
            return m.closeByID(t);
          }),
          !1
        );
      }),
      (m.closeByID = function(t) {
        var e, n, o, a, s, i, l, d, r;
        if (
          ((e = m.getDialogByID(t)),
          (r = g.extend({}, e.opts)),
          (n = e.wrapper),
          (o = e.overlay),
          (a = e.content),
          (s = e.beforeclose),
          (i = e.afterclose),
          a)
        ) {
          if (
            ((l = function() {
              if (s) {
                var e = m.Objs[t].opts.value;
                return (m.Objs[t].opts.value = !1), s(e, r);
              }
            }),
            (d = function() {
              if (
                (g(n).remove(),
                m.getAllDialogs().length ||
                  g("body").removeClass(m.classes.open),
                i)
              )
                return i();
            }),
            f && r.animate)
          ) {
            if (!1 !== l())
              for (p in m.animationEndEvent)
                if (void 0 !== n.style[p]) {
                  var c = m.animationEndEvent[p];
                  g(o)
                    .switchClass(
                      m.classes.animation.opening,
                      m.classes.animation.closing
                    )
                    .addClass(m.classes.animation.overlay.close);
                  var u =
                    r.contentCloseAnimation ||
                    m.classes.animation.content.close;
                  g(a)
                    .switchClass(
                      m.classes.animation.opening,
                      m.classes.animation.closing
                    )
                    .addClass(u),
                    g(n)
                      .off(c)
                      .on(c, function() {
                        return d();
                      })
                      .addClass(m.classes.animation.handler)
                      .addClass(m.classes.closing);
                }
          } else !1 !== l() && d();
          return !0;
        }
      }),
      (m.closeByEscape = function() {
        var e = m.getAllDialogs().last(),
          t = g(e).data("id");
        if (m.Objs[t] && m.Objs[t].opts.closeEscape) return m.closeByID(t);
      }),
      (m.alert = function(e) {
        var t = {
          type: "alert",
          message: e,
          buttons: [m.buttons.YAY],
          focusFirstInput: !0
        };
        return (
          (e =
            "object" == typeof e
              ? g.extend({}, t, e)
              : g.extend({}, t, { message: e })),
          m.open(e)
        );
      }),
      (m.lock = function(e) {
        return m.alert({ lock: !0, message: e, buttons: [] });
      }),
      (m.confirm = function(e) {
        var t;
        return "string" == typeof e
          ? g.err("No callback specified for confirm dialog")
          : ((t = {
              type: "confirm",
              message: e.message || "Confirm?",
              focusFirstInput: !0,
              buttons: [m.buttons.YAY, m.buttons.NAH]
            }),
            (e = g.extend({}, t, e)),
            m.open(e));
      }),
      (m.prompt = function(e) {
        var t;
        return "string" == typeof e
          ? g.err("No callback specified for prompt dialog")
          : ((t = {
              type: "prompt",
              message:
                '<label for="dialog">' + (e.message || "Prompt:") + "</label>",
              input:
                '<input name="dialog" type="text" placeholder=""  value="' +
                (e.value || "") +
                '" />',
              buttons: [m.buttons.YAY, m.buttons.NAH]
            }),
            (e = g.extend({}, t, e)),
            m.open(e));
      }),
      (m.build = function(e) {
        var t, n, o, a;
        return (
          (e = m.Objs[e.id].opts),
          (t = document.createElement("form")),
          g(t)
            .addClass("dialog-form")
            .addClass(e.formClass),
          ((n = document.createElement("div")).className = "dialog-input"),
          "prompt" != e.type && g(n).css({ display: "none" }),
          (m.Objs[e.id].form = t),
          e.keepBuild
            ? (e.content
                ? (a = g("<div>")
                    .addClass("dialog-base")
                    .html(e.content))
                : (o = g("<div>")
                    .addClass("dialog-message")
                    .html(e.message)),
              g(t)
                .append(a || o)
                .append(g(n).html(e.input))
                .append(m.attachButtons(!e.hideButtons && e.buttons))
                .data("id", e.id)
                .on("submit", e.onSubmit),
              t)
            : e.content || e.message || "<null>"
        );
      }),
      (m.getFormValueOnSubmit = function(e) {
        return e.dialog || "" === e.dialog
          ? "_input-empty" === e.dialog || e.dialog
          : e;
      }),
      (m.attachButtons = function(e) {
        var o;
        return (
          (o = g("<div>")
            .addClass("dialog-buttons")
            .addClass(s.buttonsBaseClass)),
          (m.Objs[s.id].buttons = {}),
          (m.Objs[s.id].buttons.wrapper = o),
          e && s.reverseButtons && e.reverse(),
          s.hideButtons && o.css({ display: "none" }),
          g.each(e, function(e, t) {
            var n;
            return (
              ((n = document.createElement("button")).type = t.type),
              g(n)
                .html(t.text)
                .addClass(t.className + " dialog-button "),
              t.click && g(n).bind("click", s.id, t.click),
              g(n).appendTo(o)
            );
          }),
          o
        );
      }),
      (m.die = function() {
        return !1;
      }),
      (m.allowBeforeClose = function(e) {
        m.Objs[e].beforeclose = function() {
          return !0;
        };
      }),
      (m.resetCallback = function(e) {
        m.Objs[e].callback = function() {
          return !0;
        };
      }),
      (m.getFormObj = function(e) {
        return m.Objs[e]
          ? m.Objs[e].formobj
            ? m.Objs[e].formobj
            : {}
          : m.die();
      }),
      (m.getForm = function(e) {
        return m.Objs[e] ? (m.Objs[e].form ? m.Objs[e].form : {}) : m.die();
      }),
      (m.unlock = function(e) {}),
      (m.resetPosition = function(e) {
        var t = this.getDialogByID(e);
        this._reposition(t.content);
      }),
      (m.changeContent = function(e, t) {}),
      m
    );
  }),
    (g.dialog = e(window, g));
})(jQuery);
(function($) {
  function sleep(f, g) {
    for (var h = new Date().getTime(); h + f >= new Date().getTime(); )
      "function" == typeof g && g();
  }
  ($.in_array = function(f, g, h) {
    var j = "";
    if (!!h) {
      for (j in g) if (g[j] === f) return !0;
    } else for (j in g) if (g[j] == f) return !0;
    return !1;
  }),
    ($.fn.switchClass = function(f, g) {
      return 1 > f.length || 1 > g.length
        ? this
        : (this.each(function(h, j) {
            "undefined" != typeof j &&
              $(j).hasClass(f) &&
              $(j)
                .removeClass(f)
                .addClass(g);
          }),
          this);
    }),
    ($.json = function(f) {
      return $.ajax(
        $.extend(
          !0,
          {},
          { type: "post", contentType: "application/json" },
          f || {}
        )
      );
    }),
    (String.prototype.eval = function() {
      var r;
      try {
        r = eval("(" + this + ")");
      } catch (e) {
        r = eval("(" + "{}" + ")");
      }
      return r;
    }),
    ($.delay = sleep),
    ($.fn.cloneHTML = function() {
      return this[0].outerHTML;
    }),
    ($.DOM = {
      live: !1,
      templ_id: null,
      _templ_id: null,
      templHtml: null,
      clone: null,
      prop: null,
      counter: 0,
      baseClass: null,
      _t: null,
      rObject: {},
      template: function(f, g) {
        var h, j, k;
        (this.templ_id = j = "tmpl-" + new Date().getTime()),
          (g = g ? g : {}),
          (this.baseClass = "string" == typeof f ? f.replace(/./i, "") : "");
        var l = "string" == typeof f ? $(f) : "object" == typeof f ? f : {};
        return (
          l &&
            l.hasClass &&
            l.hasClass("js-template") &&
            ($(f).addClass(j),
            (this.clone = h = $(f).cloneHTML()),
            $(f).removeClass(j),
            (this._templ_id = k = "." + j),
            (this.prop = g),
            (this._t = $(f)[0])),
          this
        );
      },
      build_template: function() {
        var f = this._templ_id,
          g = this.prop,
          h = $(f).find("[tpl-class], [data-id], [tpl-id]");
        for (i in ((this.rObject.id = this.templ_id), g))
          "doctitle" === i && (doc.title = g[i]);
        h.each(function(k, l) {
          var n =
            $(l).attr("data-id") ||
            $(l).attr("tpl-id") ||
            $(l).attr("tpl-class");
          if (g[n]) {
            if ((($.DOM.rObject[n] = g[n]), "string" == typeof g[n]))
              $(l).html(g[n]);
            else if ("object" == typeof g[n]) {
              var q = g[n],
                s = $(l);
              if (
                (q.onclick &&
                  ("object" == typeof q.onclick &&
                    (q.onclick.data && "function" == typeof q.onclick.callback
                      ? s.bind("click", q.onclick.data, q.onclick.callback)
                      : q.onclick.delegate &&
                        "function" == typeof q.onclick.callback &&
                        s.on("click", q.onclick.delegate, q.onclick.callback)),
                  "function" == typeof q.onclick && s.on("click", q.onclick)),
                q.html && s.html(q.html),
                q.href && s.attr("href", q.href),
                q.remove && s.remove(),
                q.hide && s.hide(),
                q.addClass)
              ) {
                var u = !1;
                (u =
                  "undefined" == typeof q.addClass.condition &&
                  q.addClass.name),
                  (u =
                    (q.addClass.name &&
                      q.addClass.condition &&
                      !0 === q.addClass.condition) ||
                    u),
                  u && s.addClass(q.addClass.name);
              }
              q.backgroundImage &&
                s.css({ background: "url('" + q.backgroundImage + "')" }),
                "function" == typeof q.callback && q.callback(l);
            } else $.DOM.rObject[n] = {};
            $.DOM.rObject[n].get = function() {
              return l;
            };
          }
        });
        var j = $(f);
        return (
          j.removeClass("js-template " + this.baseClass + " hidden"),
          sleep(5),
          j[0]
        );
      },
      regxReplace: function(f, g) {
        return (this.clone = this.clone.replace(f, g)), this;
      },
      regxObjReplace: function(f) {
        for (var g in f) this.clone = this.clone.replace(RegExp(g, "g"), f[g]);
        return this;
      },
      after: function(f) {
        var g = this.clone;
        return null == g ? null : ($(f).after(g), this.build_template());
      },
      before: function(f) {
        var g = this.clone;
        return null == g ? null : ($(f).before(g), this.build_template());
      },
      html: function(f) {
        var g = this.clone;
        return null == g ? null : ($(f).html(g), this.build_template());
      },
      getHTML: function() {
        return this.clone;
      },
      append: function(f) {
        var g = this.clone;
        return null == g ? null : ($(f).append(g), this.build_template());
      },
      replace: function() {
        var g = this.clone;
        if (null != g) {
          var h = this._t,
            j = $(g)[0];
          return h.parentNode.replaceChild(j, h), this.build_template();
        }
        return null;
      }
    }),
    ($.fn.sortTable = function() {
      this.each(function(f, g) {
        if ("undefined" != typeof g) {
          const h = (k, l) =>
              k.children[l].innerText || k.children[l].textContent,
            j = (k, l) => (n, q) =>
              ((s, u) =>
                "" === s || "" === u || isNaN(s) || isNaN(u)
                  ? s.toString().localeCompare(u)
                  : s - u)(h(l ? n : q, k), h(l ? q : n, k));
          $(g)
            .find("th")
            .each((k, l) => {
              $(l).on("click", () => {
                Array.from(g.querySelectorAll("tr:nth-child(n+2)"))
                  .sort(
                    j(
                      Array.from(l.parentNode.children).indexOf(l),
                      (this.asc = !this.asc)
                    )
                  )
                  .forEach(q => g.appendChild(q));
              });
            });
        }
      });
    });
})(jQuery);
