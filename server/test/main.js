var assert = require('assert');
var request = require('supertest-as-promised');
var httpStatus = require('http-status');
var chai = require('chai');  
var expect = chai.expect;
var  app = require('../app');

chai.config.includeStack = true;


describe('## Misc', () => {
  describe('## Simple testing', function() {
    it('## To test mocha testing utility', (done) => {
          expect(0).to.equal(0);
          done();
    });
  });
});

  describe('## Testing NodeIndexRoute', function() {
    it('## Testing GET endpoint', (done) => {
      request(app)
        .get('/api/test')
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.text).to.equal("Welcome to iGraph");
          done();
        })
        .catch(done);
    });
  });

// More information: https://mochajs.org/

