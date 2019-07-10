import React from "react";
import Link from "next/link";
import Nav from "../components/nav";
import Head from "next/head";
import { WithAuth } from "../auth";

const Home = props => {
  console.log(props)
  return (
    < div >
      <Nav />
      <Head>
        <link
          href="https://s3.eu-west-2.amazonaws.com/assets.tdr.tna/assets/gov.css"
          rel="stylesheet"
        />
      </Head>

      <div className="hero">
        <h1 className="title">Welcome to TDR</h1>
      </div>
    </div >
  )
};


export default WithAuth(Home);
