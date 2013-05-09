class NFL
  constructor: (@apiKey) ->
    if (not apiKey)
      throw new Error 'You must provide an API Key'

module.exports = NFL

