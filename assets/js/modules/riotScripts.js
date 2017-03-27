/**
 * RiotJS
 *
 */

module.exports = function() {

  var riot = require('riot');
  require('./../../../app/tags/404.tag');
  require('./../../../app/tags/account.tag');
  require('./../../../app/tags/activation.tag');
  require('./../../../app/tags/archive-tool.tag');
  require('./../../../app/tags/archive.tag');
  require('./../../../app/tags/billing_alert.tag');
  require('./../../../app/tags/billing.tag');
  require('./../../../app/tags/coupon.tag');
  require('./../../../app/tags/domains.tag');
  require('./../../../app/tags/dropzone.tag');
  require('./../../../app/tags/forgot-password.tag');
  require('./../../../app/tags/header.tag');
  require('./../../../app/tags/invoice.tag');
  require('./../../../app/tags/login.tag');
  require('./../../../app/tags/netlify.tag');
  require('./../../../app/tags/peity-demo.tag');
  require('./../../../app/tags/project-detail.tag');
  require('./../../../app/tags/project-new.tag');
  require('./../../../app/tags/projects.tag');
  require('./../../../app/tags/register.tag');
  require('./../../../app/tags/releasenote.tag');
  require('./../../../app/tags/reset-password.tag');
  require('./../../../app/tags/resource-monitor.tag');
  require('./../../../app/tags/roadmap.tag');
  require('./../../../app/tags/sparkline-demo.tag');
  require('./../../../app/tags/userinfo-activation.tag');
  require('./../../../app/tags/withdrawal.tag');
  // require('./../../../app/tags/sidebar.tag');

  riot.mount('*');

};
