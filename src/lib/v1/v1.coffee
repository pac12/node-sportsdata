SportApi = require '../sport-api'

class V1 extends SportApi
  version: 1

  getWeeklySchedule: (callback) ->

module.exports = V1
