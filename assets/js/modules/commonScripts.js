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
  var slimscroll = require('slimscroll');
  var flot = require('flot');
  var jqueryUI = require('jquery-ui-browserify');
  var metismenu = require('metismenu');
  var peity = require('peity');
  var pace = require('pace');
  var gritter = require('../../../node_modules/gritter/js/jquery.gritter.js');
  var sparkline = require('jquery-sparkline');
  var chartjs = require('chart.js');
  // var Toastr = require('toastr');
  var sweetalert = require('sweetalert');
  // var ladda = require('ladda');
  var moment = require('moment');
  var sjcl = require('sjcl');
  var jsbn = require('jsbn');
  var superagent = require('superagent');
  var es6promise = require('es6-promise').polyfill();

  /**
   * Bridget for needy plugins
   */

  jQueryBridget('slimScroll', slimscroll);


  /**
   * Shifter Console Log Art
   */

   var image =
     'font-size: 0px;' +
     'line-height: 120px;' +
     'padding: 40px 40px;' +
     'background: url("https://go.getshifter.io/img/shifter_logo_ds_close@2x.png") no-repeat center center;';
   var base =
     'font-family: "Verdana";' +
     'font-size: 40px;' +
     'color: #000;' +
     'background-color: #fff;' +
     'padding: 0px 20px;' +
     'line-height: 100px;';

   console.log("%c+%cHi, I’m Shifter", image, base);

};
