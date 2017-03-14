/**
 * Demo Scripts
 * These scripts were included in the original theme JS
 */

module.exports = function() {

  var toastr = require('toastr');

  /**
   * Welcome Screen
   */

  setTimeout(function() {
    toastr.options = {
      closeButton: true,
      progressBar: true,
      showMethod: 'slideDown',
      timeOut: 4000
    };

    toastr.success('Responsive Admin Theme', 'Welcome to INSPINIA');

  }, 1300);


  /**
   * Demo: Piety
   */

  $(function() {
    $("span.pie").peity("pie", {
      fill: ['#1ab394', '#d7d7d7', '#ffffff']
    })

    $(".line").peity("line", {
      fill: '#1ab394',
      stroke: '#169c81',
    })

    $(".bar").peity("bar", {
      fill: ["#1ab394", "#d7d7d7"]
    })

    $(".bar_dashboard").peity("bar", {
      fill: ["#1ab394", "#d7d7d7"],
      width: 100
    })

    var updatingChart = $(".updating-chart").peity("line", {
      fill: '#1ab394',
      stroke: '#169c81',
      width: 64
    })

    setInterval(function() {
      var random = Math.round(Math.random() * 10)
      var values = updatingChart.text().split(",")
      values.shift()
      values.push(random)

      updatingChart
        .text(values.join(","))
        .change()
    }, 1000);

  });

};
