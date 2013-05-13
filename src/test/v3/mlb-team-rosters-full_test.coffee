'use strict'
should = require 'should'
nock = require 'nock'

MLB = require '../../lib/v3/mlb.js'

describe 'V3 MLB', ->
  mlb = new MLB 'api-key', 't'
  badMlb = new MLB 'bad-key', 't'

  describe '#getTeamRostersFull()', ->
    scope = undefined
    before ->
      scope = nock('http://api.sportsdatallc.org')
        .get("/mlb-t3/rosters-full/#{new Date().getFullYear()}.xml?api_key=api-key")
        .replyWithFile(200, __dirname + '/replies/team-rosters-full-200.txt')
        .get('/mlb-t3/rosters-full/2013.xml?api_key=bad-key')
        .replyWithFile(403, __dirname + '/replies/api-key-error.txt')
        .get('/mlb-t3/rosters-full/2013.xml?api_key=api-key')
        .replyWithFile(200, __dirname + '/replies/team-rosters-full-200.txt')
        .get('/mlb-t3/rosters-full/2010.xml?api_key=api-key')
        .replyWithFile(200, __dirname + '/replies/team-rosters-full-200-empty.txt')

    it 'should be a function', ->
      mlb.getTeamRostersFull.should.be.a('function')

    it 'should default to current year', (done) ->
      mlb.getTeamRostersFull (err, result) ->
        should.not.exist err
        result.should.be.a 'object'
        done()

    it 'should pass error and no result with bad api key', (done) ->
      badMlb.getTeamRostersFull 2013, (err, result) ->
        err.should.match /HTTP 403/
        should.not.exist result
        done()

    it 'should pass no error and rosters as result on 200', (done) ->
      mlb.getTeamRostersFull 2013, (err, result) ->
        should.not.exist err
        result.should.be.a 'object'
        result.rosters.should.be.a 'object'
        result.rosters.team.should.be.an.instanceOf Array
        result.rosters.team[0].should.be.a 'object'
        result.rosters.team[0].players.should.be.a 'object'
        result.rosters.team[0].players.profile.should.be.an.instanceOf(Array).with.lengthOf(34)
        done()

    it 'should pass no error and empty rosters as result on 200 and no rosters', (done) ->
      mlb.getTeamRostersFull 2010, (err, result) ->
        should.not.exist err
        result.should.be.a 'object'
        result.rosters.should.be.a 'object'
        should.not.exist result.rosters.team
        done()

    after ->
      scope.done()
