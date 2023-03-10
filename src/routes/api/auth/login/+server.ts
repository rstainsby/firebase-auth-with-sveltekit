import { error, redirect, type RequestHandler } from "@sveltejs/kit";

export const POST = (({ request, cookies }) => {
    const authHeader = request.headers.get('Authorization');

    if (!authHeader) throw error(401, 'unable to authenticate');

    const [scheme, token] = authHeader.split(' ');

    if (scheme != 'Bearer' || !token) throw error(401, 'unable to authenticate');

    cookies.set("auth", token, {
        path: '/',
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 // 1 hour
    });

    throw redirect(303, '/protected');
}) satisfies RequestHandler