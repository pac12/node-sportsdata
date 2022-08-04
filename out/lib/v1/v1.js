(function() {
  var SportApi, V1, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  SportApi = require('../sport-api');

  V1 = (function(_super) {
    __extends(V1, _super);

    function V1() {
      _ref = V1.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    V1.prototype.version = 1;

    V1.prototype.getWeeklySchedule = function(params, callback) {
      var _ref1;
      _ref1 = this.getYearSeasonWeekParams(params, callback), params = _ref1[0], callback = _ref1[1];
      return this.getResource('/%(year)s/%(season)s/%(week)s/schedule.xml', params, callback);
    };

    V1.prototype.getExtendedBoxscore = function(params, callback) {
      var away, home, _ref1, _this;
      home = params.home;
      away = params.away;
      _this = this;
      _ref1 = this.getYearSeasonWeekParams(params, callback), params = _ref1[0], callback = _ref1[1];
      return this.getResource('/%(year)s/%(season)s/%(week)s/%(away)s/%(home)s/extended-boxscore.xml', params, function(err, response) {
        if (err === 'GET returned HTTP 404') {
          params.home = away;
          params.away = home;
          return _this.getResource('/%(year)s/%(season)s/%(week)s/%(away)s/%(home)s/extended-boxscore.xml', params, callback);
        } else {
          return callback(null, response);
        }
      });
    };

    V1.prototype.getPlayByPlay = function(params, callback) {
      var _ref1;
      _ref1 = this.getYearSeasonWeekParams(params, callback), params = _ref1[0], callback = _ref1[1];
      return this.getResource('/%(year)s/%(season)s/%(week)s/%(away)s/%(home)s/pbp.xml', params, callback);
    };

    V1.prototype.getYearSeasonWeekParams = function(params, callback) {
      if (typeof params === 'function') {
        callback = params;
        params = {};
      }
      if (!params) {
        params = {};
      }
      if (!params.year) {
        params.year = new Date().getFullYear();
      }
      if (!params.season) {
        params.season = 'REG';
      }
      if (!params.week) {
        params.week = 1;
      }
      return [params, callback];
    };

    return V1;

  })(SportApi);

  module.exports = V1;

}).call(this);
