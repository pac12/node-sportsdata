(function() {
  var MLB, SportApi, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  SportApi = require('../sport-api');

  MLB = (function(_super) {
    __extends(MLB, _super);

    function MLB() {
      _ref = MLB.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    MLB.prototype.league = 'mlb';

    MLB.prototype.version = 3;

    MLB.prototype.getVenueInfo = function(callback) {
      return this.getResource('/venues/venues.xml', callback);
    };

    /*
    
    Date based functions
    */


    MLB.prototype.getDailySchedule = function(date, callback) {
      var params, _ref1;
      _ref1 = this.getDailyParams(date, callback), params = _ref1[0], callback = _ref1[1];
      return this.getResource('/daily/schedule/%(year)s/%(month)s/%(day)s.xml', params, callback);
    };

    MLB.prototype.getDailyEvents = function(date, callback) {
      var params, _ref1;
      _ref1 = this.getDailyParams(date, callback), params = _ref1[0], callback = _ref1[1];
      return this.getResource('/daily/event/%(year)s/%(month)s/%(day)s.xml', params, callback);
    };

    MLB.prototype.getDailyBoxscore = function(date, callback) {
      var params, _ref1;
      _ref1 = this.getDailyParams(date, callback), params = _ref1[0], callback = _ref1[1];
      return this.getResource('/daily/boxscore/%(year)s/%(month)s/%(day)s.xml', params, callback);
    };

    return MLB;

  })(SportApi);

  module.exports = MLB;

}).call(this);
