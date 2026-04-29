'use client'

import { ReactNode } from 'react'

import { ClerkProvider } from '@clerk/nextjs'
import { dark } from '@clerk/themes'
import { useAuth } from '@clerk/nextjs'

import { AuthLoading, ConvexReactClient } from 'convex/react'
import {
    Authenticated,
    Unauthenticated
} from "convex/react"
import { ConvexProviderWithClerk } from 'convex/react-clerk'

import { ThemeProvider } from './theme-provider'
import { UnauthenticatedView } from '@/features/auth/components/unauthenticated-view';
import { AuthLoadingView } from '@/features/auth/components/auth-loading-view';

if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
    throw new Error('Missing NEXT_PUBLIC_CONVEX_URL in your .env file')
}

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL)

export default function Provider({
    children
}: {
    children: ReactNode
}) {
    return (
        <ClerkProvider
            appearance={{
                theme: dark
            }}
        >
            {/* 从clerk获取token，自动附加到请求中，发生送给convex验证 */}
            <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="dark"
                    enableSystem
                    disableTransitionOnChange
                >
                    <Authenticated>
                        {children}
                    </Authenticated>

                    <Unauthenticated>
                        <UnauthenticatedView />
                    </Unauthenticated>

                    <AuthLoading>
                        <AuthLoadingView />
                    </AuthLoading>
                    
                </ThemeProvider>
            </ConvexProviderWithClerk>
        </ClerkProvider>
    )
}

/**
 *  用Clerk给Convex加上登录系统 
 * 
 *  用户登录，Clerk生成Token
 * 
 *  Convex拿Token去进行验证
 * 
 *  验证成功允许访问对应的数据
 */