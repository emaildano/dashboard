/**
 * Module for js that fires on all pages.
 */

module.exports = function() {

  console.log('We have liftoff.');

  /**
   * Plugins
   */

  var jQueryBridget = require('jquery-bridget');
  // var jqueryUI = require('jquery-ui-browserify');
  // var xeditable = require('../../../node_modules/X-editable/dist/jqueryui-editable/js/jqueryui-editable.js');
  var slimscroll = require('slimscroll');
  var flot = require('flot');
  var peity = require('peity');
  var pace = require('pace');
  var bootstrap = require('bootstrap-sass');
  // var metismenu = require('metismenu');
  var gritter = require('../../../node_modules/gritter/js/jquery.gritter.js');
  var sparkline = require('jquery-sparkline');
  var chartjs = require('chart.js');
  // var toastr = require('toastr');
  var sweetalert = require('sweetalert');
  var ladda = require('ladda');
  // var moment = require('moment');
  // var sjcl = require('sjcl');
  // var jsbn = require('jsbn');
  // var superagent = require('superagent');
  var es6promise = require('es6-promise');

  /**
   * Bridget for needy plugins
   */

  jQueryBridget('slimscroll', slimscroll, $);

};
