import userFactory from '../factories/UserFactory';
import { User } from '../../services/types/UserType';

export async function seed(): Promise<User> {
	return userFactory();
}
