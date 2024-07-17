'use client'
import React, { useState } from 'react';
import { signOut, useSession } from 'next-auth/react'
import {User} from "next-auth"
import { useToast } from "@/components/ui/use-toast";
import { Button } from './ui/button';
import Link from 'next/link';
import { ModeToggle } from './Toggle';
import { useRouter } from 'next/navigation';

const Navbar = () => {

    const {data: session} = useSession()
    const user = session?.user
    const onLogout = async () => {
      await signOut({
        redirect: true,
        callbackUrl: "/"
      })
    }
  return (
    <nav className="p-4 md:p-5 shadow-md bg-gray-900 text-white">
    <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
      <a href="#" className="text-xl font-bold mb-4 md:mb-0">
        Anonymous Wave
      </a>
      {session ? (
        <>
          <span className="mr-4">
            Welcome, {user?.username || user?.email}
          </span>
          <div className=' flex gap-2'>
          <Button className="w-full md:w-auto bg-slate-100 text-black" variant='outline'>
            <Link href={"/dashboard"}>Dashboard</Link>
          </Button>
          <Button onClick={onLogout} className="w-full md:w-auto bg-slate-100 text-black" variant='outline'>
            Logout
          </Button>
          </div>
        </>
      ) : (
        <>
        <div>
        <Link href="/signin">
          <Button className="w-full md:w-auto bg-slate-100 text-black mr-2" variant={'ghost'}>Login</Button>
        </Link>
        <Link href="/signup">
        <Button className="w-full md:w-auto bg-slate-100 text-black" variant={'ghost'}>Sign Up</Button>
      </Link>
        </div>
      </>
      )}
    </div>
  </nav>
);
}

export default Navbar