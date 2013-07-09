V1 = require './v1'

class NFL extends V1
  league: 'nfl'

  getTeamsHierarchy: (callback) ->
    this.getResource '/teams/hierarchy.xml', callback

module.exports = NFL
