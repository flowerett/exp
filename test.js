var request = require('supertest');
var app = require('./app');

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
});
