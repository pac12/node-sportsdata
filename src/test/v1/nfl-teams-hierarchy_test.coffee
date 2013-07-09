'use strict'
should = require 'should'
nock = require 'nock'

NFL = require '../../lib/v1/nfl.js'

describe 'V1 NFL', ->
  nfl = new NFL 'api-key', 't'
  badNfl = new NFL 'bad-key', 't'

  describe '#getTeamsHierarchy()', ->
    scope = undefined

    before ->
      scope = nock('http://api.sportsdatallc.org')
        .get('/nfl-t1/teams/hierarchy.xml?api_key=bad-key')
        .replyWithFile(403, __dirname + '/replies/api-key-error.txt')
        .get('/nfl-t1/teams/hierarchy.xml?api_key=api-key')
        .replyWithFile(200, __dirname + '/replies/teams-nfl-200.txt')
        .get('/nfl-t1/teams/hierarchy.xml?api_key=api-key')
        .replyWithFile(200, __dirname + '/replies/teams-nfl-200-empty.txt')

    it 'should be a function', ->
      nfl.getTeamsHierarchy.should.be.a('function')

    it 'should pass error and no result with bad api key', (done) ->
      badNfl.getTeamsHierarchy (err, result) ->
        err.should.match /HTTP 403/
        should.not.exist result
        done()

    it 'should pass no error and teams as result on 200', (done) ->
      nfl.getTeamsHierarchy (err, result) ->
        should.not.exist err
        result.should.be.a 'object'
        result.league.should.be.a 'object'
        result.league.conference.should.be.an.instanceOf Array
        result.league.conference[0].division.should.be.an.instanceOf Array
        done()

    it 'should pass no error and empty teams as result on 200 and no teams', (done) ->
      nfl.getTeamsHierarchy (err, result) ->
        should.not.exist err
        result.should.be.a 'object'
        result.league.should.be.a 'object'
        should.not.exist result.league.conference
        done()

    after ->
      scope.done()
