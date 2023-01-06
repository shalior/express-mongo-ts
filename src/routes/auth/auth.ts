import { body } from 'express-validator';
import { asyncWrapper } from '@cdellacqua/express-async-wrapper';
import { Router } from 'express';
import { validationMiddleware } from '../../http/validation';
import UserService from '../../services/UserService';
import { HttpStatus } from '../../http/status';
import authMiddleware from '../../http/UserAthenticationMiddleware';

const r: Router = Router();
export default r;

r.post('/jwt', [
	body('email').isEmail(),
	body('password').isString().isLength({ min: 1 }),
	validationMiddleware(),
], asyncWrapper(async (req, res) => {
	const loginResult = await UserService.login({
		email: req.body.email,
		password: req.body.password,
	});
	if (!loginResult) {
		res.status(HttpStatus.Unauthorized).end();
	} else {
		res.status(HttpStatus.Created).json(loginResult);
	}
}));

// Renew JWT
r.post('/jwt/new', authMiddleware, asyncWrapper(async (req, res) => {
	const authResponse = UserService.generateAuthResponse(res.locals.user);
	res.status(HttpStatus.Created).json(authResponse);
}));

r.delete('/', authMiddleware, asyncWrapper(async (req, res) => {
	await UserService.del(res.locals.user.id);
	res.status(HttpStatus.NoContent).end();
}));

r.put('/minJwtIat', authMiddleware, [
	body('date').isISO8601(),
], asyncWrapper(async (req, res) => {
	const { minJwtIat } = await UserService.update(res.locals.user.id, {
		minJwtIat: new Date(req.body.date),
	});
	res.json({
		minJwtIat,
	});
}));
