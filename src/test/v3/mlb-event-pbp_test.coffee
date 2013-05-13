'use strict'
should = require 'should'
nock = require 'nock'

MLB = require '../../lib/v3/mlb.js'

describe 'V3 MLB', ->
  mlb = new MLB 'api-key', 't'
  badMlb = new MLB 'bad-key', 't'

  describe '#getEventPlayByPlay()', ->
    scope = undefined
    before ->
      scope = nock('http://api.sportsdatallc.org')
        .get('/mlb-t3/pbp/c8457f5d-d8ed-4949-8c92-b341e5b37fa4.xml?api_key=bad-key')
        .replyWithFile(403, __dirname + '/replies/api-key-error.txt')
        .get('/mlb-t3/pbp/bad-event-id.xml?api_key=api-key')
        .replyWithFile(412, __dirname + '/replies/event-id-error.txt')
        .get('/mlb-t3/pbp/c8457f5d-d8ed-4949-8c92-b341e5b37fa4.xml?api_key=api-key')
        .replyWithFile(200, __dirname + '/replies/event-pbp-200.txt')

    it 'should be a function', ->
      mlb.getEventPlayByPlay.should.be.a('function')

    it 'should should throw error without eventId', ->
      (->
        mlb.getEventPlayByPlay()
      ).should.throwError(/required/)

    it 'should pass error and no result with bad api key', (done) ->
      badMlb.getEventPlayByPlay 'c8457f5d-d8ed-4949-8c92-b341e5b37fa4', (err, result) ->
        err.should.match /HTTP 403/
        should.not.exist result
        done()

    it 'should pass error and no result with bad eventId', (done) ->
      mlb.getEventPlayByPlay 'bad-event-id', (err, result) ->
        err.should.match /HTTP 412/
        should.not.exist result
        done()

    it 'should pass no error and teams as result on 200', (done) ->
      mlb.getEventPlayByPlay 'c8457f5d-d8ed-4949-8c92-b341e5b37fa4', (err, result) ->
        should.not.exist err
        result.should.be.a 'object'
        result.play_by_play.should.be.a 'object'
        result.play_by_play.inning.should.be.an.instanceOf Array
        result.play_by_play.inning[0].should.be.a 'object'
        result.play_by_play.inning[0].inning_half.should.be.an.instanceOf Array
        result.play_by_play.inning[0].inning_half[0].id.should.match /top/
        done()

    after ->
      scope.done()
