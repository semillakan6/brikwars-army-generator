import { Metadata } from "next"

export const metadata = {
  title: "Terms of Service - BrikWars Army Generator",
  description: "Terms of service for BrikWars Army Generator",
}

export default function TermsPage() {
  return (
    <div className="container max-w-4xl py-10">
      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
      
      <div className="prose dark:prose-invert">
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
    </div>
  )
} 