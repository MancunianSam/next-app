import React from "react";
import Nav from "../components/nav";
import Head from "next/head";
import { WithAuth } from "../auth";

const Home = props => {
  const onClick = () => {
    if (window) {

    }
  }

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
        <h1 onClick={() => onClick()} className="title">Welcome to TDR</h1>
      </div>
    </div >
  )
};


export default Home;
