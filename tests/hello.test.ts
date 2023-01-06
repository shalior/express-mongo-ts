import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';

import { Done } from 'mocha';
import config from '../src/config';
import { Request } from './TestCase';

const serverUrl = config.http.baseUrl;
chai.use(chaiHttp);
// Routes test
suite('Routes test');

test('hello api', (done: Done) => {
	  Request.get('/hello-api')
		.end((err, res) => {
			if (err) done(err);
			expect(res.text).to.equals('hello, World!');
			done();
		});
});

test('hello api async', async ()=>{
	const response = await Request.get('/hello-api');

	expect(response.text).to.eq('hello, World!');
});
