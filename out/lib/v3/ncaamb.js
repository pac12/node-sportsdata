(function() {
  var NCAAMB, SportApi, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  SportApi = require('../sport-api');

  NCAAMB = (function(_super) {
    __extends(NCAAMB, _super);

    function NCAAMB() {
      _ref = NCAAMB.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    NCAAMB.prototype.league = 'ncaamb';

    NCAAMB.prototype.version = 3;

    /*
    
    Date based functions
    */


    NCAAMB.prototype.getDailySchedule = function(date, callback) {
      var params, _ref1;
      _ref1 = this.getDailyParams(date, callback), params = _ref1[0], callback = _ref1[1];
      return this.getResource('/games/%(year)s/%(month)s/%(day)s/schedule.xml', params, callback);
    };

    /*
    
    Year / Season based functions
    */


    NCAAMB.prototype.getSchedule = function(params, callback) {
      var _ref1;
      _ref1 = this.getYearSeasonParams(params, callback), params = _ref1[0], callback = _ref1[1];
      return this.getResource('/games/%(year)s/%(season)s/schedule.xml', params, callback);
    };

    NCAAMB.prototype.getStandings = function(params, callback) {
      var _ref1;
      _ref1 = this.getYearSeasonParams(params, callback), params = _ref1[0], callback = _ref1[1];
      return this.getResource('/seasontd/%(year)s/%(season)s/standings.xml', params, callback);
    };

    NCAAMB.prototype.getTournamentList = function(params, callback) {
      var _ref1;
      _ref1 = this.getYearSeasonParams(params, callback), params = _ref1[0], callback = _ref1[1];
      return this.getResource('/tournaments/%(year)s/%(season)s/schedule.xml', params, callback);
    };

    NCAAMB.prototype.getYearSeasonParams = function(params, callback) {
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

    NCAAMB.prototype.getRankings = function(params, callback) {
      var _ref1;
      _ref1 = this.getYearWeekParams(params, callback), params = _ref1[0], callback = _ref1[1];
      return this.getResource('/polls/AP/%(year)s/rankings.xml', params, callback);
    };

    NCAAMB.prototype.getYearWeekParams = function(params, callback) {
      var day, diff, now, oneDay, start, year;
      if (typeof params === 'function') {
        callback = params;
        params = {};
      }
      if (!params) {
        params = {};
      }
      if (!params.year) {
        now = new Date();
        year = now.getFullYear();
        start = new Date(now.getFullYear(), 0, 0);
        diff = now - start;
        oneDay = 1000 * 60 * 60 * 24;
        day = Math.floor(diff / oneDay);
        if (day > 180) {
          params.year = year;
        } else {
          params.year = year - 1;
        }
      }
      return [params, callback];
    };

    /*
    
    TournamentID based functions
    */


    NCAAMB.prototype.getTournamentSchedule = function(tournamentId, callback) {
      if (!tournamentId || !callback) {
        throw new Error('tournamentId and callback are required parameters');
      }
      if (!tournamentId.tournamentId) {
        tournamentId = {
          tournamentId: tournamentId
        };
      }
      return this.getResource('/tournaments/%(tournamentId)s/schedule.xml', tournamentId, callback);
    };

    return NCAAMB;

  })(SportApi);

  module.exports = NCAAMB;

}).call(this);
