import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URL!;
const options = {
	connectTimeoutMS: 10000,
	serverSelectionTimeoutMS: 10000
};

declare global {
	var _mongo: Promise<MongoClient> | undefined;
}

const connectWithRetry = async (retries = 2, delay = 1000): Promise<MongoClient> => {
	const client = new MongoClient(uri, options);

	for (let i = 0; i <= retries; i++) {
		try {
			await client.connect();
			await client.db().command({ ping: 1 });
			return client;
		} catch (err) {
			console.error(`❌ MongoDB 연결 실패 (시도 ${i + 1}):`, err);
			if (i === retries) throw err;
			await new Promise(res => setTimeout(res, delay));
		}
	}

	throw new Error('MongoDB 연결 시도 모두 실패');
};

let connectDB: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
	if (!global._mongo) {
		global._mongo = connectWithRetry();
	}
	connectDB = global._mongo;
} else {
	connectDB = connectWithRetry();
}

export { connectDB };
