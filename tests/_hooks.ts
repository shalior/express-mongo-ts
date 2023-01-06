import { start, stop } from '../src/lifecycle';
import db from "../src/db";

type DoneFunction = () => {};

export const mochaHooks = {
	beforeAll(done: DoneFunction) {
		start({ queues: false, server: true })
			.then(() => done())
			.catch(err => console.log(err));
	},

	afterAll(done: DoneFunction) {
		stop()
			.then(() => done())
			.catch(err => console.log(err));

	},
};
