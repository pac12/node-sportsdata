(function() {
  var SportApi, V7, sprintf, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  sprintf = require('sprintf-js').sprintf;

  SportApi = require('../sport-api');

  V7 = (function(_super) {
    __extends(V7, _super);

    function V7() {
      _ref = V7.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    V7.prototype.version = 7;

    V7.prototype.getWeeklySchedule = function(params, callback) {
      params = this.getYearSeasonWeekParams(params);
      return this.getResource('/games/%(year)s/%(season)s/%(week)s/schedule.xml', params, callback);
    };

    V7.prototype.getExtendedBoxscore = function(params, callback) {
      return this.getResource('/games/%(gameId)s/boxscore.xml', params, callback);
    };

    V7.prototype.getGameStatistics = function(params, callback) {
      return this.getResource('/games/%(gameId)s/statistics.xml', params, callback);
    };

    V7.prototype.getPlayByPlay = function(params, callback) {
      return this.getResource('/games/%(gameId)s/pbp.xml', params, callback);
    };

    V7.prototype.getRankings = function(params, callback) {
      params = this.getYearWeekParams(params)[0];
      return this.getResource('/polls/AP25/%(year)s/%(week)s/rankings.xml', params, callback);
    };

    V7.prototype.getCfpRankings = function(params, callback) {
      params = this.getYearWeekParams(params)[0];
      return this.getResource('/polls/CFP25/%(year)s/%(week)s/rankings.xml', params, callback);
    };

    V7.prototype.getYearSeasonWeekParams = function(params, callback) {
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
      return params;
    };

    V7.prototype.getYearWeekParams = function(params, callback) {
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
      return [params];
    };

    V7.prototype.getResource = function(pattern, params, callback) {
      var e, options;
      if (typeof params === 'function') {
        callback = params;
        params = {};
      }
      try {
        options = this.getHttpOptions(pattern, params);
      } catch (_error) {
        e = _error;
        return callback(e);
      }
      return this.performHttpGet(options, callback);
    };

    V7.prototype.getHttpOptions = function(pattern, params) {
      var options, path;
      if (typeof params === 'undefined') {
        params = {};
      }
      path = "/" + this.league;
      if (this.testLeague) {
        path += "-test";
      }
      path += "/" + this.accessLevel + "/v" + this.version + "/en";
      path += sprintf(pattern, params);
      path += sprintf('?api_key=%s', this.apiKey);
      return options = {
        hostname: this.domain,
        path: path
      };
    };

    return V7;

  })(SportApi);

  module.exports = V7;

}).call(this);
