'use strict'
should = require 'should'
nock = require 'nock'
moment = require 'moment'

NCAAFB = require '../../lib/v1/ncaafb.js'

describe 'V1 NCAAFB', ->
  ncaafb = new NCAAFB 'api-key', 't'
  badNcaafb = new NCAAFB 'bad-key', 't'

  describe '#getStandings()', ->
    scope = undefined
    now = moment()
    nowUrl = "/ncaafb-t1/teams/FBS
/#{ now.format('YYYY') }
/REG/standings.xml?api_key=api-key"
    before ->
      scope = nock('http://api.sportsdatallc.org')
        .get('/ncaafb-t1/teams/FBS/2013/REG/standings.xml?api_key=bad-key')
        .replyWithFile(403, __dirname + '/replies/api-key-error.txt')
        .get(nowUrl)
        .replyWithFile(200, __dirname + '/replies/ncaafb-standings-200.txt')
        .get('/ncaafb-t1/teams/FBS/2013/REG/standings.xml?api_key=api-key')
        .replyWithFile(200, __dirname + '/replies/ncaafb-standings-200.txt')
        .get('/ncaafb-t1/teams/FBS/2011/REG/standings.xml?api_key=api-key')
        .replyWithFile(200, __dirname + '/replies/ncaafb-standings-200-empty.txt')

    it 'should be a function', ->
      ncaafb.getStandings.should.be.a('function')

    it 'should pass error and no result with bad api key', (done) ->
      badNcaafb.getStandings {year: 2013}, (err, result) ->
        err.should.match /HTTP 403/
        should.not.exist result
        done()

    it 'should default to current year and REG', (done) ->
      ncaafb.getStandings (err, result) ->
        should.not.exist err
        result.should.be.a 'object'
        done()

    it 'should pass no error and standings as result on 200', (done) ->
      ncaafb.getStandings {year: 2013}, (err, result) ->
        should.not.exist err
        result.should.be.a 'object'
        result.standings.should.be.a 'object'
        result.standings.season.should.match /2013/
        result.standings.type.should.match /REG/
        result.standings.division.id.should.match /FBS/
        result.standings.division.conference.should.be.an.instanceOf Array
        result.standings.division.conference[9].id.should.match /PAC-12/
        result.standings.division.conference[9].team.should.be.an.instanceOf Array
        result.standings.division.conference[9].team.should.have.length 12
        done()

    it 'should pass no error and empty standings as result on 200 and no standings', (done) ->
      ncaafb.getStandings {year: 2011}, (err, result) ->
        should.not.exist err
        result.should.be.a 'object'
        result.standings.should.be.a 'object'
        result.standings.season.should.match /2011/
        result.standings.type.should.match /REG/
        should.not.exist result.standings.division.conference[9].team
        done()

    after ->
      scope.done()
