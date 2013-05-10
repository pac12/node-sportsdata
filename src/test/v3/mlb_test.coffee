'use strict'
should = require 'should'
nock = require 'nock'

MLB = require '../../lib/v3/mlb.js'

describe 'V3 MLB', ->
  describe '#getTeamsHierarchy()', ->
    scope = undefined
    mlb = new MLB 'api-key', 't'

    before ->
      scope = nock('http://api.sportsdatallc.org')
        .get('/mlb-t3/teams/2013.xml?api_key=bad-key')
        .replyWithFile(403, __dirname + '/replies/api-key-error.txt')
        .get('/mlb-t3/teams/2013.xml?api_key=api-key')
        .replyWithFile(200, __dirname + '/replies/teams-200.txt')
        .get('/mlb-t3/teams/2010.xml?api_key=api-key')
        .replyWithFile(200, __dirname + '/replies/teams-200-empty.txt')

    it 'should be a function', ->
      mlb.getTeamsHierarchy.should.be.a('function')

    it 'should throw an error without year', ->
      (->
        mlb.getTeamsHierarchy()
      ).should.throwError /Year is a required parameter/

    it 'should pass error and no result with bad api key', (done) ->
      badMlb = new MLB 'bad-key', 't'
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