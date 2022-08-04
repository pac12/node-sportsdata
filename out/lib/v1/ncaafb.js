(function() {
  var NCAAFB, V1, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  V1 = require('./v1');

  NCAAFB = (function(_super) {
    __extends(NCAAFB, _super);

    function NCAAFB() {
      _ref = NCAAFB.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    NCAAFB.prototype.league = 'ncaafb';

    NCAAFB.prototype.getTeamsHierarchy = function(division, callback) {
      var params, _ref1;
      _ref1 = this.getDivisionParams(division, callback), params = _ref1[0], callback = _ref1[1];
      return this.getResource('/teams/%(division)s/hierarchy.xml', params, callback);
    };

    NCAAFB.prototype.getDivisionParams = function(division, callback) {
      if (typeof division === 'function') {
        callback = division;
        division = null;
      }
      if (!division) {
        division = 'FBS';
      }
      if (!division.division) {
        division = {
          division: division
        };
      }
      return [division, callback];
    };

    NCAAFB.prototype.getStandings = function(params, callback) {
      var _ref1;
      _ref1 = this.getYearSeasonParams(params, callback), params = _ref1[0], callback = _ref1[1];
      return this.getResource('/teams/FBS/%(year)s/%(season)s/standings.xml', params, callback);
    };

    NCAAFB.prototype.getYearSeasonParams = function(params, callback) {
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
      return [params, callback];
    };

    NCAAFB.prototype.getRankings = function(params, callback) {
      var _ref1;
      _ref1 = this.getYearWeekParams(params, callback), params = _ref1[0], callback = _ref1[1];
      return this.getResource('/polls/AP25/%(year)s/%(week)s/rankings.xml', params, callback);
    };

    NCAAFB.prototype.getCfpRankings = function(params, callback) {
      var _ref1;
      _ref1 = this.getYearWeekParams(params, callback), params = _ref1[0], callback = _ref1[1];
      return this.getResource('/polls/CFP25/%(year)s/%(week)s/rankings.xml', params, callback);
    };

    NCAAFB.prototype.getYearWeekParams = function(params, callback) {
      var seasonWeek, week;
      if (typeof params === 'function') {
        callback = params;
        params = {};
      }
      if (!params) {
        params = {};
      }
      if (!params.week) {
        week = new Date();
        week.setHours(0, 0, 0);
        week.setDate(week.getDate() + 1 - (week.getDay() || 7));
        week = Math.ceil((((week - new Date(week.getFullYear(), 0, 1)) / 8.64e7) + 1) / 7);
        if (week < 10) {
          seasonWeek = (week + 52) - 34;
        } else if (week < 35) {
          seasonWeek = 1;
        } else {
          seasonWeek = week - 34;
        }
        params.week = seasonWeek;
      }
      if (!params.year) {
        if (week < 10) {
          params.year = new Date().getFullYear() - 1;
        }
        if (week >= 10) {
          params.year = new Date().getFullYear();
        }
      }
      return [params, callback];
    };

    return NCAAFB;

  })(V1);

  module.exports = NCAAFB;

}).call(this);
