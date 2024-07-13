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
    <div className="navbar border-1 shadow-sm bg-gray-900">
    <div className="flex-1">
      <Link href={"/"} className="btn btn-ghost text-white text-xl">Anonymous Wave</Link>
    </div>
    <div className="flex px-1">
      <ul className="flex gap-4">
        <li className=''>{session ? 
            <>
              <span className="mr-80 text-white">
              Welcome, {user?.username || user?.email}
              </span>
              <Link href={"/dashboard"} className="rounded-t-none p-2 btn text-white text-xl btn-ghost">Dashboard</Link> 
              <Button onClick={onLogout} className="mx-2">Logout</Button>
            </>
            : 
            <>
              <Button size={"sm"}>
                <Link href={"/signin"} className='text-[1rem]'>Login</Link>
              </Button>
                          
            </>}</li>
      </ul>
    </div>
    </div>
  )
}

export default Navbar