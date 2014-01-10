'use strict'
should = require 'should'
nock = require 'nock'
moment = require 'moment'

NCAAMB = require '../../lib/v3/ncaamb.js'

describe 'V3 NCAAMB', ->
  ncaamb = new NCAAMB 'api-key', 't'
  badNcaamb = new NCAAMB 'bad-key', 't'

  describe '#getStandings()', ->
    scope = undefined
    now = moment()
    nowUrl = "/ncaamb-t3/seasontd
/#{ now.format('YYYY') }
/REG/standings.xml?api_key=api-key"
    before ->
      scope = nock('http://api.sportsdatallc.org')
        .get('/ncaamb-t3/seasontd/2013/REG/standings.xml?api_key=bad-key')
        .replyWithFile(403, __dirname + '/replies/api-key-error.txt')
        .get(nowUrl)
        .replyWithFile(200, __dirname + '/replies/ncaamb-standings-200.txt')
        .get('/ncaamb-t3/seasontd/2013/REG/standings.xml?api_key=api-key')
        .replyWithFile(200, __dirname + '/replies/ncaamb-standings-200.txt')
        .get('/ncaamb-t3/seasontd/2012/REG/standings.xml?api_key=api-key')
        .replyWithFile(200, __dirname + '/replies/ncaamb-standings-200-empty.txt')

    it 'should be a function', ->
      ncaamb.getStandings.should.be.a('function')

    it 'should pass error and no result with bad api key', (done) ->
      badNcaamb.getStandings {year: 2013}, (err, result) ->
        err.should.match /HTTP 403/
        should.not.exist result
        done()

    it 'should default to current year and REG', (done) ->
      ncaamb.getStandings (err, result) ->
        should.not.exist err
        result.should.be.a 'object'
        done()

    it 'should pass no error and standings as result on 200', (done) ->
      ncaamb.getStandings {year: 2013}, (err, result) ->
        should.not.exist err
        result.should.be.a 'object'
        result.league.should.be.a 'object'
        result.league.season.should.be.a 'object'
        result.league.season.year.should.match /2013/
        result.league.season.type.should.match /REG/
        result.league.season.conference.should.be.an.instanceOf Array
        result.league.season.conference.should.have.length 2
        result.league.season.conference[1].alias.should.match /PAC12/
        result.league.season.conference[1].team.should.be.an.instanceOf Array
        result.league.season.conference[1].team.should.have.length 12
        done()

    it 'should pass no error and empty standings as result on 200 and no standings', (done) ->
      ncaamb.getStandings {year: 2012}, (err, result) ->
        should.not.exist err
        result.should.be.a 'object'
        result.league.season.should.be.a 'object'
        result.league.season.year.should.match /2012/
        result.league.season.type.should.match /REG/
        should.not.exist result.league.season.conference
        done()

    after ->
      scope.done()
