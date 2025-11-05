import OpenAI from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});

export const runtime = 'edge';

export async function POST(req: Request) {
	try {
		const prompt =
			"Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

		const response = await openai.chat.completions.create({
			model: 'gpt-4o-mini',
			stream: true,
			messages: [
				{ role: 'system', content: 'You are a helpful assistant that writes concise, engaging prompts.' },
				{ role: 'user', content: prompt },
			],
			max_tokens: 150,
		});

		const stream = new ReadableStream<Uint8Array>({
			start(controller) {
				(async () => {
					const encoder = new TextEncoder();
					for await (const part of response) {
						const delta = part.choices?.[0]?.delta?.content ?? '';
						if (delta) controller.enqueue(encoder.encode(delta));
					}
					controller.close();
				})().catch((err) => controller.error(err));
			},
		});

		return new Response(stream, {
			headers: {
				'Content-Type': 'text/plain; charset=utf-8',
				'Cache-Control': 'no-store',
			},
		});
	} catch (error) {
		if (error instanceof OpenAI.APIError) {
			const { name, status, headers, message } = error;
			return NextResponse.json({ name, status, headers, message }, { status });
		}

		console.error('An unexpected error occurred:', error);
		return NextResponse.json(
			{ name: 'UnexpectedError', message: 'An unexpected error occurred.' },
			{ status: 500 }
		);
	}
}

