'use client'

import Link from "next/link"


export default function Hero() {
  return (
    <>
      <div className="flex flex-col">
        <header className="px-4 lg:px-6 h-14 flex items-center justify-between">
          <Link href="#" className="flex items-center justify-center" prefetch={false}>
            <span className="sr-only">100xLeaderboard</span>
          </Link>
          
        </header>
        <main className="flex-1">
          <section className="w-full py-2 lg:py-2">
            <div className="container grid items-center justify-center gap-4 px-4 md:px-6 lg:gap-10">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                  100xLeaderboard
                </h2>
                <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  The Ultimate Showcase of Top Contributors </p>
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  )
}
