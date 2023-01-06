import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { HttpStatus } from '../../src/http/status';
import { signUrl } from '../../src/crypto/url';
import config from '../../src/config';

const serverUrl = config.http.baseUrl;

chai.use(chaiHttp);

suite('Signed urls');
let signedUrl: string;

test('constructs a signed url', async () => {
	signedUrl = await signUrl('/hello-signed');
	expect(signedUrl.startsWith(serverUrl))
		.equals(true);
});

test('gets signed url', (done) => {
	chai.request(serverUrl)
		.get(signedUrl.substring(serverUrl.length))
		.end((err, res) => {
			if (err) done(err);
			expect(res.status)
				.to
				.equal(HttpStatus.OK);
			expect(res.text)
				.to
				.include('This url is signed!');
			done();
		});
});

test('fails to get tampered signed url', (done) => {
	chai.request(serverUrl)
		.get(`${signedUrl.substring(serverUrl.length)}&forbidden=selector`)
		.end((err, res) => {
			if (err) done(err);
			expect(res.status)
				.to
				.equal(HttpStatus.Forbidden);
			done();
		});
});
