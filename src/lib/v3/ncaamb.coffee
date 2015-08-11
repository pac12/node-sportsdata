SportApi = require '../sport-api'

class NCAAMB extends SportApi
  league: 'ncaamb'
  version: 3

  ###

  Date based functions

  ###

  getDailySchedule: (date, callback) ->
    [params, callback] = this.getDailyParams date, callback
    this.getResource '/games/%(year)s/%(month)s/%(day)s/schedule.xml', params, callback

  ###

  Year / Season based functions

  ###

  getSchedule: (params, callback) ->
    [params, callback] = this.getYearSeasonParams params, callback
    this.getResource '/games/%(year)s/%(season)s/schedule.xml', params, callback

  getStandings: (params, callback) ->
    [params, callback] = this.getYearSeasonParams params, callback
    this.getResource '/seasontd/%(year)s/%(season)s/standings.xml', params, callback

  getTournamentList: (params, callback) ->
    [params, callback] = this.getYearSeasonParams params, callback
    this.getResource '/tournaments/%(year)s/%(season)s/schedule.xml', params, callback

  getYearSeasonParams: (params, callback) ->
    if typeof params is 'function'
      callback = params
      params = {}
    if not params
      params = {}
    if not params.year
      params.year = new Date().getFullYear()
    if not params.season
      params.season = 'REG'

    [params, callback]

  getRankings: (params,callback) ->
    [params, callback] = this.getYearWeekParams params, callback
    this.getResource '/polls/AP/%(year)s/rankings.xml', params, callback

  getYearWeekParams: (params, callback) ->
    if typeof params is 'function'
      callback = params
      params = {}
    if not params
      params = {}

    if not params.year
      now = new Date()
      year = now.getFullYear()
      start = new Date(now.getFullYear(),0,0)
      diff = now - start
      oneDay = 1000 * 60 * 60 * 24
      day = Math.floor(diff / oneDay)
      if day > 180
        params.year = year
      else
        params.year = year - 1

    [params, callback]

  ###

  TournamentID based functions

  ###

  getTournamentSchedule: (tournamentId, callback) ->
    if not tournamentId or not callback
      throw new Error 'tournamentId and callback are required parameters'
    if not tournamentId.tournamentId
      tournamentId = {tournamentId: tournamentId}

    this.getResource '/tournaments/%(tournamentId)s/schedule.xml', tournamentId, callback

module.exports = NCAAMB
