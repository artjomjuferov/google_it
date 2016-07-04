expect = require('chai').expect
sinon = require("sinon")
sinonChai = require("sinon-chai")


chai.use(sinonChai);

describe 'Bg', ->

  describe '#new()', ->
    it 'should return object', ->
      
