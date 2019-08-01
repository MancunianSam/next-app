import fetch from 'isomorphic-unfetch';
import Head from "next/head";
import Nav from "../components/nav";
import { WithAuth } from "../auth"


const GetCollection = ({ collections }) => {
  // const worker = new ExampleWorker()

  return (
    <>
      <Head>
        <link
          href="https://s3.eu-west-2.amazonaws.com/assets.tdr.tna/assets/gov.css"
          rel="stylesheet"
        />
      </Head>
      <Nav />
      <main className="govuk-main-wrapper">
        <div className="govuk-grid-row">
          <div className="govuk-grid-column-two-thirds">
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
          </div>
        </div>
      </main>
    </>
  );
};

GetCollection.getInitialProps = async function ({ req }) {
  const res = await fetch(`${process.env.BASE_URL}/api/collections`, { headers: req.headers });
  const responseJson = await res.json()
  console.log(responseJson.data.getCollections)

  return { collections: responseJson.data.getCollections.collections };



};

export default WithAuth(GetCollection);

