SportApi = require '../sport-api'
moment = require 'moment'

class NCAAMB extends SportApi
  league: 'ncaamb'
  version: 3

  getSchedule: (params, callback) ->
    [params, callback] = this.getYearSeasonParams params, callback
    this.getResource '/games/%(year)s/%(season)s/schedule.xml', params, callback

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

module.exports = NCAAMB
