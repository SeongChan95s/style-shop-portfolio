import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
	try {
		const result = req.cookies.get('authjs.callback-url')?.value;

		return NextResponse.json(
			{ success: true, message: 'callbackUrl을 가져왔습니다.', data: result },
			{ status: 200 }
		);
	} catch (err) {
		return NextResponse.json(
			{ success: false, message: `콜백 URL을 가져오는데 실패했습니다: ${err}` },
			{ status: 500 }
		);
	}
}
