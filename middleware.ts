import { clerkMiddleware } from '@clerk/nextjs/server';

export default clerkMiddleware();

export const config = {
  matcher: [
    // Protect everything except Next.js internals and static files
    '/((?!_next|_static|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|webp|css|js|json|txt|woff2?|ttf|eot|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
  ],
};