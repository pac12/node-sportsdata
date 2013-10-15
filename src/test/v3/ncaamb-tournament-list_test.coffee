'use strict'
should = require 'should'
nock = require 'nock'
moment = require 'moment'

NCAAMB = require '../../lib/v3/ncaamb.js'

describe 'V3 NCAAMB', ->
  ncaamb = new NCAAMB 'api-key', 't'
  badNcaamb = new NCAAMB 'bad-key', 't'

  describe '#getTournamentList()', ->
    scope = undefined
    now = moment()
    before ->
      scope = nock('http://api.sportsdatallc.org')
        .get('/ncaamb-t3/tournaments/2013/REG/schedule.xml?api_key=bad-key')
        .replyWithFile(403, __dirname + '/replies/api-key-error.txt')
        .get("/ncaamb-t3/tournaments/#{new Date().getFullYear()}/REG/schedule.xml?api_key=api-key")
        .replyWithFile(200, __dirname + '/replies/ncaamb-tournament-list-200.txt')
        .get("/ncaamb-t3/tournaments/2013/REG/schedule.xml?api_key=api-key")
        .replyWithFile(200, __dirname + '/replies/ncaamb-tournament-list-200.txt')
        .get("/ncaamb-t3/tournaments/2012/REG/schedule.xml?api_key=api-key")
        .replyWithFile(200, __dirname + '/replies/ncaamb-tournament-list-200-empty.txt')

    it 'should be a function', ->
      ncaamb.getTournamentList.should.be.a('function')

    it 'should pass error and no result with bad api key', (done) ->
      badNcaamb.getTournamentList (err, result) ->
        err.should.match /HTTP 403/
        should.not.exist result
        done()

    it 'should default to current year and REG', (done) ->
      ncaamb.getTournamentList (err, result) ->
        should.not.exist err
        result.should.be.a 'object'
        done()

    it 'should pass no error and schedule as result on 200', (done) ->
      ncaamb.getTournamentList {year: 2013}, (err, result) ->
        should.not.exist err
        result.should.be.a 'object'
        result.league.should.be.a 'object'
        result.league['season-schedule'].should.be.a 'object'
        result.league['season-schedule'].tournament.should.be.an.instanceOf Array
        result.league['season-schedule'].tournament.should.have.length 21
        done()

    it 'should pass no error and empty schedule as result on 200 and no schedule', (done) ->
      ncaamb.getTournamentList {year: 2012}, (err, result) ->
        should.not.exist err
        result.should.be.a 'object'
        should.not.exist result.league['season-schedule'].tournament
        done()

    after ->
      scope.done()
