http = require 'http'
sprintf = require('sprintf-js').sprintf
xml2js = require 'xml2js'
moment = require 'moment'

class SportApi
  domain: 'api.sportsdatallc.org'
  parser: new xml2js.Parser {
    trim: true
    normalize: true
    mergeAttrs: true
    explicitArray: false
  }

  constructor: (@apiKey, @accessLevel, @testLeague = false) ->
    if not apiKey
      throw new Error 'You must provide an API Key'
    if not accessLevel
      throw new Error 'You must provide an Access Level'

  getRollingThreeDaySchedule: (callback) ->
    this.getResource '/schedule-3day', callback

  getGlossary: (callback) ->
    this.getResource '/glossary/glossary.xml', callback

  ###

  Year based functions

  ###

  getLeagueSchedule: (year, callback) ->
    [params, callback] = this.getYearParams year, callback
    this.getResource '/schedule/%(year)s.xml', params, callback

  getTeamsHierarchy: (year, callback) ->
    [params, callback] = this.getYearParams year, callback
    this.getResource '/teams/%(year)s.xml', params, callback

  getStandings: (year, callback) ->
    [params, callback] = this.getYearParams year, callback
    this.getResource '/standings/%(year)s.xml', params, callback

  getTeamRostersActive: (year, callback) ->
    [params, callback] = this.getYearParams year, callback
    this.getResource '/rosters/%(year)s.xml', params, callback

  getTeamRostersFull: (year, callback) ->
    [params, callback] = this.getYearParams year, callback
    this.getResource '/rosters-full/%(year)s.xml', params, callback

  getTeamSeasonalStatistics: (year, callback) ->
    [params, callback] = this.getYearParams year, callback
    this.getResource '/seasontd/teams/%(year)s.xml', params, callback

  getPlayersSeasonalStatistics: (year, callback) ->
    [params, callback] = this.getYearParams year, callback
    this.getResource '/seasontd/players/%(year)s.xml', params, callback

  getYearParams: (year, callback) ->
    if typeof year is 'function'
      callback = year
      year = null
    if not year
      year = new Date().getFullYear()
    if not year.year
      year = {year: year}

    [year, callback]

  ###

  EventID based functions

  ###

  getEvent: (eventId, callback) ->
    [params, callback] = this.getEventParams eventId, callback
    this.getResource '/event/%(eventId)s.xml', params, callback

  getEventStatistics: (eventId, callback) ->
    [params, callback] = this.getEventParams eventId, callback
    this.getResource '/statistics/%(eventId)s.xml', params, callback

  getEventPlayByPlay: (eventId, callback) ->
    [params, callback] = this.getEventParams eventId, callback
    this.getResource '/pbp/%(eventId)s.xml', params, callback

  getEventBoxscore: (eventId, callback) ->
    [params, callback] = this.getEventParams eventId, callback
    this.getResource '/boxscore/%(eventId)s.xml', params, callback

  getEventParams: (eventId, callback) ->
    if not eventId or not callback
      throw new Error 'eventId and callback are required parameters'
    if not eventId.eventId
      eventId = {eventId: eventId}

    [eventId, callback]

  ###

  GameID based functions

  ###

  getGameBoxscore: (gameId, callback) ->
    [params, callback] = this.getGameParams gameId, callback
    this.getResource '/games/%(gameId)s/boxscore.xml', params, callback

  getGameSummary: (gameId, callback) ->
    [params, callback] = this.getGameParams gameId, callback
    this.getResource '/games/%(gameId)s/summary.xml', params, callback

  getGameParams: (gameId, callback) ->
    if not gameId or not callback
      throw new Error 'gameId and callback are required parameters'
    if not gameId.gameId
      gameId = {gameId: gameId}

    [gameId, callback]

  ###

  PlayerID based functions

  ###

  getPlayerProfile: (playerId, callback) ->
    if not playerId or not callback
      throw new Error 'playerId and callback are required parameters'
    if not playerId.playerId
      playerId = {playerId: playerId}

    this.getResource '/player/profile/%(playerId)s.xml', playerId, callback

  ###

  HELPER FUNCTIONS

  ###

  getDailyParams: (date, callback) ->
    if typeof date is 'function'
      callback = date
      date = null
    if not date
      date = new Date()
    if not date.date
      date = {date: date}
    if date.date not instanceof Date
      try
        date.date = new Date(date.date)
      catch e
        date.date = new Date()

    date = moment(date.date)
    params =
      year: date.format('YYYY')
      month: date.format('MM')
      day: date.format('DD')

    return [params, callback]

  getResource: (pattern, params, callback) ->
    if typeof params is 'function'
      callback = params
      params = {}

    try
      options = this.getHttpOptions pattern, params
    catch e
      return callback e

    this.performHttpGet options, callback

  getHttpOptions: (pattern, params) ->
    if typeof params is 'undefined'
      params = {}

    path = "/#{@league}-"
    if (@testLeague)
      path += "test-"
    path += "#{@accessLevel + @version + sprintf(pattern, params) + sprintf('?api_key=%s', @apiKey)}"

    options =
      hostname: @domain
      path: path

  performHttpGet: (options, callback) ->
    @parser.reset()

    # TODO: This should be only done in INFO mode
    console.log options

    req = http.get options, (res) =>
      res.setEncoding('utf8')
      data = ''

      res.on 'data', (body) ->
        data += body

      res.on 'end', =>
        if 200 isnt res.statusCode
          return callback 'GET returned HTTP ' + res.statusCode

        @parser.parseString data, (err, result) ->
          if err
            return callback 'Parse error: ' + err

          return callback null, result

      req.on 'error', (e) ->
        callback 'Could not get ' + options + ': ' + err.message

module.exports = SportApi

