import axios from "axios";
import ApolloClient from "apollo-client";
import fetch from "node-fetch";
import { createHttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import gql from "graphql-tag";

const Login = props => {
  const link = createHttpLink({
    uri: "https://m6t2cgd8uc.execute-api.eu-west-2.amazonaws.com/dev/graphql",
    fetch: fetch,
    withCredentials: true,
    credentials: "include"
  });
  const client = new ApolloClient({
    link,
    cache: new InMemoryCache()
  });

  client
    .query({
      query: gql`
        {
          getCollection(id: "0d907682-bbd5-4b9e-83a3-51db879f14df") {
            id
            name
          }
        }
      `
    })
    .then(result => console.log(result));
  return (
    <>
      <div>{props.data} </div>
    </>
  );
};

Login.getInitialProps = async function({ res, ctx, query }) {
  const code = query.code;
  if (code) {
    const body = {
      grant_type: "authorization_code",
      code,
      client_id: "7tmk95dur3gjqklinuvevgahl9",
      redirect_uri:
        "https://9ofer4y2x6.execute-api.eu-west-2.amazonaws.com/dev/login"
    };

    const transformRequest = (jsonData = {}) =>
      Object.entries(jsonData)
        .map(x => `${encodeURIComponent(x[0])}=${encodeURIComponent(x[1])}`)
        .join("&");

    const config = {
      transformRequest,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    };
    const result = await axios.post(
      "https://tdr.auth.eu-west-2.amazoncognito.com/oauth2/token",
      body,
      config
    );

    res.setHeader(
      "Set-Cookie",
      `token=${result.data.access_token}; Domain=.amazonaws.com`
    );
    return { data: JSON.stringify(result.data) };
  }
  return { data: {} };
};

export default Login;
