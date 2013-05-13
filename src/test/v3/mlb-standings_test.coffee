'use strict'
should = require 'should'
nock = require 'nock'

MLB = require '../../lib/v3/mlb.js'

describe 'V3 MLB', ->
  mlb = new MLB 'api-key', 't'
  badMlb = new MLB 'bad-key', 't'

  describe '#getStandings()', ->
    scope = undefined
    before ->
      scope = nock('http://api.sportsdatallc.org')
        .get("/mlb-t3/standings/#{new Date().getFullYear()}.xml?api_key=api-key")
        .replyWithFile(200, __dirname + '/replies/standings-200.txt')
        .get('/mlb-t3/standings/2013.xml?api_key=bad-key')
        .replyWithFile(403, __dirname + '/replies/api-key-error.txt')
        .get('/mlb-t3/standings/2013.xml?api_key=api-key')
        .replyWithFile(200, __dirname + '/replies/standings-200.txt')
        .get('/mlb-t3/standings/2011.xml?api_key=api-key')
        .replyWithFile(200, __dirname + '/replies/standings-200-empty.txt')

    it 'should be a function', ->
      mlb.getStandings.should.be.a('function')

    it 'should default to current year', (done) ->
      mlb.getStandings (err, result) ->
        should.not.exist err
        result.should.be.a 'object'
        done()

    it 'should pass error and no result with bad api key', (done) ->
      badMlb.getStandings 2013, (err, result) ->
        err.should.match /HTTP 403/
        should.not.exist result
        done()

    it 'should pass no error and standings as result on 200', (done) ->
      mlb.getStandings 2013, (err, result) ->
        should.not.exist err
        result.should.be.a 'object'
        result.standings.should.be.a 'object'
        result.standings.league.should.be.an.instanceOf Array
        result.standings.league[0].should.be.a 'object'
        result.standings.league[0].id.should.match /AL/
        done()

    it 'should pass no error and empty standings as result on 200 and no standings', (done) ->
      mlb.getStandings 2011, (err, result) ->
        should.not.exist err
        result.should.be.a 'object'
        result.standings.should.be.a 'object'
        should.not.exist result.standings.league
        done()

    after ->
      scope.done()
