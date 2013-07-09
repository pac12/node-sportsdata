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

module.exports = NCAAFB
