var assert = require('assert');
var request = require('supertest-as-promised');
var httpStatus = require('http-status');
var chai = require('chai');  
var expect = chai.expect;
var  app = require('../app');

chai.config.includeStack = true;

describe('## Misc', () => {
  describe('## Testing NodeIndexRoute', function() {
    it('## Testing function in NodeIndexRoute', (done) => {
      request(app)
        .get('/api')
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.text).to.equal("Welcome to iGraph");
          done();
        })
        .catch(done);
    });
  });
});

// More information: https://mochajs.org/

