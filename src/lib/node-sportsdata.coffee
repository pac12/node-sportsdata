###

node-sportsdata
https://github.com/pac12/node-sportsdata

Copyright (c) 2013 PAC-12
Licensed under the MIT license.

###

'use strict'

MLB    = require './v3/mlb'
NBA    = require './v2/nba'
NCAAFB  = require './v1/ncaafb'
NCAAMB = require './v2/ncaamb'
NFL    = require './v1/nfl'

exports.awesome = ()->
  'awesome'

exports.v3 = {
  mlb: (apiKey, accessLevel, testLeague) ->
    new MLB apiKey, accessLevel, testLeague
}

exports.v2 = {
  nba: (apiKey) ->
    new NBA apiKey
  ncaamb: (apiKey) ->
    new NCAAMB apiKey
}

exports.v1 = {
  ncaafb: (apiKey, accessLevel, testLeague) ->
    new NCAAFB apiKey, accessLevel, testLeague
  nfl: (apiKey, accessLevel, testLeague) ->
    new NFL apiKey, accessLevel, testLeague
}
