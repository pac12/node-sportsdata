http = require 'http'
xml2js = require 'xml2js'

class MLB
  constructor: (@apiKey, @accessLevel) ->
    if not apiKey
      throw new Error 'You must provide an API Key'
    if not accessLevel
      throw new Error 'You must provide an Access Level'

    @parser = new xml2js.Parser {
      trim: true
      normalize: true,
      mergeAttrs: true,
      explicitArray: false,
    }

  getTeamsHierarchy: (year, callback) ->
    if not year
      throw new Error 'Year is a required parameter'

    @parser.reset()

    req = http.get "http://api.sportsdatallc.org/mlb-#{@accessLevel}3/teams/#{year}.xml?api_key=#{@apiKey}", (res) =>
      res.setEncoding('utf8')
      data = ''

      res.on 'data', (body) ->
        data += body

      res.on 'end', =>
        if 200 isnt res.statusCode
          return callback 'Get Teams Hierarchy returned HTTP ' + res.statusCode

        @parser.parseString data, (err, result) ->
          if err
            return callback 'Parse error: ' + err

          return callback null, result

    req.on 'error', (e) ->
      console.log 'Got Error: ' + e.message

module.exports = MLB

