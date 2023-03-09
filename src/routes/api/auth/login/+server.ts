import { redirect, type RequestHandler } from "@sveltejs/kit";

export const POST = (({ request, cookies }) => {
    console.log('logging in server side')
    const authHeader = request.headers.get('Authorization');

    if (!authHeader) throw console.error(401, 'unable to authenticate');

    const [scheme, token] = authHeader.split(' ');

    if (scheme != 'Bearer' || !token) throw console.error(401, 'unable to authenticate');

    console.log('creating auth cookie', token);

    cookies.set("auth", token, {
        path: '/',
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 // 1 hour
    });

    throw redirect(303, '/protected');
}) satisfies RequestHandler