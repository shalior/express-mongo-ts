import { asyncWrapper } from '@cdellacqua/express-async-wrapper';
import { Router } from 'express';
import { HttpStatus } from '../../http/status';
import UserService from '../../services/UserService';

const r: Router = Router();
export default r;

r.post('/user', asyncWrapper(async (req, res) => {
	const authResponse = UserService.generateAuthResponse(res.locals.user);
	res.status(HttpStatus.Created).json(authResponse);
}));
