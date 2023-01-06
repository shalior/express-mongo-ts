import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { toString } from 'express-validator/src/utils';
import knexInstance from '../db';
import config from '../config';
import { SaveUser, User } from './types/UserType';
import { UserResource } from '../http/Resources/UserResource';
// eslint-disable-next-line import/first

export interface LoginParams {
	email: string,
	password: string,
}

export interface AuthResponse {
	jwt: string,
	user: UserResource,
}

export const tableName = 'users';

export const cols = {
	id: 'id',
	email: 'email',
	passwordHash: 'passwordHash',
	enabled: 'enabled',
	minJwtIat: 'minJwtIat',
	createdAt: 'createdAt',
	updatedAt: 'updatedAt',
};

async function find(filters: Partial<User> | number): Promise<User | undefined> {
	return knexInstance<User>(tableName)
		.where(typeof filters === 'object' ? filters : { id: filters })
		.select('*')
		.first();
}

async function findAll(filters?: Partial<User>): Promise<User[]> {
	const users = await knexInstance<User>(tableName)
		.orderBy('createdAt', 'desc')
		.modify((queryBuilder) => {
			if (filters) {
				queryBuilder.where(filters);
			}
		})
		.select('*');

	return Promise.all(users.map(UserResource.from));
}

async function create(saveUser: SaveUser): Promise<User> {
	return knexInstance<User>(tableName)
		.insert({
			email: saveUser?.email?.toLowerCase(),
			passwordHash: await bcrypt.hash(saveUser.password, 10),
			enabled: saveUser.enabled,
			minJwtIat: saveUser.minJwtIat,
		}, '*')
		.returning('*')
		.then((rows) => rows[0]);
}

async function update(id: string, user: Partial<SaveUser>) {
	const result = await knexInstance<User>(tableName)
		.where('id', id)
		.update({
			email: user.email?.toLowerCase(),
			passwordHash: user.password && await bcrypt.hash(user.password, 10),
			enabled: user.enabled,
			minJwtIat: user.minJwtIat,
			updatedAt: new Date(),
		}, ['*']);

	return result[0];
}

async function del(id: number): Promise<void> {
	await knexInstance<User>(tableName)
		.where('id', id)
		.delete();
}

async function login({ email, password }: LoginParams): Promise<AuthResponse | null> {
	const user = await find({
		email,
		enabled: true,
	});
	if (!user) {
		return null;
	}
	const passwordMatches = await bcrypt.compare(password, user.passwordHash);
	if (!passwordMatches) {
		return null;
	}
	return generateAuthResponse(user);
}

function checkPassword(id: number, password: string): Promise<boolean> {
	return find(id)
		.then((user) => bcrypt.compare(password, user?.passwordHash ?? ''));
}

function createJwt(user: User): string {
	return jwt.sign({}, config.secret, {
		expiresIn: config.authentication.tokenExpirationSeconds,
		subject: toString(user.id),
	});
}

function generateAuthResponse(user: User): AuthResponse {
	return {
		jwt: createJwt(user),
		user: UserResource.from(user) as UserResource,
	};
}

export default {
	find,
	findAll,
	create,
	update,
	del,
	login,
	checkPassword,
	createJwt,
	generateAuthResponse,
};
