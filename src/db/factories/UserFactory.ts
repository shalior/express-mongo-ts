// create a user
import { faker } from '@faker-js/faker';
import { SaveUser } from '../../services/types/UserType';
import UserService from '../../services/UserService';

export default async function userFactory(user ?: Partial<SaveUser>) {
	return UserService.create({
		email: user?.email ?? faker.internet.email(),
		enabled: user?.enabled ?? true,
		password: 'password',
		minJwtIat: user?.minJwtIat ?? (new Date((new Date().setFullYear(2020)))),
	});
}
