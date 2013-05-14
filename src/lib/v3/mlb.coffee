SportApi = require '../sport-api'
moment = require 'moment'

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

  getDailyParams: (date, callback) ->
    if typeof date is 'function'
      callback = date
      date = null
    if not date
      date = new Date()
    if not date.date
      date = {date: date}
    if date.date not instanceof Date
      date.date = new Date()

    date = moment(date.date)
    params =
      year: date.format('YYYY')
      month: date.format('MM')
      day: date.format('DD')

    return [params, callback]

module.exports = MLB
