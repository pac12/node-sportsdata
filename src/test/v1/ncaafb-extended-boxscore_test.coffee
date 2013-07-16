'use strict'
should = require 'should'
nock = require 'nock'

NCAAFB = require '../../lib/v1/ncaafb.js'

describe 'V1 NCAAFB', ->
  ncaafb = new NCAAFB 'api-key', 't'
  badNcaafb = new NCAAFB 'bad-key', 't'

  describe '#getExtendedBoxscore()', ->
    scope = undefined

    before ->
      scope = nock('http://api.sportsdatallc.org')
        .get('/ncaafb-t1/2013/REG/1/MICH/MSU/extended-boxscore.xml?api_key=bad-key')
        .replyWithFile(403, __dirname + '/replies/api-key-error.txt')
        .get("/ncaafb-t1/#{new Date().getFullYear()}/REG/1/MICH/MSU/extended-boxscore.xml?api_key=api-key")
        .replyWithFile(200, __dirname + '/replies/ncaafb-extended-boxscore-200.txt')
        .get("/ncaafb-t1/2013/REG/1/MICH/MSU/extended-boxscore.xml?api_key=api-key")
        .replyWithFile(200, __dirname + '/replies/ncaafb-extended-boxscore-200.txt')
        .get("/ncaafb-t1/2013/REG/1/MICH/OSU/extended-boxscore.xml?api_key=api-key")
        .reply(404)

    it 'should be a function', ->
      ncaafb.getExtendedBoxscore.should.be.a('function')

    it 'should pass error and no result with missing away param', (done) ->
      ncaafb.getExtendedBoxscore (err, result) ->
        err.should.match /property "away" does not exist/
        should.not.exist result
        done()

    it 'should pass error and no result with missing home param', (done) ->
      ncaafb.getExtendedBoxscore {away: 'MICH'}, (err, result) ->
        err.should.match /property "home" does not exist/
        should.not.exist result
        done()

    it 'should pass error and no result with bad api key', (done) ->
      badNcaafb.getExtendedBoxscore {away: 'MICH', home: 'MSU'}, (err, result) ->
        err.should.match /HTTP 403/
        should.not.exist result
        done()

    it 'should default to current year, REG, and week 1', (done) ->
      ncaafb.getExtendedBoxscore {away: 'MICH', home: 'MSU'}, (err, result) ->
        should.not.exist err
        result.should.be.a 'object'
        done()

    it 'should pass no error and schedule as result on 200', (done) ->
      ncaafb.getExtendedBoxscore {year: 2013, away: 'MICH', home: 'MSU'}, (err, result) ->
        should.not.exist err
        result.should.be.a 'object'
        result.game.should.be.a 'object'
        result.game.home.should.match /MSU/
        result.game.away.should.match /MICH/
        result.game.team.should.be.an.instanceOf Array
        result.game.team.should.have.length(2)
        result.game.possession.should.be.a 'object'
        result.game.last_event.should.be.a 'object'
        result.game.scoring_drives.should.be.a 'object'
        done()

    it 'should pass error and no result with bad param', (done) ->
      ncaafb.getExtendedBoxscore {year: 2013, away: 'MICH', home: 'OSU'}, (err, result) ->
        err.should.match /HTTP 404/
        should.not.exist result
        done()

    after ->
      scope.done()
