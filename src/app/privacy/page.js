import { Metadata } from "next"

export const metadata = {
  title: "Privacy Policy - BrikWars Army Generator",
  description: "Privacy policy for BrikWars Army Generator",
}

export default function PrivacyPage() {
  return (
    <div className="container max-w-4xl py-10">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      
      <div className="prose dark:prose-invert">
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
    </div>
  )
} 