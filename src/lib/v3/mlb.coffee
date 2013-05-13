SportApi = require '../sport-api'
moment = require 'moment'

class MLB extends SportApi
  league: 'mlb'
  version: 3

  getDailySchedule: (date, callback) ->
    if typeof date is 'function'
      callback = date
      date = null
    if not date or date not instanceof Date
      date = new Date()

    date = moment(date)
    params =
      year: date.format('YYYY')
      month: date.format('MM')
      day: date.format('DD')

    this.getResource '/daily/schedule/%(year)s/%(month)s/%(day)s.xml', params, callback

  getVenueInfo: (callback) ->
    this.getResource '/venues/venues.xml', callback

  getDailyEvents: (date, callback) ->
    if typeof date is 'function'
      callback = date
      date = null
    if not date or date not instanceof Date
      date = new Date()

    date = moment(date)
    params =
      year: date.format('YYYY')
      month: date.format('MM')
      day: date.format('DD')

    this.getResource '/daily/event/%(year)s/%(month)s/%(day)s.xml', params, callback

module.exports = MLB
