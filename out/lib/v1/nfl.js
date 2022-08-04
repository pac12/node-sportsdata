(function() {
  var NFL, V1, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  V1 = require('./v1');

  NFL = (function(_super) {
    __extends(NFL, _super);

    function NFL() {
      _ref = NFL.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    NFL.prototype.league = 'nfl';

    NFL.prototype.getTeamsHierarchy = function(callback) {
      return this.getResource('/teams/hierarchy.xml', callback);
    };

    return NFL;

  })(V1);

  module.exports = NFL;

}).call(this);
