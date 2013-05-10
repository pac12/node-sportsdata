'use strict'
should = require 'should'
nock = require 'nock'

MLB = require '../../lib/v3/mlb.js'

describe 'V3 MLB', ->
  mlb = new MLB 'api-key', 't'
  badMlb = new MLB 'bad-key', 't'

  describe '#getLeagueSchedule()', ->
    scope = undefined
    before ->
      scope = nock('http://api.sportsdatallc.org')
        .get("/mlb-t3/schedule/#{new Date().getFullYear()}.xml?api_key=api-key")
        .replyWithFile(200, __dirname + '/replies/league-schedule-200.txt')
        .get('/mlb-t3/schedule/2013.xml?api_key=bad-key')
        .replyWithFile(403, __dirname + '/replies/api-key-error.txt')
        .get('/mlb-t3/schedule/2013.xml?api_key=api-key')
        .replyWithFile(200, __dirname + '/replies/league-schedule-200.txt')
        .get('/mlb-t3/schedule/2011.xml?api_key=api-key')
        .replyWithFile(200, __dirname + '/replies/league-schedule-200-empty.txt')

    it 'should be a function', ->
      mlb.getLeagueSchedule.should.be.a('function')

    it 'should default to current year', (done) ->
      mlb.getLeagueSchedule (err, result) ->
        should.not.exist err
        result.should.be.a 'object'
        done()

    it 'should pass error and no result with bad api key', (done) ->
      badMlb.getLeagueSchedule 2013, (err, result) ->
        err.should.match /HTTP 403/
        should.not.exist result
        done()

    it 'should pass no error and teams as result on 200', (done) ->
      mlb.getLeagueSchedule 2013, (err, result) ->
        should.not.exist err
        result.should.be.a 'object'
        result.calendars.should.be.a 'object'
        result.calendars.event.should.be.an.instanceOf Array
        result.calendars.event[0].should.be.a 'object'
        result.calendars.event[0].season_type.should.match /REG/
        done()

    it 'should pass no error and empty teams as result on 200 and no teams', (done) ->
      mlb.getLeagueSchedule 2011, (err, result) ->
        should.not.exist err
        result.should.be.a 'object'
        result.calendars.should.be.a 'object'
        should.not.exist result.calendars.event
        done()

    after ->
      scope.done()

  describe '#getTeamsHierarchy()', ->
    scope = undefined
    before ->
      scope = nock('http://api.sportsdatallc.org')
        .get("/mlb-t3/teams/#{new Date().getFullYear()}.xml?api_key=api-key")
        .replyWithFile(200, __dirname + '/replies/teams-200.txt')
        .get('/mlb-t3/teams/2013.xml?api_key=bad-key')
        .replyWithFile(403, __dirname + '/replies/api-key-error.txt')
        .get('/mlb-t3/teams/2013.xml?api_key=api-key')
        .replyWithFile(200, __dirname + '/replies/teams-200.txt')
        .get('/mlb-t3/teams/2010.xml?api_key=api-key')
        .replyWithFile(200, __dirname + '/replies/teams-200-empty.txt')

    it 'should be a function', ->
      mlb.getTeamsHierarchy.should.be.a('function')

    it 'should default to current year', (done) ->
      mlb.getTeamsHierarchy (err, result) ->
        should.not.exist err
        result.should.be.a 'object'
        done()

    it 'should pass error and no result with bad api key', (done) ->
      badMlb.getTeamsHierarchy 2013, (err, result) ->
        err.should.match /HTTP 403/
        should.not.exist result
        done()

    it 'should pass no error and teams as result on 200', (done) ->
      mlb.getTeamsHierarchy 2013, (err, result) ->
        should.not.exist err
        result.should.be.a 'object'
        result.teams.should.be.a 'object'
        result.teams.team.should.be.an.instanceOf Array
        result.teams.team[0].should.be.a 'object'
        result.teams.team[0].abbr.should.match /LA/
        done()

    it 'should pass no error and empty teams as result on 200 and no teams', (done) ->
      mlb.getTeamsHierarchy 2010, (err, result) ->
        should.not.exist err
        result.should.be.a 'object'
        result.teams.should.be.a 'object'
        should.not.exist result.teams.team
        done()

    after ->
      scope.done()
