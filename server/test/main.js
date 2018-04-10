var assert = require('assert');
var request = require('supertest-as-promised');
var httpStatus = require('http-status');
var chai = require('chai');  
var expect = chai.expect;
var  app = require('../app');
const db = require('./db');
const fs = require('fs');

chai.config.includeStack = true;

describe('## Testing NodeIndexRoute', function() {
  it('## Testing GET endpoint', (done) => {
    request(app)
      .get('/api/')
      .expect(httpStatus.OK)
      .then((res) => {
        expect(res.text).to.equal("Welcome to iGraph");
        done();
    });
  });

  /*it('## Testing nlptodata functionality', (done) => {
    request(app)
      .get('/api/nlptodata?userquery=plot bar chart of maximum pay rate per department&dataset=core_data')
      .expect(httpStatus.OK)
      .expect('Content-Type', /json/)
      .then((res) => {
        expect(res.body.userQuery).to.equal('plot bar chart of maximum pay rate per department');
        done();
    });
  });*/
});

describe('# Test get database tables functionality', function() {
  it('## Testing getTables', (done) => {
    //Send get request.
    //Expect status 200 OK and result should contain tables array.
    request(app)
      .get('/api/getTables')
      .expect(httpStatus.OK)
      .expect('Content-Type', /json/)
      .then((res) => {
        assert(res.body.tables != undefined);
        done();
    });
  });
});


describe('## Test file upload functionality', function(){
  this.timeout(15000);
  var filePath = 'server/test/files/testfile.csv';
  var resPath = 'server/data/testfile.csv'
  var tableName = 'testfile';

  //Clear everything before file upload.
  before(function() {  
    //Remove file if it exists in server
     fs.stat(resPath, function(err, stats){
      if(err){
        return console.log(err);        
      };

      fs.unlink(resPath, function(err){
        if(err) return console.log(err);
        console.log('file deleted successfully')
      });

    });

    //Remove table if it exists in db
    db.deleteTable(tableName);
    console.log("Table removed form database");  
  });

  //Upload file. Status must be 200 OK and result should contain table name.
  it('## Testing file upload', (done) => {
    request(app)
    .post('/api/upload')
    .attach('fileItem', filePath)
    .expect(httpStatus.OK)
    .then((res) => {
      assert(res.body.fileName == tableName);
      done();
    });
  });

  //Send get request.
  //Expect status 200 OK and result should contain testfile table
  it('## Testing getTables', (done) => {    
    request(app)
      .get('/api/getTables')
      .expect(httpStatus.OK)
      .expect('Content-Type', /json/)
      .then((res) => {
        assert(res.body.tables.includes(tableName));
        done();
    });
  });

  //Try to upload testfile again.
  //Expect error - file already exists.
  it('## Testing file upload second time', (done) => {    
    request(app)
    .post('/api/upload')
    .attach('fileItem', filePath)
    .expect(500)
    .then((res) => {
      assert(res.body.Error != undefined);
      done();
    });
  });

  //Send get request to retrieve column names from testfile table.
  //Expect status 200 OK and result should contain columns array.
  it('## Testing columns', (done) => {    
    request(app)
      .get('/api/columns?dataset=testfile')
      .expect(httpStatus.OK)
      .expect('Content-Type', /json/)
      .then((res) => {
        //Check that all columns are included in result
        assert(res.body.length === 6);
        assert(res.body.includes('countryname'));
        assert(res.body.includes('countrycode'));
        assert(res.body.includes('indicatorname'));
        assert(res.body.includes('indicatorcode'));
        assert(res.body.includes('year'));
        assert(res.body.includes('value'));
        done();
    });
  });  
});

// More information: https://mochajs.org/

