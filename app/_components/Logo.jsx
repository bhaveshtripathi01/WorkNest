import Image from 'next/image'
import React from 'react'

function Logo() {
    return (
        <div className='flex items-center gap-2'>
            <Image src={'/logo.png'} alt='logo' width={30} height={30} />
            <a className='font-bold text-xl' href='/'>Looper Alias</a>
        </div>
    )
}

export default Logo