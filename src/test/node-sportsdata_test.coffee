'use strict'

node_sportsdata = require('../lib/node-sportsdata.js')

###
======== A Handy Little Mocha Reference ========
https://github.com/visionmedia/should.js
https://github.com/visionmedia/mocha

Mocha hooks:
  before ()-> # before describe
  after ()-> # after describe
  beforeEach ()-> # before each it
  afterEach ()-> # after each it

Should assertions:
  should.exist('hello')
  should.fail('expected an error!')
  true.should.be.ok
  true.should.be.true
  false.should.be.false

  (()-> arguments)(1,2,3).should.be.arguments
  [1,2,3].should.eql([1,2,3])
  should.strictEqual(undefined, value)
  user.age.should.be.within(5, 50)
  username.should.match(/^\w+$/)

  user.should.be.a('object')
  [].should.be.an.instanceOf(Array)

  user.should.have.property('age', 15)

  user.age.should.be.above(5)
  user.age.should.be.below(100)
  user.pets.should.have.length(5)

  res.should.have.status(200) #res.statusCode should be 200
  res.should.be.json
  res.should.be.html
  res.should.have.header('Content-Length', '123')

  [].should.be.empty
  [1,2,3].should.include(3)
  'foo bar baz'.should.include('foo')
  { name: 'TJ', pet: tobi }.user.should.include({ pet: tobi, name: 'TJ' })
  { foo: 'bar', baz: 'raz' }.should.have.keys('foo', 'bar')

  (()-> throw new Error('failed to baz')).should.throwError(/^fail.+/)

  user.should.have.property('pets').with.lengthOf(4)
  user.should.be.a('object').and.have.property('name', 'tj')
###

describe 'Awesome', ()->
  describe '#of()', ()->

    it 'awesome', ()->
      node_sportsdata.awesome().should.eql('awesome')

describe 'Node SportsData API', ->
  describe 'v3', ->

    it 'should be an object', ->
      node_sportsdata.v3.should.be.a('object')

    it 'should have a MLB function', ->
      node_sportsdata.v3.mlb.should.be.a('function')

    describe '#mlb()', ->

      it 'should return an MLB object', ->
        node_sportsdata.v3.mlb('api-key', 't').should.be.a('object')

      it 'should throw an error without api key', ->
        (->
          node_sportsdata.v3.mlb()
        ).should.throwError(/You must provide an API Key/)

      it 'should throw an error without access level', ->
        (->
          node_sportsdata.v3.mlb('api-key')
        ).should.throwError(/You must provide an Access Level/)

  describe 'v2', ->

    it 'should be an object', ->
      node_sportsdata.v2.should.be.a('object')

    it 'should have an NBA function', ->
      node_sportsdata.v2.nba.should.be.a('function')

    describe '#nba()', ->

      it 'should return an NBA object', ->
        node_sportsdata.v2.nba('api-key').should.be.a('object')

      it 'should throw an error without api key', ->
        (->
          node_sportsdata.v2.nba()
        ).should.throwError(/You must provide an API Key/)

    it 'should have an NCAAMB function', ->
      node_sportsdata.v2.ncaamb.should.be.a('function')

    describe '#ncaamb', ->

      it 'should return an NCAAMB object', ->
        node_sportsdata.v2.ncaamb('api-key').should.be.a('object')

      it 'should return an error without api key', ->
        (->
          node_sportsdata.v2.ncaamb()
        ).should.throwError(/You must provide an API Key/)

  describe 'v1', ->

    it 'should be an object', ->
      node_sportsdata.v1.should.be.a('object')

    it 'should have an NCAAF function', ->
      node_sportsdata.v1.ncaaf.should.be.a('function')

    describe '#ncaaf()', ->

      it 'should return an NCAAF object', ->
        node_sportsdata.v1.ncaaf('api-key').should.be.a('object')

      it 'should throw an error without api key', ->
        (->
          node_sportsdata.v1.ncaaf()
        ).should.throwError(/You must provide an API Key/)

    it 'should have an NFL function', ->
      node_sportsdata.v1.nfl.should.be.a('function')

    describe '#nfl', ->

      it 'should return an NFL object', ->
        node_sportsdata.v1.nfl('api-key', 't').should.be.a('object')

      it 'should return an error without api key', ->
        (->
          node_sportsdata.v1.nfl()
        ).should.throwError(/You must provide an API Key/)

      it 'should throw an error without access level', ->
        (->
          node_sportsdata.v3.mlb('api-key')
        ).should.throwError(/You must provide an Access Level/)

