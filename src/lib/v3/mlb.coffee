SportApi = require '../sport-api'
tz = require 'timezone'
us = tz require "timezone/America"
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
      date = this.generateLosAngelesDate()
    if not date.date
      date = {date: date}
    if date.date not instanceof Date
      try
        date.date = new Date(date.date)
      catch e
        date.date = this.generateLosAngelesDate()

    date = moment(date.date)
    params =
      year: date.format('YYYY')
      month: date.format('MM')
      day: date.format('DD')

    return [params, callback]

  ###
  Default to PT date because all games for "current" day
  Should be scheduled to start during PT 24-hour day
  ###
  generateLosAngelesDate: ->
    return us new Date(), "America/Los_Angeles", '%F %T'

module.exports = MLB
