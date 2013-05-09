class MLB
  constructor: (@apiKey, @accessLevel) ->
    if not apiKey
      throw new Error 'You must provide an API Key'
    if not accessLevel
      throw new Error 'You must provide an Access Level'

module.exports = MLB

