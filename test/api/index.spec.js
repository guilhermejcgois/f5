const expect = require('chai').expect;
const request = require('supertest');
const app = require('../../app');

const BASE_URL = '/app';

describe('index routes', function () {
    describe('GET /', function () {
        it('redirect to /login', function (done) {
            request(app)
                .get(`${BASE_URL}`)
                .expect('Content-Type', /plain/)
                .expect(302)
                .end(function (err, res) {
                    if (err) { return done(err); }
                    expect(res.text).to.equal('Found. Redirecting to app/login');
                    done();
                });
        });
    });

    describe('GET /login', function () {
        it('responds with HTML', function (done) {
            request(app)
                .get(`${BASE_URL}/login`)
                .expect('Content-Type', /html/)
                .expect(200)
                .end(done);
        });
    });

    describe('GET /cadastro', function () {
        it('responds with HTML', function (done) {
            request(app)
                .get(`${BASE_URL}/cadastro`)
                .expect('Content-Type', /html/)
                .expect(200)
                .end(done);
        });
    });

    describe('GET /esqueci-minha-senha', function () {
        it('responds with HTML', function (done) {
            request(app)
                .get(`${BASE_URL}/esqueci-minha-senha`)
                .expect('Content-Type', /html/)
                .expect(200)
                .end(done);
        });
    });
});