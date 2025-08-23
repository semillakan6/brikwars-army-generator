"use client"

import * as React from "react"
import Link from "next/link"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

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
          <p className="text-center text-xs text-muted-foreground md:text-left">
            © 2024-2025 BrikWars Army Generator. Licensed under MIT. This is an unofficial fan tool and is not affiliated with BrikWars.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Dialog>
            <DialogTrigger asChild>
              <button className="text-sm text-muted-foreground hover:underline">
                Privacy Policy
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Privacy Policy</DialogTitle>
              </DialogHeader>
              <div className="prose dark:prose-invert max-w-none">
                <p className="mb-4">Last updated: {new Date().toLocaleDateString()}</p>

                <h2 className="text-2xl font-semibold mt-6 mb-4">Introduction</h2>
                <p className="mb-4">
                  BrikWars Army Generator ("we", "our", or "us") is committed to protecting your privacy. 
                  This Privacy Policy explains how we collect, use, and safeguard your information when you use our website.
                </p>

                <h2 className="text-2xl font-semibold mt-6 mb-4">Information We Collect</h2>
                <p className="mb-4">
                  We do not collect any personal information. The application runs entirely in your browser, 
                  and no data is stored on our servers.
                </p>

                <h2 className="text-2xl font-semibold mt-6 mb-4">Cookies</h2>
                <p className="mb-4">
                  We use essential cookies to maintain your theme preference (light/dark mode). 
                  These cookies are stored locally on your device and are not used for tracking purposes.
                </p>

                <h2 className="text-2xl font-semibold mt-6 mb-4">Third-Party Services</h2>
                <p className="mb-4">
                  We use the following third-party services:
                </p>
                <ul className="list-disc pl-6 mb-4">
                  <li>Google Fonts for typography</li>
                  <li>Ko-fi for donations (if you choose to support the project)</li>
                </ul>

                <h2 className="text-2xl font-semibold mt-6 mb-4">Contact</h2>
                <p className="mb-4">
                  If you have any questions about this Privacy Policy, please contact us through our{" "}
                  <a 
                    href="https://github.com/semillakan6/brikwars-army-generator"
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary hover:underline"
                  >
                    GitHub repository
                  </a>.
                </p>
              </div>
            </DialogContent>
          </Dialog>
          <Dialog>
            <DialogTrigger asChild>
              <button className="text-sm text-muted-foreground hover:underline">
                Terms of Service
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Terms of Service</DialogTitle>
              </DialogHeader>
              <div className="prose dark:prose-invert max-w-none">
                <p className="mb-4">Last updated: {new Date().toLocaleDateString()}</p>

                <h2 className="text-2xl font-semibold mt-6 mb-4">1. Acceptance of Terms</h2>
                <p className="mb-4">
                  By accessing and using BrikWars Army Generator, you accept and agree to be bound by the terms and 
                  conditions of this agreement.
                </p>

                <h2 className="text-2xl font-semibold mt-6 mb-4">2. Use License</h2>
                <p className="mb-4">
                  This project is open source and available under the MIT License. You are free to:
                </p>
                <ul className="list-disc pl-6 mb-4">
                  <li>Use the application for personal or commercial purposes</li>
                  <li>Modify the source code</li>
                  <li>Distribute your modifications</li>
                </ul>

                <h2 className="text-2xl font-semibold mt-6 mb-4">3. Disclaimer</h2>
                <p className="mb-4">
                  BrikWars Army Generator is not affiliated with, authorized, maintained, sponsored, or endorsed by 
                  BrikWars or any of its affiliates or subsidiaries. This is an independent, unofficial tool created 
                  by fans for fans.
                </p>

                <h2 className="text-2xl font-semibold mt-6 mb-4">4. Limitation of Liability</h2>
                <p className="mb-4">
                  In no event shall BrikWars Army Generator be liable for any damages arising out of the use or 
                  inability to use the materials on the website.
                </p>

                <h2 className="text-2xl font-semibold mt-6 mb-4">5. Revisions and Errata</h2>
                <p className="mb-4">
                  The materials appearing on BrikWars Army Generator could include technical, typographical, or 
                  photographic errors. We do not warrant that any of the materials are accurate, complete, or current.
                </p>

                <h2 className="text-2xl font-semibold mt-6 mb-4">6. Contact</h2>
                <p className="mb-4">
                  If you have any questions about these Terms of Service, please contact us through our{" "}
                  <a 
                    href="https://github.com/semillakan6/brikwars-army-generator"
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary hover:underline"
                  >
                    GitHub repository
                  </a>.
                </p>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </footer>
  )
} 