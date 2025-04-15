'use client'

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card"
import { AddAccount } from "@/components/ui/profile/AddAccount"

export default function SignInPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Choose Authentication Method</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <AddAccount providerId="github" mode="signin" />
                    <AddAccount providerId="siwe-csrf" mode="signin" />
                    <AddAccount providerId="solana" mode="signin" />
                </CardContent>
            </Card>
        </div>
    )
}