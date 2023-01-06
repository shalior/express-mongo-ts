import { BaseModel } from './BaseModel';

export interface User extends BaseModel {
	email: string,
	passwordHash: string,
	enabled: boolean,
	minJwtIat: Date,
}

export interface UserRaw extends BaseModel{
	email: string,
	passwordHash: string,
	enabled: boolean,
	minJwtIat: Date,
}

export interface SaveUser extends Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'passwordHash'>{
	password: string,
}
