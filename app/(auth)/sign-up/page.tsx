import { getCurrent } from '@/features/auth/queries'
import SignupComponent from '@/features/auth/components/SignupComponent'
import { redirect } from 'next/navigation'
import React from 'react'

async function Signup() {

    const user = await getCurrent()

    if (user) {
        redirect('/')
    }

    return <SignupComponent />
}

export default Signup