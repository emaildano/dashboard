/**
 * RiotJS
 *
 */

module.exports = function() {

  var riot = require('riot');
  var tags_dir = './../../../app/tags/';
  require( tags_dir + 'projects.tag');
  riot.mount('projects');

};
