http = require 'http'
sprintf = require('sprintf-js').sprintf
xml2js = require 'xml2js'

class SportApi
  domain: 'api.sportsdatallc.org'
  parser: new xml2js.Parser {
    trim: true
    normalize: true
    mergeAttrs: true
    explicitArray: false
  }

  constructor: (@apiKey, @accessLevel) ->
    if not apiKey
      throw new Error 'You must provide an API Key'
    if not accessLevel
      throw new Error 'You must provide an Access Level'

  getRollingThreeDaySchedule: (callback) ->
    this.getResource '/schedule-3day', callback

  getLeagueSchedule: (year, callback) ->
    [params, callback] = this.getYearParams year, callback
    this.getResource '/schedule/%(year)s.xml', params, callback

  getTeamsHierarchy: (year, callback) ->
    [params, callback] = this.getYearParams year, callback
    this.getResource '/teams/%(year)s.xml', params, callback

  getStandings: (year, callback) ->
    [params, callback] = this.getYearParams year, callback
    this.getResource '/standings/%(year)s.xml', params, callback

  getYearParams: (year, callback) ->
    if typeof year is 'function'
      callback = year
      year = null
    if not year
      year = new Date().getFullYear()

    params = {year: year}
    return [params, callback]

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

    params = {eventId: eventId}
    return [params, callback]

  ###

  HELPER FUNCTIONS

  ###

  getResource: (pattern, params, callback) ->
    if typeof params is 'function'
      callback = params
      params = {}

    options = this.getHttpOptions pattern, params
    this.performHttpGet options, callback

  getHttpOptions: (pattern, params) ->
    if typeof params is 'undefined'
      params = {}

    options =
      hostname: @domain
      path: "/#{@league}-#{@accessLevel + @version + sprintf(pattern, params) + sprintf('?api_key=%s', @apiKey)}"

  performHttpGet: (options, callback) ->
    @parser.reset()
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

