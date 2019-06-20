import axios from "axios";
import Head from "next/head";
import Nav from "../components/nav";

const CreateCollection = props => {
  return (
    <div className="govuk-width-container">
      <Nav />
      <Head>
        <link
          href="https://s3.eu-west-2.amazonaws.com/assets.tdr.tna.com/assets/gov.css"
          rel="stylesheet"
        />
      </Head>
      <main className="govuk-main-wrapper">
        <div className="govuk-grid-row">
          <div className="govuk-grid-column-two-thirds">
            <h1 className="govuk-heading-l">{props.title}</h1>
            <form
              action="https://m6t2cgd8uc.execute-api.eu-west-2.amazonaws.com/dev/createcollection"
              method="POST"
            >
              <div className="govuk-form-group">
                <label className="govuk-label" htmlFor={props.id}>
                  Collection Name
                </label>
                <input
                  className={`govuk-input govuk-!-width-one-third`}
                  id="collectionName"
                  name="collectionName"
                />
              </div>
              <div className="govuk-form-group">
                <button className="govuk-button" type="submit">
                  Create Collection
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

CreateCollection.getInitialProps = async function({ res, req, query }) {
  const code = query.code;
  console.log(req.headers);
  if (
    code &&
    (!req.headers.cookie || req.headers.cookie.indexOf("token") === -1)
  ) {
    const body = {
      grant_type: "authorization_code",
      code,
      client_id: "7tmk95dur3gjqklinuvevgahl9",
      redirect_uri:
        "https://9ofer4y2x6.execute-api.eu-west-2.amazonaws.com/dev/createcollection"
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
      `token=${result.data.id_token}; Domain=.amazonaws.com`
    );
    return { data: JSON.stringify(result.data) };
  }
  return { data: [] };
};

export default CreateCollection;
