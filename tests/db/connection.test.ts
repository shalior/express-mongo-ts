import {expect} from 'chai';
import db from "../../src/db";
import userFactory from '../../src/db/factories/UserFactory';

suite('Database connection test');

test('can connect to database', async () => {
	await userFactory({
		email: 'example@example.org'
	});

	const result = await db.collection('users').findOne({email: 'example@example.org'});
	expect(result).to.be.an('object');
});
