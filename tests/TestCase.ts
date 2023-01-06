import chai, { expect } from 'chai';
import UserService from '../src/services/UserService';
import config from '../src/config';
import {User} from "../src/services/types/UserType";

const serverUrl = config.http.baseUrl;

export function actingAs(user: User, request: { type: 'post' | 'get' | 'put' | 'delete'; route: string }) {
	const jwt: string = UserService.createJwt(user);

	switch (request.type) {
		case 'post':
			return chai.request(serverUrl)
				.post(request.route)
				.set('Authorization', `Bearer ${jwt}`);
		case 'delete':
			return chai.request(serverUrl)
				.delete(request.route)
				.set('Authorization', `Bearer ${jwt}`);
		case 'get':
			return chai.request(serverUrl)
				.get(request.route)
				.set('Authorization', `Bearer ${jwt}`);
		case 'put':
			return chai.request(serverUrl)
				.put(request.route)
				.set('Authorization', `Bearer ${jwt}`);
	}
}

export class Request {
	public static get(route: string) {
		return chai.request(serverUrl).get(route);
	}

	public static post(route: string) {
		return chai.request(serverUrl).post(route);
	}

	public static delete(route: string) {
		return chai.request(serverUrl).delete(route);
	}

	public static patch(route: string) {
		return chai.request(serverUrl).patch(route);
	}

	public static put(route: string) {
		return chai.request(serverUrl).put(route);
	}
}
