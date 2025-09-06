"use client"

import Image from "next/image"
import UserLoginForm from "./authForm"

import poolBg from '@/public/signIn/pool-bg.jpg';
import { useUser } from "@clerk/nextjs"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function AuthenticationPage() {

  const { isLoaded, isSignedIn } = useUser();

  const router = useRouter()

  useEffect(()=>{

    if (isLoaded) {
      if (isSignedIn) {
        console.log('signed In')
        router.push('/')
      } else {
        console.log('not signed in')
      }
    }
  }, [isLoaded, isSignedIn])

  return (
    <>
      <div className="container relative h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <div className="relative hidden h-full flex-col p-10 text-white lg:flex dark:border-r">
          <Image
            src={poolBg}
            alt='bg'
            layout='fill'
            objectFit='cover'
            objectPosition='center'
            className='-z-10'
          />
          <div className="absolute inset-0" />
          <div className="relative z-20 flex items-center text-lg font-medium">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2 h-6 w-6"
            >
              <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
            </svg>
            Pratyush Kongalla
          </div>
          <div className="relative z-20 mt-auto">
            <blockquote className="space-y-2">
              <p className="text-lg">
                The complete pool and snooker club management software
              </p>
              {/* <footer className="text-sm">Sofia Davis</footer> */}
            </blockquote>
          </div>
        </div>
        <div className="lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">
                Log In
              </h1>
              <p className="text-sm text-muted-foreground">
                Enter username and password to login.
              </p>
            </div>
            <UserLoginForm />
            {/* <p className="px-8 text-center text-sm text-muted-foreground">
              By clicking continue, you agree to our{" "}
              <Link
                href="/terms"
                className="underline underline-offset-4 hover:text-primary"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                className="underline underline-offset-4 hover:text-primary"
              >
                Privacy Policy
              </Link>
              .
            </p> */}
          </div>
        </div>
      </div>
    </>
  )
}