'use strict'
should = require 'should'
nock = require 'nock'

MLB = require '../../lib/v3/mlb.js'

describe 'V3 MLB', ->
  mlb = new MLB 'api-key', 't'
  badMlb = new MLB 'bad-key', 't'

  describe '#getTeamSeasonalStatistics()', ->
    scope = undefined
    before ->
      scope = nock('http://api.sportsdatallc.org')
        .get("/mlb-t3/seasontd/teams/#{new Date().getFullYear()}.xml?api_key=api-key")
        .replyWithFile(200, __dirname + '/replies/team-stats-200.txt')
        .get('/mlb-t3/seasontd/teams/2013.xml?api_key=bad-key')
        .replyWithFile(403, __dirname + '/replies/api-key-error.txt')
        .get('/mlb-t3/seasontd/teams/2013.xml?api_key=api-key')
        .replyWithFile(200, __dirname + '/replies/team-stats-200.txt')
        .get('/mlb-t3/seasontd/teams/2010.xml?api_key=api-key')
        .replyWithFile(200, __dirname + '/replies/team-stats-200-empty.txt')

    it 'should be a function', ->
      mlb.getTeamSeasonalStatistics.should.be.a('function')

    it 'should default to current year', (done) ->
      mlb.getTeamSeasonalStatistics (err, result) ->
        should.not.exist err
        result.should.be.a 'object'
        done()

    it 'should pass error and no result with bad api key', (done) ->
      badMlb.getTeamSeasonalStatistics 2013, (err, result) ->
        err.should.match /HTTP 403/
        should.not.exist result
        done()

    it 'should pass no error and rosters as result on 200', (done) ->
      mlb.getTeamSeasonalStatistics 2013, (err, result) ->
        should.not.exist err
        result.should.be.a 'object'
        result.statistics.should.be.a 'object'
        result.statistics.team.should.be.an.instanceOf(Array).with.lengthOf(30)
        result.statistics.team[0].should.be.a 'object'
        result.statistics.team[0].hitting.should.be.a 'object'
        result.statistics.team[0].pitching.should.be.a 'object'
        done()

    it 'should pass no error and empty rosters as result on 200 and no rosters', (done) ->
      mlb.getTeamSeasonalStatistics 2010, (err, result) ->
        should.not.exist err
        result.should.be.a 'object'
        result.statistics.should.be.a 'object'
        should.not.exist result.statistics.team
        done()

    after ->
      scope.done()
