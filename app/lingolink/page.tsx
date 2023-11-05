"use client";
/**
 * v0 by Vercel.
 * @see https://v0.dev/t/CoAf9xghm0P
 */
import Link from "next/link";
import Image from "next/image";

export default function Component() {
  return (
    <>
      <title>LingoLink</title>
      <div className="flex flex-col min-h-screen bg-rose-50 dark:bg-gray-900">
        <header className="sticky top-0 z-[999999] border-b border-b-gray-300 bg-slate-100/50 text-slate-700 backdrop-blur-xl dark:border-b-gray-700 dark:bg-transparent dark:text-slate-300">
          <div className="container mx-auto flex flex-1 flex-col px-6 lg:max-w-5xl xl:max-w-6xl 2xl:max-w-7xl">
            <nav className="flex w-full items-center justify-between py-4 text-base">
              <Link className="flex items-center" href="#">
                <Image
                  src="/app_logo.png"
                  alt="LingoLink Logo"
                  width={20}
                  height={50}
                />
                <span className="ml-2 text-2xl font-bold text-blue-600 dark:text-blue-400">
                  LingoLink
                </span>
              </Link>
              <div className="flex items-end ml-auto gap-4">
                <Link
                  className="text-lg font-medium hover:underline text-blue-600 dark:text-blue-400"
                  href="#features"
                >
                  Features
                </Link>
                <Link
                  className="text-lg font-medium hover:underline text-blue-600 dark:text-blue-400"
                  href="#contact"
                >
                  Contact
                </Link>
              </div>
            </nav>
          </div>
        </header>
        <main className="flex-1 py-12 md:py-24 lg:py-32">
          <section className="container mx-auto px-4 md:px-6 space-y-10">
            <div className="space-y-4 text-center">
              <h1 className="text-4xl sm:text-5xl font-bold text-blue-600 dark:text-blue-400">
                Connect words, connect worlds.
              </h1>
              <p className="text-xl text-gray-700 dark:text-gray-300 max-w-lg mx-auto">
                LingoLink is a fun and interactive way to learn new languages.
                Challenge yourself with random phrases from world languages and
                compete for the highest score on the leaderboard.
              </p>
            </div>
            <div className="flex justify-center space-x-4">
              <Image
                className="cursor-pointer"
                onClick={() =>
                  window.open(
                    "https://play.google.com/store/apps/details?id=com.fatihtoker.lingo_link"
                  )
                }
                width={150}
                height={45.5}
                src="/google_play.webp"
                alt="Get it on Google Play"
              />
              <div className="has-tooltip">
                <span className="tooltip rounded shadow-lg p-1 -mt-8">
                  Coming soon
                </span>
                <Image
                  className="opacity-50 cursor-not-allowed"
                  width={150}
                  data-tooltip-target="tooltip-default"
                  height={45.5}
                  src="/app_store.webp"
                  alt="Get it on App Store"
                />
              </div>
            </div>
          </section>
          <section
            id="features"
            className="w-full py-12 md:py-24 lg:py-32 bg-blue-50 dark:bg-gray-800"
          >
            <div className="container mx-auto px-4 md:px-6 space-y-10">
              <h2 className="text-3xl sm:text-4xl font-bold text-center text-blue-600 dark:text-blue-400">
                Features
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-16 h-16 mx-auto"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418"
                    />
                  </svg>

                  <h3 className="text-2xl font-bold text-center text-blue-600 dark:text-blue-400">
                    Variety of Languages
                  </h3>
                  <p className="text-lg text-center text-gray-700 dark:text-gray-300">
                    LingoLink has a wide range of languages in its database. You
                    can see languages from English to Spanish, from Turkish to
                    Japanese, from French to Ukranian and many more.
                  </p>
                </div>
                <div className="space-y-4">
                  <svg
                    className=" mx-auto h-16 w-16 text-blue-500 dark:text-blue-300"
                    fill="none"
                    height="24"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    width="24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                  </svg>
                  <h3 className="text-2xl font-bold text-center text-blue-600 dark:text-blue-400">
                    Variety of Phrases
                  </h3>
                  <p className="text-lg text-center text-gray-700 dark:text-gray-300">
                    LingoLink has thousands of phrases as questions. You can
                    learn phrases from all around the world.
                  </p>
                </div>
                <div className="space-y-4">
                  <svg
                    className=" mx-auto h-16 w-16 text-blue-500 dark:text-blue-300"
                    fill="none"
                    height="24"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    width="24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
                    <path d="M9 18h6" />
                    <path d="M10 22h4" />
                  </svg>
                  <h3 className="text-2xl font-bold text-center text-blue-600 dark:text-blue-400">
                    Show Your Skills to the World
                  </h3>
                  <p className="text-lg text-center text-gray-700 dark:text-gray-300">
                    Show your skills by competing against other players. You can
                    see your rank on the leaderboard.
                  </p>
                </div>
                <div className="space-y-4 text-gray">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-16 h-16 mx-auto"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>

                  <h3 className="text-2xl font-bold text-center text-blue-600 dark:text-blue-400">
                    Compete Against Time
                  </h3>
                  <p className="text-lg text-center text-gray-700 dark:text-gray-300">
                    Try to answer as many questions as you can in a limited
                    time.
                  </p>
                </div>
              </div>
            </div>
          </section>
          <section
            id="contact"
            className="w-full py-12 md:py-24 lg:py-32 bg-blue-50 dark:bg-gray-800"
          >
            <div className="container mx-auto px-4 md:px-6 space-y-10">
              <h2 className="text-3xl sm:text-4xl font-bold text-center text-blue-600 dark:text-blue-400">
                Contact
              </h2>
              <div className="flex flex-row gap-8 justify-center">
                <svg
                  onClick={() =>
                    window.open("mailto:fatihhtoker@gmail.com", "_blank")
                  }
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-8 h-8 text-gray cursor-pointer"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                  />
                </svg>
                <svg
                  onClick={() =>
                    window.open(
                      "https://www.linkedin.com/in/fatih-toker/",
                      "_blank"
                    )
                  }
                  role="img"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-8 h-8 text-gray cursor-pointer"
                >
                  <title>LinkedIn</title>
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
                <svg
                onClick={() =>
                  window.open(
                    "https://github.com/fatihtoker",
                    "_blank"
                  )
                }
                  role="img"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-8 h-8 text-gray cursor-pointer"
                >
                  <title>GitHub</title>
                  <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                </svg>
              </div>
            </div>
          </section>
        </main>
        <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full items-center px-4 md:px-6 border-t border-gray-200 dark:border-gray-800">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            © 2023 LingoLink. All rights reserved.
          </p>
          <nav className="sm:ml-auto flex gap-4">
            <Link
              className="text-sm hover:underline text-blue-600 dark:text-blue-400"
              href="/lingolink/privacy-policy"
            >
              Privacy Policy
            </Link>
          </nav>
        </footer>
      </div>
    </>
  );
}
