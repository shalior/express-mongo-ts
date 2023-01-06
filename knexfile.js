const config = {
	client: 'postgresql',
	connection: {
		host: process.env.DB_HOST,
		port: process.env.DB_PORT,
		database: process.env.DB_NAME,
		user: process.env.DB_USER,
		password: process.env.DB_PASS,
	},
	debug: ['development'].includes(process.env.NODE_ENV),
	pool: {
		min: 2,
		max: 10,
	},
	migrations: {
		tableName: '_migrations',
		loadExtensions: ['.js'],
		directory: './build/db/migrations',
	},
	seeds: {
		directory: './build/db/seeds',
		loadExtensions: ['.js'],
	},
};

if (process.env.NODE_ENV === 'test') {
	config.connection.database = 'testing';
}

module.exports = {
	development: config,
	test: config,
	staging: config,
	production: config,
};
