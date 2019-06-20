import { FileUploadArea } from "../components/fileupload";
import Head from "next/head";
import AWS from "aws-sdk";
import Nav from "../components/nav";

const Upload = ({ id, token }) => {
  const [fileUpdate, setFileUpdate] = React.useState([]);
  const getCredentials = async () => {
    return new Promise((resolve, reject) => {
      const IdentityPoolId = "eu-west-2:4b26364a-3070-4f98-8e86-1e33a1b54d85";
      const cognitoLoginId =
        "cognito-idp.eu-west-2.amazonaws.com/eu-west-2_6Mn0M2i9C";
      AWS.config.region = "eu-west-2";
      AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: IdentityPoolId,
        Logins: {
          [cognitoLoginId]: token
        }
      });
      AWS.config.getCredentials(function(err) {
        if (err === undefined || err === null) {
          resolve();
        } else {
          reject(err.code);
        }
      });
    });
  };

  const upload = async () => {
    var Bucket = "tdr-files";
    await getCredentials();
    var s3 = new AWS.S3({
      params: {
        Bucket
      }
    });
    fileUpdate.forEach(update => {
      s3.upload(
        {
          Key: `${id}/${update.id}`,
          Body: update.file,
          Bucket
        },
        {},
        function(err) {
          console.log(err);
        }
      );
    });
  };

  return (
    <>
      <Nav />
      <Head>
        <link
          href="https://s3.eu-west-2.amazonaws.com/assets.tdr.tna.com/assets/gov.css"
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
        <FileUploadArea
          onFilesProcessed={files => {
            const checksumsa = files.map(f => f.checksum).sort();
            const checksumsb = fileUpdate.map(f => f.checksum).sort();
            if (JSON.stringify(checksumsa) !== JSON.stringify(checksumsb)) {
              setFileUpdate(files);
              console.log(files);
            }
          }}
        />
        <button onClick={upload}>Upload</button>
      </div>
    </>
  );
};

Upload.getInitialProps = async function({ req, query }) {
  const { id } = query;
  const token = req.headers.cookie.split("=")[1];
  return {
    id,
    token
  };
};

export default Upload;
