'use client'
import { Page, Box } from "grommet"
import { getSession, signIn, signOut, useSession } from "next-auth/react";

import { Component } from "./component";
import { useState, useEffect } from "react";
import Footer from "./Footer";
import Hero from "./Hero";

import { Button } from "./ui/button";
import { FaGithub } from "react-icons/fa";


export default function Home() {

  const { data: session } = useSession();
  const [contributorData, setContributorData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetch('/api/contributors?', { headers: { 'Cache-Control': 'no-cache' } }).then((res) => res.json());
      if (data.error) { setContributorData([]) }
      else {
        setContributorData(data);
      }
    };
    fetchData();

    // const intervalId = setInterval(fetchData, 10000); // load every 10 seconds

    // return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);

  useEffect(() => {
    if (session) {
      //@ts-ignore
      const access_token = session.accessToken || "test";
      
      fetch('/api/contributors', {method:"POST", headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ data: { access_token: access_token } })}).then((res) => res.json());
    }
  }
    , [])


  return (
    <>
      <Page>


        <Box>
          <Hero />
          {!session &&
            <div className="flex justify-center mt-4">
              <Button
                onClick={() => signIn()}
                className="inline-flex w-50 h-10 items-center justify-center rounded-md text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
              >
                <FaGithub className="mr-1" size="small" />
                Connect Github
              </Button>
            </div>

          }

          {/* {session && */}
          {/* <div className="flex justify-center mt-4">
            <Button
              onClick={() => signOut()}
              className="inline-flex w-50 h-10 items-center justify-center rounded-md text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
            >
              <FaGithub className="mr-1" size="small" />
              Signout
            </Button>
          </div> */}

          <Component contributors={contributorData} />
          {/* {session ? <Component contributors={contributorData} /> : <Login />} */}
          <Footer />
        </Box>
      </Page >


    </>
  );
}