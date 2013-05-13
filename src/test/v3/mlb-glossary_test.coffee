'use strict'
should = require 'should'
nock = require 'nock'

MLB = require '../../lib/v3/mlb.js'

describe 'V3 MLB', ->
  mlb = new MLB 'api-key', 't'
  badMlb = new MLB 'bad-key', 't'

  describe '#getGlossary()', ->
    scope = undefined
    before ->
      scope = nock('http://api.sportsdatallc.org')
        .get('/mlb-t3/glossary/glossary.xml?api_key=bad-key')
        .replyWithFile(403, __dirname + '/replies/api-key-error.txt')
        .get('/mlb-t3/glossary/glossary.xml?api_key=api-key')
        .replyWithFile(200, __dirname + '/replies/glossary-200.txt')

    it 'should be a function', ->
      mlb.getGlossary.should.be.a('function')

    it 'should pass error and no result with bad api key', (done) ->
      badMlb.getGlossary (err, result) ->
        err.should.match /HTTP 403/
        should.not.exist result
        done()

    it 'should pass no error and glossary as result on 200', (done) ->
      mlb.getGlossary (err, result) ->
        should.not.exist err
        result.should.be.a 'object'
        result.glossary.should.be.a 'object'
        result.glossary.pitch_types.should.be.a 'object'
        result.glossary.player_statuses.should.be.a 'object'
        result.glossary.pitch_outcome.should.be.a 'object'
        result.glossary.game_status.should.be.a 'object'
        result.glossary.runner_outcomes.should.be.a 'object'
        result.glossary.post_season.should.be.a 'object'
        done()

    after ->
      scope.done()
