V1 = require './v1'

class NCAAFB extends V1
  league: 'ncaafb'

  getTeamsHierarchy: (division, callback) ->
    [params, callback] = this.getDivisionParams(division, callback)
    this.getResource '/teams/%(division)s/hierarchy.xml', params, callback

  getDivisionParams: (division, callback) ->
    if typeof division is 'function'
      callback = division
      division = null
    if not division
      division = 'FBS'
    if not division.division
      division = {division: division}

    [division, callback]

  getStandings: (params, callback) ->
    [params, callback] = this.getYearSeasonParams params, callback
    this.getResource '/teams/FBS/%(year)s/%(season)s/standings.xml', params, callback


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
    this.getResource '/polls/AP25/%(year)s/%(week)s/rankings.xml', params, callback

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

    [params, callback]

module.exports = NCAAFB
