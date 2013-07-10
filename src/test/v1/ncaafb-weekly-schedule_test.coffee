'use strict'
should = require 'should'
nock = require 'nock'

NCAAFB = require '../../lib/v1/ncaafb.js'

describe 'V1 NCAAFB', ->
  ncaafb = new NCAAFB 'api-key', 't'
  badNcaafb = new NCAAFB 'bad-key', 't'

  describe '#getWeeklySchedule()', ->
    scope = undefined

    before ->
      scope = nock('http://api.sportsdatallc.org')
        .get('/ncaafb-t1/2013/REG/1/schedule.xml?api_key=bad-key')
        .replyWithFile(403, __dirname + '/replies/api-key-error.txt')
        .get("/ncaafb-t1/#{new Date().getFullYear()}/REG/1/schedule.xml?api_key=api-key")
        .replyWithFile(200, __dirname + '/replies/ncaafb-weekly-schedule-200.txt')
        .get("/ncaafb-t1/2013/REG/1/schedule.xml?api_key=api-key")
        .replyWithFile(200, __dirname + '/replies/ncaafb-weekly-schedule-200.txt')
        .get("/ncaafb-t1/2005/REG/1/schedule.xml?api_key=api-key")
        .replyWithFile(200, __dirname + '/replies/ncaafb-weekly-schedule-200-empty.txt')

    it 'should be a function', ->
      ncaafb.getWeeklySchedule.should.be.a('function')

    it 'should pass error and no result with bad api key', (done) ->
      badNcaafb.getWeeklySchedule (err, result) ->
        err.should.match /HTTP 403/
        should.not.exist result
        done()

    it 'should default to current year, REG, and week 1', (done) ->
      ncaafb.getWeeklySchedule (err, result) ->
        should.not.exist err
        result.should.be.a 'object'
        done()

    it 'should pass no error and schedule as result on 200', (done) ->
      ncaafb.getWeeklySchedule {year: 2013}, (err, result) ->
        should.not.exist err
        result.should.be.a 'object'
        result.games.should.be.a 'object'
        result.games.game.should.be.an.instanceOf Array
        result.games.game.should.have.length(74)
        done()

    it 'should pass no error and empty schedule as result on 200 and no schedule', (done) ->
      ncaafb.getWeeklySchedule {year: 2005}, (err, result) ->
        should.not.exist err
        result.should.be.a 'object'
        result.games.should.be.a 'object'
        should.not.exist result.games.game
        done()

    after ->
      scope.done()
