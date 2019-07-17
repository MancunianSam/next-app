import * as React from "react";
import { useGetFileInfo } from "./useGetFileInfo";

const FileUploadArea = props => {
  const [dataTransferItems, setDataTransferItems] = React.useState([]);

  const [isDragging, setIsDragging] = React.useState(false);

  const onDrop = event => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);

    const dataTransferItemList = [];

    for (let index = 0; index < event.dataTransfer.items.length; index++) {
      const element = event.dataTransfer.items[index];
      // dataTransferItemList.push(element.webkitGetAsEntry());
    }
    if (
      JSON.stringify(dataTransferItemList) !== JSON.stringify(dataTransferItems)
    ) {
      setDataTransferItems(dataTransferItemList);
    }
  };

  const onDragOver = event => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };
  const files = useGetFileInfo(dataTransferItems);
  if (files.length > 0) {
    props.onFilesProcessed(files);
  }
  const [fileUpdate, setFileUpdate] = React.useState([]);

  return (
    <>
      <div
        className={`govuk-file-drop${isDragging ? "-drag" : ""}`}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        Drop files ...
      </div>
      <style jsx>{`
        .govuk-file-drop-drag {
          display: flex;
          justify-content: center;
          height: 100px;
          margin-bottom: 15px;
          align-items: center;
          background-color: #bfc1c3;
        }

        .govuk-file-drop {
          display: flex;
          justify-content: center;
          height: 100px;
          margin-bottom: 15px;
          align-items: center;
          background-color: #6f777b;
        }
      `}</style>
    </>
  );
};

export { FileUploadArea };
