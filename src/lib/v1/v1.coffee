SportApi = require '../sport-api'

class V1 extends SportApi
  version: 1

  getWeeklySchedule: (params, callback) ->
    [params, callback] = this.getYearSeasonWeekParams(params, callback)
    this.getResource '/%(year)s/%(season)s/%(week)s/schedule.xml', params, callback

  getYearSeasonWeekParams: (params, callback) ->
    if typeof params is 'function'
      callback = params
      params = {}
    if not params.year
      params.year = new Date().getFullYear()
    if not params.season
      params.season = 'REG'
    if not params.week
      params.week = 1

    [params, callback]

module.exports = V1
