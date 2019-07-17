import { FileUploadArea } from "../components/fileupload";
import Head from "next/head";
import AWS from "aws-sdk";
import Nav from "../components/nav";
import Worker from "../upload.worker"

const Upload = ({ id, token }) => {
  const [files, setFiles] = React.useState([])
  const [uploaded, setUploaded] = React.useState([])
  const upload = () => {

    for (const file of files) {
      const worker = new Worker()
      worker.postMessage({ file, id, token })
      worker.addEventListener('message', msg => {
        const newUploaded = uploaded.slice(0)
        console.log(newUploaded)
        newUploaded.push(msg.data)
        setUploaded(newUploaded)
        console.log(msg)
      });
    }
  }
  return (
    <>
      <Nav />
      <Head>
        <link
          href="https://s3.eu-west-2.amazonaws.com/assets.tdr.tna/assets/gov.css"
          rel="stylesheet"
        />
      </Head>
      <div>
        <noscript>
          <div>
            Javascript is not enabled in this browser
            <br />
            This is probably because of network issues so you won't be able to
            see this page anyway
          </div>
        </noscript>

        <main className="govuk-main-wrapper">
          <div className="govuk-grid-row">
            <div className="govuk-grid-column-two-thirds">
              <table className="govuk-table">
                <caption className="govuk-table__caption">Files Uploaded</caption>
                <thead className="govuk-table__head">
                  <tr className="govuk-table__row">
                    <th className="govuk-table__header" scope="col">
                      File Path
            </th>
                    <th className="govuk-table__header" scope="col">
                      Checksum
            </th>
                    <th className="govuk-table__header" scope="col">
                      Size
            </th>
                  </tr>
                </thead>
                <tbody className="govuk-table__body">
                  {uploaded.map(each => {
                    return (
                      <tr className="govuk-table__row" key={each.id}>
                        <td className="govuk-table__cell">{each.path}</td>
                        <td className="govuk-table__cell">{each.checksum.substring(0, 10) + "..."}</td>
                        <td className="govuk-table__cell">{each.size}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </main>

        <div className="govuk-form-group">
          <label className="govuk-label" htmlFor="file-upload-1">
            Upload a file
          </label>
          <input className="govuk-file-upload" id="file-upload-1" name="file-upload-1" type="file" webkitdirectory="true" onChange={event => {
            setFiles(event.target.files)
          }} />
        </div>
        <button className="govuk-button" onClick={upload}>Upload</button>
      </div>
    </>
  );
};

Upload.getInitialProps = async function ({ req, query }) {
  const { id } = query;
  const token = req.headers.cookie.split("=")[1];
  return {
    id,
    token
  };
};

export default Upload;
