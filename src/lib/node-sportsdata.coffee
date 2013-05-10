###

node-sportsdata
https://github.com/pac12/node-sportsdata

Copyright (c) 2013 PAC-12
Licensed under the MIT license.

###

'use strict'

MLB    = require './v3/mlb'
NBA    = require './v2/nba'
NCAAF  = require './v1/ncaaf'
NCAAMB = require './v2/ncaamb'
NFL    = require './v1/nfl'

exports.awesome = ()->
  'awesome'

exports.v3 = {
  mlb: (apiKey, accessLevel) ->
    new MLB apiKey, accessLevel
}

exports.v2 = {
  nba: (apiKey) ->
    new NBA apiKey
  ncaamb: (apiKey) ->
    new NCAAMB apiKey
}

exports.v1 = {
  ncaaf: (apiKey) ->
    new NCAAF apiKey
  nfl: (apiKey, accessLevel) ->
    new NFL apiKey, accessLevel
}
