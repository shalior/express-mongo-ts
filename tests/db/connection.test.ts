import chai, {expect} from 'chai';
import knexInstance from "../../src/db";

suite('Database connection test');
let signedUrl: string;

test('can connect to database', async () => {
	// test knex can connect to database
	knexInstance.raw('select 1+1 as result').then(() => {
		expect(true).to.be.true;
	}).catch(() => {
		expect.fail('failed to connect to database');
	});

});
