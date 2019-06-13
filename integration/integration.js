const expect = require('chai').expect;
const request = require('supertest');

/**
 * Authenticate a cognito user and return its authentication token. Use the auth token in the authorization header
 * @param callback Callback function with error as first param and the actual user token in the second param.
 */


describe('API — notes',() => {
  const server = request("http://localhost:3000");
  it('POST /notes', (done) => {
    server.post('/notes')
      .send("{\"content\":\"hello world\",\"attachment\":\"hello.jpg\"}")
      .expect(200)
      .end((error, result) => {
        if (error) return done(error);
        console.log(result.body.noteId);
        server.get('/notes/'+result.body.noteId)
          .expect(200).end((error, result) => {
            if (error) return done(error);
            console.log(result.body);
            expect(result.body).to.include({
              attachment: 'hello.jpg',
              content: 'hello xd world',
            });
            return done();
          });
      });
  });
});
