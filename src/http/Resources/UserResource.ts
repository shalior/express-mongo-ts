export class UserResource {
	public static from(user: any | null): UserResource | null {
		if (user === null) {
			return null;
		}

		return {
			id: user.id,
			email: user.email,
			enabled: user.enabled,
			createdAt: user.createdAt,
			updatedAt: user.updatedAt,
			minJwtIat: user.minJwtIat,
		};
	}
}
