SportApi = require '../sport-api'

class MLB extends SportApi
  league: 'mlb'
  version: 3

  getVenueInfo: (callback) ->
    this.getResource '/venues/venues.xml', callback

  ###

  Date based functions

  ###

  getDailySchedule: (date, callback) ->
    [params, callback] = this.getDailyParams date, callback
    this.getResource '/daily/schedule/%(year)s/%(month)s/%(day)s.xml', params, callback

  getDailyEvents: (date, callback) ->
    [params, callback] = this.getDailyParams date, callback
    this.getResource '/daily/event/%(year)s/%(month)s/%(day)s.xml', params, callback

  getDailyBoxscore: (date, callback) ->
    [params, callback] = this.getDailyParams date, callback
    this.getResource '/daily/boxscore/%(year)s/%(month)s/%(day)s.xml', params, callback

module.exports = MLB
