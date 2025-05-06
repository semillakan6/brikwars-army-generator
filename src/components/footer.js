"use client"

import * as React from "react"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t">
      <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left p-7">
          <span className="flex items-center gap-2">
            Want to support my work?{" "}
            <a 
              href='https://ko-fi.com/I3I1SPFPB' 
              target='_blank'
              className="transition-transform hover:scale-105"
            >
              <img 
                height='36' 
                style={{border: '0px', height: '36px'}} 
                src='https://storage.ko-fi.com/cdn/kofi2.png?v=6' 
                border='0' 
                alt='Buy Me a Coffee at ko-fi.com' 
              />
            </a>
          </span>
            Built by{" "}
            <a
              href="https://github.com/semillakan6"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              Ruben Eduardo Cuevas Moreno
            </a>
            . The source code is available on{" "}
            <a
              href="https://github.com/semillakan6/brikwars-army-generator"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              GitHub
            </a>
            .
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/privacy"
            className="text-sm text-muted-foreground hover:underline"
          >
            Privacy Policy
          </Link>
          <Link
            href="/terms"
            className="text-sm text-muted-foreground hover:underline"
          >
            Terms of Service
          </Link>
        </div>
      </div>
    </footer>
  )
} 