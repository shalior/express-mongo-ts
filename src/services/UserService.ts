/* eslint-disable no-underscore-dangle */
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { ObjectId, WithId } from 'mongodb';
import db from '../db';
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

async function find(filters: Partial<User>|ObjectId): Promise<WithId<User>| null> {
	return db.collection<User>('users').findOne(
		filters,
	);
}

async function create(saveUser: SaveUser): Promise<WithId<User>| null> {
	const result = await db.collection<User>('users').insertOne({
		...saveUser,
		// _id: id, // random id,
		passwordHash: await bcrypt.hash(saveUser.password, 10),
		createdAt: new Date(),
		updatedAt: new Date(),
	}).then((result) => result);

	return find(result.insertedId);
}

async function del(id: ObjectId): Promise<boolean> {
	const result = await db.collection<User>('users').deleteOne({
		_id: id,
	});

	return result.deletedCount === 1;
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

function checkPassword(id: ObjectId, password: string): Promise<boolean> {
	return find(id)
		.then((user) => bcrypt.compare(password, user?.passwordHash ?? ''));
}

function createJwt(user: User): string {
	return jwt.sign({}, config.secret, {
		expiresIn: config.authentication.tokenExpirationSeconds,
		subject: user._id?.toString() ?? '',
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
	create,
	del,
	login,
	checkPassword,
	createJwt,
	generateAuthResponse,
};
