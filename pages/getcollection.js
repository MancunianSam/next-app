import ApolloClient from "apollo-client";
import fetch from "node-fetch";
import { createHttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import gql from "graphql-tag";
import { setContext } from "apollo-link-context";
import Head from "next/head";
import Nav from "../components/nav";

const GetCollection = ({ collections }) => {
  return (
    <>
      <Head>
        <link
          href="https://s3.eu-west-2.amazonaws.com/assets.tdr.tna.com/assets/gov.css"
          rel="stylesheet"
        />
      </Head>
      <Nav />
      <table className="govuk-table">
        <caption className="govuk-table__caption">File Information</caption>
        <thead className="govuk-table__head">
          <tr className="govuk-table__row">
            <th className="govuk-table__header" scope="col">
              Collection Name
            </th>
            <th className="govuk-table__header" scope="col">
              Closure
            </th>
            <th className="govuk-table__header" scope="col">
              Copyright
            </th>
            <th className="govuk-table__header" scope="col">
              Legal Status
            </th>
          </tr>
        </thead>
        <tbody className="govuk-table__body">
          {(collections || []).map(collection => {
            return (
              <tr className="govuk-table__row" key={collection.id}>
                <td className="govuk-table__cell">{collection.name}</td>
                <td className="govuk-table__cell">{collection.closure}</td>
                <td className="govuk-table__cell">{collection.copyright}</td>
                <td className="govuk-table__cell">{collection.legalStatus}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
};

GetCollection.getInitialProps = async function({ req }) {
  const token = req.headers.cookie.split("=")[1];
  const link = createHttpLink({
    uri: "https://m6t2cgd8uc.execute-api.eu-west-2.amazonaws.com/dev/graphql",
    fetch: fetch,
    withCredentials: true,
    credentials: "include"
  });
  console.log(token);
  const authLink = setContext(async (_, { headers }) => {
    return {
      headers: {
        authorization: `Bearer ${token}`
      }
    };
  });
  const client = new ApolloClient({
    link: authLink.concat(link),
    cache: new InMemoryCache()
  });

  const result = await client.query({
    query: gql`
      {
        getCollections(offset: 0, limit: 10) {
          id
          name
          closure
          legalStatus
          copyright
        }
      }
    `
  });
  return { collections: result.data.getCollections };
};

export default GetCollection;
