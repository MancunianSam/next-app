debugger;
import uuid4 from "uuid";
import AWS from "aws-sdk";

addEventListener('message', async ({ data }) => {
    postMessage(await getFileInfo(data))
})
const hexString = buffer => {
    const byteArray = new Uint8Array(buffer);

    const hexCodes = [...byteArray].map(value => {
        const hexCode = value.toString(16);
        const paddedHexCode = hexCode.padStart(2, "0");
        return paddedHexCode;
    });

    return hexCodes.join("");
};

const generateHash = file => {
    const crypto = self.crypto.subtle;
    const fileReader = new FileReader();
    fileReader.readAsArrayBuffer(file);
    return new Promise(resolve => {
        fileReader.onload = async function () {
            const fileReaderResult = fileReader.result;
            if (fileReaderResult instanceof ArrayBuffer) {
                const buffer = await crypto.digest("SHA-256", fileReaderResult);
                resolve(hexString(buffer));
            }
        };
    });
};

const getFileInfo = async data => {
    const { file, id, token } = data
    const fileId = uuid4()
    const checksum = await generateHash(file)

    upload(file, fileId, id, token)

    return {

        id: fileId,
        checksum,
        size: file.size.toString(),
        path: file.webkitRelativePath,
        lastModifiedDate: file.lastModified.toString(),
        fileName: file.name
    }
}

const getCredentials = async token => {
    return new Promise((resolve, reject) => {
        const IdentityPoolId = "eu-west-2:4b26364a-3070-4f98-8e86-1e33a1b54d85";
        const cognitoLoginId =
            "cognito-idp.eu-west-2.amazonaws.com/eu-west-2_6Mn0M2i9C";
        AWS.config.region = "eu-west-2";
        AWS.config.credentials = new AWS.CognitoIdentityCredentials({
            IdentityPoolId,
            Logins: {
                [cognitoLoginId]: token
            }
        });
        AWS.config.getCredentials(function (err) {
            if (err === undefined || err === null) {
                resolve();
            } else {
                reject(err.code);
            }
        });
    });
};

const upload = async (file, fileId, id, token) => {
    var Bucket = "tdr-files";
    await getCredentials(token);
    var s3 = new AWS.S3({
        params: {
            Bucket
        }
    });
    s3.upload(
        {
            Key: `${id}/${fileId}`,
            Body: file,
            Bucket
        },
        {},
        function (err) {
            console.log(err);

        }
    );
};

