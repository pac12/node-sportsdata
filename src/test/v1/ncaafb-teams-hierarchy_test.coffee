'use strict'
should = require 'should'
nock = require 'nock'

NCAAFB = require '../../lib/v1/ncaafb.js'

describe 'V1 NCAAFB', ->
  ncaafb = new NCAAFB 'api-key', 't'
  badNcaafb = new NCAAFB 'bad-key', 't'

  describe '#getTeamsHierarchy()', ->
    scope = undefined

    before ->
      scope = nock('http://api.sportsdatallc.org')
        .get("/ncaafb-t1/teams/FBS/hierarchy.xml?api_key=api-key")
        .replyWithFile(200, __dirname + '/replies/teams-ncaafb-200.txt')
        .get('/ncaafb-t1/teams/FBS/hierarchy.xml?api_key=bad-key')
        .replyWithFile(403, __dirname + '/replies/api-key-error.txt')
        .get('/ncaafb-t1/teams/FBS/hierarchy.xml?api_key=api-key')
        .replyWithFile(200, __dirname + '/replies/teams-ncaafb-200.txt')
        .get('/ncaafb-t1/teams/FCS/hierarchy.xml?api_key=api-key')
        .replyWithFile(200, __dirname + '/replies/teams-ncaafb-200-empty.txt')

    it 'should be a function', ->
      ncaafb.getTeamsHierarchy.should.be.a('function')

    it 'should default to FBS division', (done) ->
      ncaafb.getTeamsHierarchy (err, result) ->
        should.not.exist err
        result.should.be.a 'object'
        done()

    it 'should pass error and no result with bad api key', (done) ->
      badNcaafb.getTeamsHierarchy (err, result) ->
        err.should.match /HTTP 403/
        should.not.exist result
        done()

    it 'should pass no error and teams as result on 200', (done) ->
      ncaafb.getTeamsHierarchy (err, result) ->
        should.not.exist err
        result.should.be.a 'object'
        result.division.should.be.a 'object'
        result.division.conference.should.be.an.instanceOf Array
        result.division.conference[8].id.should.match /PAC-12/
        result.division.conference[8].subdivision.should.be.an.instanceOf Array
        done()

    it 'should pass no error and empty teams as result on 200 and no teams', (done) ->
      ncaafb.getTeamsHierarchy 'FCS', (err, result) ->
        should.not.exist err
        result.should.be.a 'object'
        result.division.should.be.a 'object'
        should.not.exist result.division.conference
        done()

    after ->
      scope.done()
