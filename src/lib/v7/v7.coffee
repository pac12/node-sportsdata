sprintf = require('sprintf-js').sprintf
SportApi = require '../sport-api'

class V7 extends SportApi
  version: 7

  getWeeklySchedule: (params, callback) ->
    params = this.getYearSeasonWeekParams(params)
    this.getResource '/games/%(year)s/%(season)s/%(week)s/schedule.xml', params, callback

  getDailySchedule: (date, callback) ->
    [params, callback] = this.getDailyParams date, callback
    this.getResource '/games/%(year)s/%(month)s/%(day)s/schedule.xml', params, callback

  getExtendedBoxscore: (params, callback) ->
    this.getResource '/games/%(gameId)s/boxscore.xml', params, callback

  getDailyStandings: (params, callback) ->
    params = this.getYearSeasonWeekParams(params)
    this.getResource '/seasons/%(year)s/%(season)s/standings/season.xml', params, callback

  getStandings: (params, callback) ->
    params = this.getYearSeasonWeekParams(params)
    this.getResource '/seasons/%(year)s/%(season)s/standings.xml', params, callback

  getGameStatistics: (params, callback) ->
    this.getResource '/games/%(gameId)s/statistics.xml', params, callback

  getPlayByPlay: (params, callback) ->
    this.getResource '/games/%(gameId)s/pbp.xml', params, callback

  getRankings: (params,callback) ->
    [params] = this.getYearWeekParams params
    this.getResource '/polls/%(poll_type)s/%(year)s/rankings.xml', params, callback

  getCfpRankings: (params,callback) ->
    [params] = this.getYearWeekParams params
    this.getResource '/polls/CFP25/%(year)s/%(week)s/rankings.xml', params, callback

  getYearSeasonWeekParams: (params, callback) ->
    if typeof params is 'function'
      callback = params
      params = {}
    if not params
      params = {}
    if not params.year
      params.year = new Date().getFullYear()
    if not params.season
      params.season = 'REG'
    if not params.week
      params.week = 1

    params

  getYearWeekParams: (params, callback) ->
    if typeof params is 'function'
      callback = params
      params = {}
    if not params
      params = {}
    if not params.week
      week = new Date()
      week.setHours(0,0,0)
      week.setDate(week.getDate()+1-(week.getDay()||7))
      week = Math.ceil((((week-new Date(week.getFullYear(),0,1))/8.64e7)+1)/7)
      if week < 10
        seasonWeek = (week + 52) - 34
      else if week < 35
        seasonWeek = 1
      else
        seasonWeek = week - 34
      params.week = seasonWeek

    if not params.year
      if week < 10
        params.year = new Date().getFullYear() - 1
      if week >= 10
        params.year = new Date().getFullYear()
    if not params.poll_type
      params.poll_type = 'AP25'

    [params]

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

    path = "/#{@league}"
    if (@testLeague)
      path += "-test"
    path += "/#{@accessLevel}/v#{@version}/en"
    path += sprintf(pattern, params)
    path += sprintf('?api_key=%s', @apiKey)

    options =
      hostname: @domain
      path: path


module.exports = V7
