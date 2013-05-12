SportApi = require '../sport-api'

class NFL extends SportApi
  league: 'nfl'
  version: 1

  getTeamsHierarchy: (callback) ->
    this.getResource '/teams/hierarchy.xml', callback

module.exports = NFL
