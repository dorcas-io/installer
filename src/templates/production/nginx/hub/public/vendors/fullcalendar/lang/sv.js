(function(e) {
  "function" == typeof define && define.amd
    ? define(["jquery", "moment"], e)
    : e(jQuery, moment);
})(function(e, t) {
  (t.defineLocale || t.lang).call(t, "sv", {
    months: "januari_februari_mars_april_maj_juni_juli_augusti_september_oktober_november_december".split(
      "_"
    ),
    monthsShort: "jan_feb_mar_apr_maj_jun_jul_aug_sep_okt_nov_dec".split("_"),
    weekdays: "söndag_måndag_tisdag_onsdag_torsdag_fredag_lördag".split("_"),
    weekdaysShort: "sön_mån_tis_ons_tor_fre_lör".split("_"),
    weekdaysMin: "sö_må_ti_on_to_fr_lö".split("_"),
    longDateFormat: {
      LT: "HH:mm",
      LTS: "LT:ss",
      L: "YYYY-MM-DD",
      LL: "D MMMM YYYY",
      LLL: "D MMMM YYYY LT",
      LLLL: "dddd D MMMM YYYY LT"
    },
    calendar: {
      sameDay: "[Idag] LT",
      nextDay: "[Imorgon] LT",
      lastDay: "[Igår] LT",
      nextWeek: "dddd LT",
      lastWeek: "[Förra] dddd[en] LT",
      sameElse: "L"
    },
    relativeTime: {
      future: "om %s",
      past: "för %s sedan",
      s: "några sekunder",
      m: "en minut",
      mm: "%d minuter",
      h: "en timme",
      hh: "%d timmar",
      d: "en dag",
      dd: "%d dagar",
      M: "en månad",
      MM: "%d månader",
      y: "ett år",
      yy: "%d år"
    },
    ordinalParse: /\d{1,2}(e|a)/,
    ordinal: function(e) {
      var t = e % 10,
        n =
          1 === ~~((e % 100) / 10)
            ? "e"
            : 1 === t
            ? "a"
            : 2 === t
            ? "a"
            : 3 === t
            ? "e"
            : "e";
      return e + n;
    },
    week: { dow: 1, doy: 4 }
  }),
    e.fullCalendar.datepickerLang("sv", "sv", {
      closeText: "Stäng",
      prevText: "&#xAB;Förra",
      nextText: "Nästa&#xBB;",
      currentText: "Idag",
      monthNames: [
        "Januari",
        "Februari",
        "Mars",
        "April",
        "Maj",
        "Juni",
        "Juli",
        "Augusti",
        "September",
        "Oktober",
        "November",
        "December"
      ],
      monthNamesShort: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "Maj",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Okt",
        "Nov",
        "Dec"
      ],
      dayNamesShort: ["Sön", "Mån", "Tis", "Ons", "Tor", "Fre", "Lör"],
      dayNames: [
        "Söndag",
        "Måndag",
        "Tisdag",
        "Onsdag",
        "Torsdag",
        "Fredag",
        "Lördag"
      ],
      dayNamesMin: ["Sö", "Må", "Ti", "On", "To", "Fr", "Lö"],
      weekHeader: "Ve",
      dateFormat: "yy-mm-dd",
      firstDay: 1,
      isRTL: !1,
      showMonthAfterYear: !1,
      yearSuffix: ""
    }),
    e.fullCalendar.lang("sv", {
      buttonText: {
        month: "Månad",
        week: "Vecka",
        day: "Dag",
        list: "Program"
      },
      allDayText: "Heldag",
      eventLimitText: "till"
    });
});
