SportApi = require '../sport-api'

class NFL extends SportApi
  league: 'nfl'
  version: 1

  getTeamsHierarchy: (callback) ->
    this.getResource '/teams/hierarchy', {}, callback

module.exports = NFL
