import type { RequestHandler } from "@sveltejs/kit";

export const POST = ( async ({ locals, cookies }) => {
    locals.user = null;
    cookies.delete('auth', { path: '/'});

    console.log('logged out on server')

    return new Response('', { status: 200, statusText: 'Logged out successfully' });
}) satisfies RequestHandler;