'use strict'
should = require 'should'
nock = require 'nock'
moment = require 'moment'

MLB = require '../../lib/v3/mlb.js'

describe 'V3 MLB', ->
  mlb = new MLB 'api-key', 't'
  badMlb = new MLB 'bad-key', 't'

  describe '#getDailyEvents()', ->
    scope = undefined
    now = moment()
    nowUrl = "/mlb-t3/daily/event
/#{ now.format('YYYY') }
/#{ now.format('MM') }
/#{ now.format('DD') }
.xml?api_key=api-key"
    before ->
      scope = nock('http://api.sportsdatallc.org')
        .get(nowUrl)
        .replyWithFile(200, __dirname + '/replies/daily-events-200.txt')
        .get('/mlb-t3/daily/event/2013/05/10.xml?api_key=bad-key')
        .replyWithFile(403, __dirname + '/replies/api-key-error.txt')
        .get('/mlb-t3/daily/event/2013/05/10.xml?api_key=api-key')
        .replyWithFile(200, __dirname + '/replies/daily-events-200.txt')
        .get('/mlb-t3/daily/event/2013/05/10.xml?api_key=api-key')
        .replyWithFile(200, __dirname + '/replies/daily-events-200.txt')
        .get('/mlb-t3/daily/event/2013/05/10.xml?api_key=api-key')
        .replyWithFile(200, __dirname + '/replies/daily-events-200.txt')
        .get('/mlb-t3/daily/event/2013/07/15.xml?api_key=api-key')
        .replyWithFile(200, __dirname + '/replies/daily-events-200-empty.txt')

    it 'should be a function', ->
      mlb.getDailyEvents.should.be.a('function')

    it 'should default to current date', (done) ->
      mlb.getDailyEvents (err, result) ->
        should.not.exist err
        result.should.be.a 'object'
        done()

    it 'should pass error and no result with bad api key', (done) ->
      badMlb.getDailyEvents new Date('2013-05-10 00:00:00'), (err, result) ->
        err.should.match /HTTP 403/
        should.not.exist result
        done()

    it 'should pass no error and events as result on 200', (done) ->
      mlb.getDailyEvents new Date('2013-05-10 00:00:00'), (err, result) ->
        should.not.exist err
        result.should.be.a 'object'
        result.events.should.be.a 'object'
        result.events.event.should.be.an.instanceOf Array
        result.events.event[0].should.be.a 'object'
        result.events.event[0].season_type.should.match /REG/
        result.events.event[0].game.should.be.a 'object'
        result.events.event[0].game.visitor.should.be.a 'object'
        result.events.event[0].game.home.should.be.a 'object'
        done()

    it 'should support date object literal param', (done) ->
      params = { date: new Date('2013-05-10 00:00:00') }
      mlb.getDailyEvents params, (err, result) ->
        should.not.exist err
        result.should.be.a 'object'
        result.events.should.be.a 'object'
        result.events.event.should.be.an.instanceOf Array
        result.events.event[0].should.be.a 'object'
        result.events.event[0].season_type.should.match /REG/
        result.events.event[0].game.should.be.a 'object'
        result.events.event[0].game.visitor.should.be.a 'object'
        result.events.event[0].game.home.should.be.a 'object'
        done()

    it 'should support string param', (done) ->
      mlb.getDailyEvents '2013-05-10 00:00:00', (err, result) ->
        should.not.exist err
        result.should.be.a 'object'
        result.events.should.be.a 'object'
        result.events.event.should.be.an.instanceOf Array
        result.events.event[0].should.be.a 'object'
        result.events.event[0].season_type.should.match /REG/
        result.events.event[0].game.should.be.a 'object'
        result.events.event[0].game.visitor.should.be.a 'object'
        result.events.event[0].game.home.should.be.a 'object'
        done()

    it 'should pass no error and empty events as result on 200 and no events', (done) ->
      mlb.getDailyEvents new Date('2013-07-15 00:00:00'), (err, result) ->
        should.not.exist err
        result.should.be.a 'object'
        result.events.should.be.a 'object'
        should.not.exist result.events.event
        done()

    after ->
      scope.done()
