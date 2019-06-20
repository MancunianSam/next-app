import * as React from "react";
import uuid4 from "uuid";

function useGetFileInfo(dataItems) {
  const [fileInfo, setFileInfo] = React.useState([]);

  const getFileFromEntry = entry => {
    return new Promise(resolve => {
      entry.file(f => {
        resolve(f);
      });
    });
  };

  const getEntriesFromReader = reader => {
    return new Promise(resolve => {
      reader.readEntries(entries => {
        resolve(entries);
      });
    });
  };
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
    const crypto = window.crypto.subtle;
    const fileReader = new FileReader();
    fileReader.readAsArrayBuffer(file);
    return new Promise(resolve => {
      fileReader.onload = async function() {
        const fileReaderResult = fileReader.result;
        if (fileReaderResult instanceof ArrayBuffer) {
          const buffer = await crypto.digest("SHA-256", fileReaderResult);
          resolve(hexString(buffer));
        }
      };
    });
  };

  const getAllFiles = async (entry, fileInfoInput) => {
    const reader = entry.createReader();
    const entries = await getEntriesFromReader(reader);
    for (const entry of entries) {
      if (entry.isDirectory) {
        await getAllFiles(entry, fileInfoInput);
      } else {
        fileInfoInput.push({
          entry: entry,
          file: await getFileFromEntry(entry),
          shaHash: await generateHash(await getFileFromEntry(entry))
        });
      }
    }
    return fileInfoInput;
  };

  React.useEffect(() => {
    const getFileInfo = async () => {
      let allFileInfo = [];
      for (const item of dataItems) {
        const allFiles = await getAllFiles(item, []);
        allFileInfo = allFileInfo.concat(allFiles);
      }

      const updateFiles = allFileInfo.map(fileInfo => ({
        id: uuid4(),
        checksum: fileInfo.shaHash,
        size: fileInfo.file.size.toString(),
        path: fileInfo.entry.fullPath,
        lastModifiedDate: fileInfo.file.lastModified.toString(),
        file: fileInfo.file,
        fileName: fileInfo.file.name
      }));
      setFileInfo(updateFiles);
    };
    getFileInfo();
  });

  return fileInfo;
}

export { useGetFileInfo };
