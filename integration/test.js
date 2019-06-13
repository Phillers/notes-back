const expect = require('chai').expect;
const request = require('supertest');
const ServerlessInvoker = require('serverless-http-invoker')
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const chaiLike = require('chai-like');
const CognitoIdentityServiceProvider = require("amazon-cognito-identity-js");
// Required in order to use the cognito js library to work.
global.fetch = require("node-fetch");
/**
 * Authenticate a cognito user and return its authentication token. Use the auth token in the authorization header
 * @param callback Callback function with error as first param and the actual user token in the second param.
 */
userName = "admin@example.com";
password = "Passw0rd!";
userPoolId = "us-east-1_mZrqu9aG0";
clientId =  "5h5ftjf1ulodoqvr60hr7ga5th";
ok = false;
function authenticateUser(callback) {
  userName = "admin@example.com";
  password = "Passw0rd!";
  userPoolId = "us-east-1_mZrqu9aG0";
  clientId =  "5h5ftjf1ulodoqvr60hr7ga5th";
	console.info("Authenticating user");
	const authenticationData = {
		Username: userName,
		Password: password
	};

	const authenticationDetails = new CognitoIdentityServiceProvider.AuthenticationDetails(
		authenticationData
	);
	const poolData = {
		UserPoolId: userPoolId, // Your user pool id here
		ClientId: clientId // Your client id here
	};

	const userPool = new CognitoIdentityServiceProvider.CognitoUserPool(poolData);
	const userData = {
		Username: userName,
		Pool: userPool
	};

	const cognitoUser = new CognitoIdentityServiceProvider.CognitoUser(userData);
	cognitoUser.authenticateUser(authenticationDetails, {
		onSuccess: function(result) {
			const token = result.getIdToken().getJwtToken();
			console.info(`User token: ${token}`);
			callback(null, token);
		},
		onFailure: function(err) {
			callback(err);
		}
	});
}
event = {
  "body": "{\"content\":\"hello world\",\"attachment\":\"hello.jpg\"}",
  "requestContext": {
    "identity": {
      "cognitoIdentityId": "USER-SUB-1234"
    }
  },
}

describe('API — teamsByGame',() => {
  const server = request("http://localhost:3000" /*"https://txlr5digzh.execute-api.us-east-1.amazonaws.com/dev" */);
  
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
              content: 'hello world',
            });
            return done();
          });
      });
  });
});
