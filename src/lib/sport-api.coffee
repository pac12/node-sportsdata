http = require 'http'
sprintf = require('sprintf-js').sprintf
xml2js = require 'xml2js'

class SportApi
  domain: 'api.sportsdatallc.org'
  parser: new xml2js.Parser {
    trim: true
    normalize: true
    mergeAttrs: true
    explicitArray: false
  }

  constructor: (@apiKey, @accessLevel) ->
    if not apiKey
      throw new Error 'You must provide an API Key'
    if not accessLevel
      throw new Error 'You must provide an Access Level'

  getTeamsHierarchy: (year, callback) ->
    if not year
      throw new Error 'Year is a required parameter'

    this.getResource '/teams/%(year)s', { year: year }, callback

  getResource: (pattern, params, callback) ->
    options = this.getHttpOptions pattern, params
    this.performHttpGet options, callback

  getHttpOptions: (pattern, params) ->
    if typeof params is 'undefined'
      params = {}

    options =
      hostname: @domain
      path: "/#{@league}-#{@accessLevel + @version + sprintf(pattern, params) + sprintf('.xml?api_key=%s', @apiKey)}"

  performHttpGet: (options, callback) ->
    @parser.reset()
    req = http.get options, (res) =>
      res.setEncoding('utf8')
      data = ''

      res.on 'data', (body) ->
        data += body

      res.on 'end', =>
        if 200 isnt res.statusCode
          return callback 'GET returned HTTP ' + res.statusCode

        @parser.parseString data, (err, result) ->
          if err
            return callback 'Parse error: ' + err

          return callback null, result

      req.on 'error', (e) ->
        callback 'Could not get ' + options + ': ' + err.message

module.exports = SportApi
