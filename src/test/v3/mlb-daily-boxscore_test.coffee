'use strict'
should = require 'should'
nock = require 'nock'
moment = require 'moment'

MLB = require '../../lib/v3/mlb.js'

describe 'V3 MLB', ->
  mlb = new MLB 'api-key', 't'
  badMlb = new MLB 'bad-key', 't'

  describe '#getDailyBoxscore()', ->
    scope = undefined
    now = moment()
    nowUrl = "/mlb-t3/daily/boxscore
/#{ now.format('YYYY') }
/#{ now.format('MM') }
/#{ now.format('DD') }
.xml?api_key=api-key"
    before ->
      scope = nock('http://api.sportsdatallc.org')
        .get(nowUrl)
        .replyWithFile(200, __dirname + '/replies/daily-boxscore-200.txt')
        .get('/mlb-t3/daily/boxscore/2013/05/10.xml?api_key=bad-key')
        .replyWithFile(403, __dirname + '/replies/api-key-error.txt')
        .get('/mlb-t3/daily/boxscore/2013/05/10.xml?api_key=api-key')
        .replyWithFile(200, __dirname + '/replies/daily-boxscore-200.txt')
        .get('/mlb-t3/daily/boxscore/2013/05/10.xml?api_key=api-key')
        .replyWithFile(200, __dirname + '/replies/daily-boxscore-200.txt')
        .get('/mlb-t3/daily/boxscore/2013/05/10.xml?api_key=api-key')
        .replyWithFile(200, __dirname + '/replies/daily-boxscore-200.txt')
        .get('/mlb-t3/daily/boxscore/2013/07/15.xml?api_key=api-key')
        .replyWithFile(200, __dirname + '/replies/daily-boxscore-200-empty.txt')

    it 'should be a function', ->
      mlb.getDailyBoxscore.should.be.a('function')

    it 'should default to current date', (done) ->
      mlb.getDailyBoxscore (err, result) ->
        should.not.exist err
        result.should.be.a 'object'
        done()

    it 'should pass error and no result with bad api key', (done) ->
      badMlb.getDailyBoxscore new Date('2013-05-10 00:00:00'), (err, result) ->
        err.should.match /HTTP 403/
        should.not.exist result
        done()

    it 'should pass no error and boxscores as result on 200', (done) ->
      mlb.getDailyBoxscore new Date('2013-05-10 00:00:00'), (err, result) ->
        should.not.exist err
        result.should.be.a 'object'
        result.boxscores.should.be.a 'object'
        result.boxscores.boxscore.should.be.an.instanceOf Array
        result.boxscores.boxscore[0].should.be.a 'object'
        result.boxscores.boxscore[0].season_type.should.match /REG/
        result.boxscores.boxscore[0].visitor.should.be.a 'object'
        result.boxscores.boxscore[0].home.should.be.a 'object'
        done()

    it 'should support date object literal param', (done) ->
      params = { date: new Date('2013-05-10 00:00:00') }
      mlb.getDailyBoxscore params, (err, result) ->
        should.not.exist err
        result.should.be.a 'object'
        result.boxscores.should.be.a 'object'
        result.boxscores.boxscore.should.be.an.instanceOf Array
        result.boxscores.boxscore[0].should.be.a 'object'
        result.boxscores.boxscore[0].season_type.should.match /REG/
        result.boxscores.boxscore[0].visitor.should.be.a 'object'
        result.boxscores.boxscore[0].home.should.be.a 'object'
        done()

    it 'should support string param', (done) ->
      mlb.getDailyBoxscore '2013-05-10 00:00:00', (err, result) ->
        should.not.exist err
        result.should.be.a 'object'
        result.boxscores.should.be.a 'object'
        result.boxscores.boxscore.should.be.an.instanceOf Array
        result.boxscores.boxscore[0].should.be.a 'object'
        result.boxscores.boxscore[0].season_type.should.match /REG/
        result.boxscores.boxscore[0].visitor.should.be.a 'object'
        result.boxscores.boxscore[0].home.should.be.a 'object'
        done()

    it 'should pass no error and empty boxscores as result on 200 and no boxscores', (done) ->
      mlb.getDailyBoxscore new Date('2013-07-15 00:00:00'), (err, result) ->
        should.not.exist err
        result.should.be.a 'object'
        result.boxscores.should.be.a 'object'
        should.not.exist result.boxscores.boxscore
        done()

    after ->
      scope.done()
