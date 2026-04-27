import { clerkMiddleware } from '@clerk/nextjs/server';

export default clerkMiddleware();

export const config = {
  matcher: [
    // 跳过 Next.js 内部和所有静态文件，除非在搜索参数中找到
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // 始终针对 API 路由运行
    '/(api|trpc)(.*)',
  ],
};