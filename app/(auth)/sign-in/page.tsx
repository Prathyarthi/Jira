import { getCurrent } from '@/features/auth/actions'
import SigninComponent from '@/features/auth/components/SigninComponent'
import { redirect } from 'next/navigation'
import React from 'react'

async function Signin() {

    const user = await getCurrent()

    if (user) {
        redirect("/")
    }
    return <SigninComponent />
}

export default Signin