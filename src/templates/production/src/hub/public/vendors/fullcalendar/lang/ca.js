(function(t) {
  "function" == typeof define && define.amd
    ? define(["jquery", "moment"], t)
    : t(jQuery, moment);
})(function(t, e) {
  (e.defineLocale || e.lang).call(e, "ca", {
    months: "gener_febrer_març_abril_maig_juny_juliol_agost_setembre_octubre_novembre_desembre".split(
      "_"
    ),
    monthsShort: "gen._febr._mar._abr._mai._jun._jul._ag._set._oct._nov._des.".split(
      "_"
    ),
    weekdays: "diumenge_dilluns_dimarts_dimecres_dijous_divendres_dissabte".split(
      "_"
    ),
    weekdaysShort: "dg._dl._dt._dc._dj._dv._ds.".split("_"),
    weekdaysMin: "Dg_Dl_Dt_Dc_Dj_Dv_Ds".split("_"),
    longDateFormat: {
      LT: "H:mm",
      LTS: "LT:ss",
      L: "DD/MM/YYYY",
      LL: "D MMMM YYYY",
      LLL: "D MMMM YYYY LT",
      LLLL: "dddd D MMMM YYYY LT"
    },
    calendar: {
      sameDay: function() {
        return "[avui a " + (1 !== this.hours() ? "les" : "la") + "] LT";
      },
      nextDay: function() {
        return "[demà a " + (1 !== this.hours() ? "les" : "la") + "] LT";
      },
      nextWeek: function() {
        return "dddd [a " + (1 !== this.hours() ? "les" : "la") + "] LT";
      },
      lastDay: function() {
        return "[ahir a " + (1 !== this.hours() ? "les" : "la") + "] LT";
      },
      lastWeek: function() {
        return (
          "[el] dddd [passat a " + (1 !== this.hours() ? "les" : "la") + "] LT"
        );
      },
      sameElse: "L"
    },
    relativeTime: {
      future: "en %s",
      past: "fa %s",
      s: "uns segons",
      m: "un minut",
      mm: "%d minuts",
      h: "una hora",
      hh: "%d hores",
      d: "un dia",
      dd: "%d dies",
      M: "un mes",
      MM: "%d mesos",
      y: "un any",
      yy: "%d anys"
    },
    ordinalParse: /\d{1,2}(r|n|t|è|a)/,
    ordinal: function(t, e) {
      var n =
        1 === t ? "r" : 2 === t ? "n" : 3 === t ? "r" : 4 === t ? "t" : "è";
      return ("w" === e || "W" === e) && (n = "a"), t + n;
    },
    week: { dow: 1, doy: 4 }
  }),
    t.fullCalendar.datepickerLang("ca", "ca", {
      closeText: "Tanca",
      prevText: "Anterior",
      nextText: "Següent",
      currentText: "Avui",
      monthNames: [
        "gener",
        "febrer",
        "març",
        "abril",
        "maig",
        "juny",
        "juliol",
        "agost",
        "setembre",
        "octubre",
        "novembre",
        "desembre"
      ],
      monthNamesShort: [
        "gen",
        "feb",
        "març",
        "abr",
        "maig",
        "juny",
        "jul",
        "ag",
        "set",
        "oct",
        "nov",
        "des"
      ],
      dayNames: [
        "diumenge",
        "dilluns",
        "dimarts",
        "dimecres",
        "dijous",
        "divendres",
        "dissabte"
      ],
      dayNamesShort: ["dg", "dl", "dt", "dc", "dj", "dv", "ds"],
      dayNamesMin: ["dg", "dl", "dt", "dc", "dj", "dv", "ds"],
      weekHeader: "Set",
      dateFormat: "dd/mm/yy",
      firstDay: 1,
      isRTL: !1,
      showMonthAfterYear: !1,
      yearSuffix: ""
    }),
    t.fullCalendar.lang("ca", {
      buttonText: { month: "Mes", week: "Setmana", day: "Dia", list: "Agenda" },
      allDayText: "Tot el dia",
      eventLimitText: "més"
    });
});
