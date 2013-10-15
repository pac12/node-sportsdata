'use strict'
should = require 'should'
nock = require 'nock'

NCAAMB = require '../../lib/v3/ncaamb.js'

describe 'V3 NCAAMB', ->
  ncaamb = new NCAAMB 'api-key', 't'
  badNcaamb = new NCAAMB 'bad-key', 't'

  describe '#getSchedule()', ->
    scope = undefined
    before ->
      scope = nock('http://api.sportsdatallc.org')
        .get('/ncaamb-t3/games/2013/REG/schedule.xml?api_key=bad-key')
        .replyWithFile(403, __dirname + '/replies/api-key-error.txt')
        .get("/ncaamb-t3/games/#{new Date().getFullYear()}/REG/schedule.xml?api_key=api-key")
        .replyWithFile(200, __dirname + '/replies/ncaamb-schedule-200.txt')
        .get("/ncaamb-t3/games/2013/REG/schedule.xml?api_key=api-key")
        .replyWithFile(200, __dirname + '/replies/ncaamb-schedule-200.txt')
        .get("/ncaamb-t3/games/2012/REG/schedule.xml?api_key=api-key")
        .replyWithFile(200, __dirname + '/replies/ncaamb-schedule-200-empty.txt')

    it 'should be a function', ->
      ncaamb.getSchedule.should.be.a('function')

    it 'should pass error and no result with bad api key', (done) ->
      badNcaamb.getSchedule {year: 2013}, (err, result) ->
        err.should.match /HTTP 403/
        should.not.exist result
        done()

    it 'should default to current year and REG', (done) ->
      ncaamb.getSchedule (err, result) ->
        should.not.exist err
        result.should.be.a 'object'
        done()

    it 'should pass no error and schedule as result on 200', (done) ->
      ncaamb.getSchedule {year: 2013}, (err, result) ->
        should.not.exist err
        result.should.be.a 'object'
        result.league.should.be.a 'object'
        result.league['season-schedule'].should.be.a 'object'
        result.league['season-schedule'].games.should.be.a 'object'
        result.league['season-schedule'].games.game.should.be.an.instanceOf Array
        result.league['season-schedule'].games.game.should.have.length 37
        done()

    it 'should pass no error and empty schedule as result on 200 and no schedule', (done) ->
      ncaamb.getSchedule {year: 2012}, (err, result) ->
        should.not.exist err
        result.should.be.a 'object'
        result.league['season-schedule'].games.should.be.a 'string'
        result.league['season-schedule'].games.should.be.empty
        done()

    after ->
      scope.done()
