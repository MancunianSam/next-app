import Head from "next/head";
import Nav from "../components/nav";

const CreateCollection = props => {
  return (
    <div >
      <Nav />
      <Head>
        <link
          href="https://s3.eu-west-2.amazonaws.com/assets.tdr.tna/assets/gov.css"
          rel="stylesheet"
        />
      </Head>
      <main className="govuk-main-wrapper">
        <div className="govuk-grid-row">
          <div className="govuk-grid-column-two-thirds">
            <h1 className="govuk-heading-l">{props.title}</h1>
            <form
              action="https://rn9sl8cy7f.execute-api.eu-west-2.amazonaws.com/dev/collections"
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

export default CreateCollection;
