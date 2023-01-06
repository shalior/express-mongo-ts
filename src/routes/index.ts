import { join } from 'path';
import { Router, static as expressStatic } from 'express';
import appRoutes from './app';
import authenticationRoutes from './auth/auth';
import { verifyUrlMiddleware } from '../crypto/url';
import config from '../config';

const r: Router = Router();
export default r;

// TODO: remove these three examples
r.get('/hello-api', (_, res) => res.send('hello, World!'));
r.get('/hello-ssr', (_, res) => res.render('hello-world'));
r.get('/hello-signed', verifyUrlMiddleware(), (_, res) => res.send('hello. This url is signed!'));

r.get('/health', (req, res) => { res.json({ status: 'OK' }).status(200); });

r.use('/app', appRoutes);

// TODO: if you want to change the prefix for the app routes, change the first argument in the following function call
r.use('/auth', authenticationRoutes);

// TODO: for development purposes express will serve static files from the public directory, in a production environment
// this task should be performed by a reverse proxy to improve performance
if (config.environment === 'development') {
	r.use('/', expressStatic(join(__dirname, '..', '..', 'public')));
}
