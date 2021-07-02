###

node-sportsdata
https://github.com/pac12/node-sportsdata

Copyright (c) 2013 PAC-12
Licensed under the MIT license.

###

'use strict'

MLB    = require './v3/mlb'
NCAAFB  = require './v1/ncaafb'
NCAAMB = require './v3/ncaamb'
NCAAWB = require './v3/ncaawb'
NFL    = require './v1/nfl'
NCAAFBv7  = require './v7/ncaafb'

exports.awesome = ()->
  'awesome'

exports.v7 = {
  ncaafb: (apiKey, accessLevel, testLeague) ->
    new NCAAFBv7 apiKey, accessLevel, testLeague
}

exports.v3 = {
  mlb: (apiKey, accessLevel, testLeague) ->
    new MLB apiKey, accessLevel, testLeague
  ncaamb: (apiKey, accessLevel, testLeague) ->
    new NCAAMB apiKey, accessLevel, testLeague
  ncaawb: (apiKey, accessLevel, testLeague) ->
    new NCAAWB apiKey, accessLevel, testLeague
}

exports.v2 = {

}

exports.v1 = {
  ncaafb: (apiKey, accessLevel, testLeague) ->
    new NCAAFB apiKey, accessLevel, testLeague
  nfl: (apiKey, accessLevel, testLeague) ->
    new NFL apiKey, accessLevel, testLeague
}
