import type { ObjectId } from 'mongodb';

export interface BaseModel {
	_id?: ObjectId,
	updatedAt: Date,
	createdAt: Date,
}
