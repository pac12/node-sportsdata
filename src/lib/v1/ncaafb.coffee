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

module.exports = NCAAFB
