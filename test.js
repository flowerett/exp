var request = require('supertest');
var app = require('./app');

var redis = require('redis');
var client = redis.createClient();

client.select((process.env.NODE_ENV || 'test').length);

client.flushdb();
client.hset('cities', 'Caspiana', 'desc 1');
client.hset('cities', 'Indigo', 'desc 1');

describe('Requests to the root path', function() {

  it('Returns a 200 status', function(done) {
    request(app)
      .get('/')
      .expect(200)
      .end(function(error) {
        if(error) throw error;
        done();
      });
  });

  it('Returns a HTML', function(done) {
    request(app)
      .get('/')
      .expect('Content-Type', /html/, done);
  });

  it('Returns an index file with cities', function(done) {
    request(app)
      .get('/')
      .expect(/cities/i, done);
  });
});

describe('Listing cities on /cities', function() {
  it('Returns 200 status code', function(done) {
    request(app)
      .get('/cities')
      .expect(200, done);
  });

  it('Returns JSON format', function(done) {
    request(app)
      .get('/cities')
      .expect('Content-Type', /json/, done);
  });

  it('Returns initial cities', function(done) {
    request(app)
      .get('/cities')
      .expect(JSON.stringify([
        'Caspiana', 'Indigo'
      ]), done);
  });
});

describe('Creating new cities', function() {
  it('Returns a 201', function(done) {
    request(app)
      .post('/cities')
      .send('name=Hukuevo,&description=where+the+dead+mozay+lives')
      .expect(201, done);
  });

  it('Return the city name', function(done) {
    request(app)
      .post('/cities')
      .send('name=Hukuevo,&description=where+the+dead+mozay+lives')
      .expect(/hukuevo/i, done);
  })

  it('Validates city name & description', function(done) {
    request(app)
      .post('/cities')
      .send('name=,&description=')
      .expect(400, done);
  });
});

describe('Deleting cities', function() {

  before(function() {
    client.hset('cities', 'Banana', 'desc 1');
  });

  after(function() {
    client.flushdb();
  });

  it('Returns 204', function(done) {
    request(app)
      .delete('/cities/Banana')
      .expect(204, done);
  });
});

describe('Shows city info', function() {
  before(function() {
    client.hset('cities', 'Soldo', 'soldos city');
  });

  after(function() {
    client.flushdb();
  });

  it('Returns 200', function(done) {
    request(app)
      .get('/cities/Soldo')
      .expect(200, done);
  });

  it('Returns HTML format', function(done) {
    request(app)
      .get('/cities/Soldo')
      .expect('Content-Type', /html/, done);
  });

  it('Returns information for the given city', function(done) {
    request(app)
      .get('/cities/Soldo')
      .expect(/soldos/, done);
  });
});
