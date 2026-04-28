'use client'

import { Button } from "@/components/ui/button"
import { useState } from "react"

export default function DemoPage() {

    const [isLoading, setIsLoading] = useState(true)

    const handleClick = async () => {
        setIsLoading(false)
        await fetch('/api/google', {
            method: 'POST',
        })
        setIsLoading(true)
    }

    return (
        <div className=" flex justify-center items-center">
            <Button onClick={handleClick}>
                {isLoading ? 'click me' : 'loading...'}
            </Button>
        </div>
    )
}