/**
 * Module for js that fires on all pages.
 */

module.exports = function() {

  console.log('We have liftoff.');

  /**
   * Plugins
   */

  var jQueryBridget = require('jquery-bridget');
  var bootstrap = require('bootstrap-sass');
  var xeditable = require('../../../node_modules/X-editable/dist/jqueryui-editable/js/jqueryui-editable.js');
  var metismenu = require('metismenu');
  var slimscroll = require('slimscroll');
  var flot = require('flot');
  var jqueryUI = require('jquery-ui');
  var peity = require('peity');
  var pace = require('pace');
  var gritter = require('../../../node_modules/gritter/js/jquery.gritter.js');
  var sparkline = require('jquery-sparkline');
  var chartjs = require('chart.js');
  var toastr = require('toastr');
  var sweetalert = require('sweetalert');
  var ladda = require('ladda');
  var moment = require('moment');
  var sjcl = require('sjcl');


  /**
   * Bridget for needy plugins
   */

  jQueryBridget('slimScroll', slimscroll, $);

};
