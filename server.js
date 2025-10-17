/* eslint-disable @typescript-eslint/no-require-imports */
const { createServer } = require('https');
const { parse } = require('url');
const next = require('next');
const fs = require('fs');
const path = require('path');

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = process.env.PORT || 3000;

// 로컬 HTTPS 개발 환경에서 자체 서명된 인증서 허용
// HTTPS_LOCAL_DEV 환경 변수가 설정된 경우 SSL 검증 우회
if (process.env.HTTPS_LOCAL_DEV === 'true') {
	process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
	console.log('⚠️  로컬 개발 모드: SSL 인증서 검증 비활성화');
}

// Next.js 앱 초기화
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

// SSL 인증서 로드
const httpsOptions = {
	key: fs.readFileSync(path.join(__dirname, 'certificates', 'localhost-key.pem')),
	cert: fs.readFileSync(path.join(__dirname, 'certificates', 'localhost.pem'))
};

app.prepare().then(() => {
	createServer(httpsOptions, async (req, res) => {
		try {
			const parsedUrl = parse(req.url, true);
			await handle(req, res, parsedUrl);
		} catch (err) {
			console.error('Error occurred handling', req.url, err);
			res.statusCode = 500;
			res.end('internal server error');
		}
	})
		.once('error', (err) => {
			console.error(err);
			process.exit(1);
		})
		.listen(port, () => {
			console.log(`> Ready on https://${hostname}:${port}`);
		});
});
