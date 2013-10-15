'use strict'
should = require 'should'
nock = require 'nock'

NCAAMB = require '../../lib/v3/ncaamb.js'

describe 'V3 NCAAMB', ->
  ncaamb = new NCAAMB 'api-key', 't'
  badNcaamb = new NCAAMB 'bad-key', 't'

  describe '#getTournamentSchedule()', ->
    scope = undefined
    before ->
      scope = nock('http://api.sportsdatallc.org')
        .get('/ncaamb-t3/tournaments/ab0754a7-2a19-4e22-987a-c45ce217ea60/schedule.xml?api_key=bad-key')
        .replyWithFile(403, __dirname + '/replies/api-key-error.txt')
        .get('/ncaamb-t3/tournaments/bad-tournament-id/schedule.xml?api_key=api-key')
        .reply(404, '')
        .get('/ncaamb-t3/tournaments/ab0754a7-2a19-4e22-987a-c45ce217ea60/schedule.xml?api_key=api-key')
        .replyWithFile(200, __dirname + '/replies/ncaamb-tournament-schedule-200.txt')
        .get('/ncaamb-t3/tournaments/ab0754a7-2a19-4e22-987a-c45ce217ea60/schedule.xml?api_key=api-key')
        .replyWithFile(200, __dirname + '/replies/ncaamb-tournament-schedule-200.txt')

    it 'should be a function', ->
      ncaamb.getTournamentSchedule.should.be.a('function')

    it 'should should throw error without tournamentId', ->
      (->
        ncaamb.getTournamentSchedule()
      ).should.throwError(/required/)

    it 'should pass error and no result with bad api key', (done) ->
      badNcaamb.getTournamentSchedule 'ab0754a7-2a19-4e22-987a-c45ce217ea60', (err, result) ->
        err.should.match /HTTP 403/
        should.not.exist result
        done()

    it 'should pass error and not result with bad tournament id', (done) ->
      ncaamb.getTournamentSchedule 'bad-tournament-id', (err, result) ->
        err.should.match /HTTP 404/
        should.not.exist result
        done()

    it 'should pass no error and teams as result on 200', (done) ->
      ncaamb.getTournamentSchedule 'ab0754a7-2a19-4e22-987a-c45ce217ea60', (err, result) ->
        should.not.exist err
        result.should.be.a 'object'
        result.league['tournament-schedule'].should.be.a 'object'
        result.league['tournament-schedule'].name.should.match /Las Vegas Invitational/
        result.league['tournament-schedule'].round.should.be.an.instanceOf Array
        done()

    it 'should support object literal as param', (done) ->
      params = { tournamentId: 'ab0754a7-2a19-4e22-987a-c45ce217ea60' }
      ncaamb.getTournamentSchedule params, (err, result) ->
        should.not.exist err
        result.should.be.a 'object'
        result.league['tournament-schedule'].should.be.a 'object'
        result.league['tournament-schedule'].name.should.match /Las Vegas Invitational/
        result.league['tournament-schedule'].round.should.be.an.instanceOf Array
        done()

    after ->
      scope.done()
