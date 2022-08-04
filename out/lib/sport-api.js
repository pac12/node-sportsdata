(function() {
  var SportApi, http, moment, sprintf, xml2js;

  http = require('http');

  sprintf = require('sprintf-js').sprintf;

  xml2js = require('xml2js');

  moment = require('moment');

  SportApi = (function() {
    SportApi.prototype.domain = 'api.sportsdatallc.org';

    SportApi.prototype.parser = new xml2js.Parser({
      trim: true,
      normalize: true,
      mergeAttrs: true,
      explicitArray: false
    });

    function SportApi(apiKey, accessLevel, testLeague) {
      this.apiKey = apiKey;
      this.accessLevel = accessLevel;
      this.testLeague = testLeague != null ? testLeague : false;
      if (!apiKey) {
        throw new Error('You must provide an API Key');
      }
      if (!accessLevel) {
        throw new Error('You must provide an Access Level');
      }
    }

    SportApi.prototype.getRollingThreeDaySchedule = function(callback) {
      return this.getResource('/schedule-3day', callback);
    };

    SportApi.prototype.getGlossary = function(callback) {
      return this.getResource('/glossary/glossary.xml', callback);
    };

    /*
    
    Year based functions
    */


    SportApi.prototype.getLeagueSchedule = function(year, callback) {
      var params, _ref;
      _ref = this.getYearParams(year, callback), params = _ref[0], callback = _ref[1];
      return this.getResource('/schedule/%(year)s.xml', params, callback);
    };

    SportApi.prototype.getTeamsHierarchy = function(year, callback) {
      var params, _ref;
      _ref = this.getYearParams(year, callback), params = _ref[0], callback = _ref[1];
      return this.getResource('/teams/%(year)s.xml', params, callback);
    };

    SportApi.prototype.getStandings = function(year, callback) {
      var params, _ref;
      _ref = this.getYearParams(year, callback), params = _ref[0], callback = _ref[1];
      return this.getResource('/standings/%(year)s.xml', params, callback);
    };

    SportApi.prototype.getTeamRostersActive = function(year, callback) {
      var params, _ref;
      _ref = this.getYearParams(year, callback), params = _ref[0], callback = _ref[1];
      return this.getResource('/rosters/%(year)s.xml', params, callback);
    };

    SportApi.prototype.getTeamRostersFull = function(year, callback) {
      var params, _ref;
      _ref = this.getYearParams(year, callback), params = _ref[0], callback = _ref[1];
      return this.getResource('/rosters-full/%(year)s.xml', params, callback);
    };

    SportApi.prototype.getTeamSeasonalStatistics = function(year, callback) {
      var params, _ref;
      _ref = this.getYearParams(year, callback), params = _ref[0], callback = _ref[1];
      return this.getResource('/seasontd/teams/%(year)s.xml', params, callback);
    };

    SportApi.prototype.getPlayersSeasonalStatistics = function(year, callback) {
      var params, _ref;
      _ref = this.getYearParams(year, callback), params = _ref[0], callback = _ref[1];
      return this.getResource('/seasontd/players/%(year)s.xml', params, callback);
    };

    SportApi.prototype.getYearParams = function(year, callback) {
      if (typeof year === 'function') {
        callback = year;
        year = null;
      }
      if (!year) {
        year = new Date().getFullYear();
      }
      if (!year.year) {
        year = {
          year: year
        };
      }
      return [year, callback];
    };

    /*
    
    EventID based functions
    */


    SportApi.prototype.getEvent = function(eventId, callback) {
      var params, _ref;
      _ref = this.getEventParams(eventId, callback), params = _ref[0], callback = _ref[1];
      return this.getResource('/event/%(eventId)s.xml', params, callback);
    };

    SportApi.prototype.getEventStatistics = function(eventId, callback) {
      var params, _ref;
      _ref = this.getEventParams(eventId, callback), params = _ref[0], callback = _ref[1];
      return this.getResource('/statistics/%(eventId)s.xml', params, callback);
    };

    SportApi.prototype.getEventPlayByPlay = function(eventId, callback) {
      var params, _ref;
      _ref = this.getEventParams(eventId, callback), params = _ref[0], callback = _ref[1];
      return this.getResource('/pbp/%(eventId)s.xml', params, callback);
    };

    SportApi.prototype.getEventBoxscore = function(eventId, callback) {
      var params, _ref;
      _ref = this.getEventParams(eventId, callback), params = _ref[0], callback = _ref[1];
      return this.getResource('/boxscore/%(eventId)s.xml', params, callback);
    };

    SportApi.prototype.getEventParams = function(eventId, callback) {
      if (!eventId || !callback) {
        throw new Error('eventId and callback are required parameters');
      }
      if (!eventId.eventId) {
        eventId = {
          eventId: eventId
        };
      }
      return [eventId, callback];
    };

    /*
    
    GameID based functions
    */


    SportApi.prototype.getGameBoxscore = function(gameId, callback) {
      var params, _ref;
      _ref = this.getGameParams(gameId, callback), params = _ref[0], callback = _ref[1];
      return this.getResource('/games/%(gameId)s/boxscore.xml', params, callback);
    };

    SportApi.prototype.getGameSummary = function(gameId, callback) {
      var params, _ref;
      _ref = this.getGameParams(gameId, callback), params = _ref[0], callback = _ref[1];
      return this.getResource('/games/%(gameId)s/summary.xml', params, callback);
    };

    SportApi.prototype.getGameParams = function(gameId, callback) {
      if (!gameId || !callback) {
        throw new Error('gameId and callback are required parameters');
      }
      if (!gameId.gameId) {
        gameId = {
          gameId: gameId
        };
      }
      return [gameId, callback];
    };

    /*
    
    PlayerID based functions
    */


    SportApi.prototype.getPlayerProfile = function(playerId, callback) {
      if (!playerId || !callback) {
        throw new Error('playerId and callback are required parameters');
      }
      if (!playerId.playerId) {
        playerId = {
          playerId: playerId
        };
      }
      return this.getResource('/player/profile/%(playerId)s.xml', playerId, callback);
    };

    /*
    
    HELPER FUNCTIONS
    */


    SportApi.prototype.getDailyParams = function(date, callback) {
      var e, params;
      if (typeof date === 'function') {
        callback = date;
        date = null;
      }
      if (!date) {
        date = new Date();
      }
      if (!date.date) {
        date = {
          date: date
        };
      }
      if (!(date.date instanceof Date)) {
        try {
          date.date = new Date(date.date);
        } catch (_error) {
          e = _error;
          date.date = new Date();
        }
      }
      date = moment(date.date);
      params = {
        year: date.format('YYYY'),
        month: date.format('MM'),
        day: date.format('DD')
      };
      return [params, callback];
    };

    SportApi.prototype.getResource = function(pattern, params, callback) {
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

    SportApi.prototype.getHttpOptions = function(pattern, params) {
      var options, path;
      if (typeof params === 'undefined') {
        params = {};
      }
      path = "/" + this.league + "-";
      if (this.testLeague) {
        path += "test-";
      }
      path += "" + (this.accessLevel + this.version + sprintf(pattern, params) + sprintf('?api_key=%s', this.apiKey));
      return options = {
        hostname: this.domain,
        path: path
      };
    };

    SportApi.prototype.performHttpGet = function(options, callback) {
      var req,
        _this = this;
      this.parser.reset();
      console.log(options);
      return req = http.get(options, function(res) {
        var data;
        res.setEncoding('utf8');
        data = '';
        res.on('data', function(body) {
          return data += body;
        });
        res.on('end', function() {
          if (200 !== res.statusCode) {
            return callback('GET returned HTTP ' + res.statusCode);
          }
          return _this.parser.parseString(data, function(err, result) {
            if (err) {
              return callback('Parse error: ' + err);
            }
            return callback(null, result);
          });
        });
        return req.on('error', function(e) {
          return callback('Could not get ' + options + ': ' + err.message);
        });
      });
    };

    return SportApi;

  })();

  module.exports = SportApi;

}).call(this);
