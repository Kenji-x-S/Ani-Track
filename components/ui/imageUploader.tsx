import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Alert } from "../ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { Button } from "./button";
import Image from "next/image";
import { IconCloudUpload } from "@tabler/icons-react";

interface SingleFileUploaderProps {
  file: any;
  setFile: any;
  uploadCheck: boolean;
  setUploadCheck: React.Dispatch<React.SetStateAction<boolean>>;
}

const SingleFileUploader: React.FC<SingleFileUploaderProps> = ({
  file,
  setFile,
  uploadCheck,
  setUploadCheck,
}) => {
  const [error, setError] = useState<string | null>(null);
  const maxSize = 5 * 1024 * 1024;

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setError(null);

      if (acceptedFiles.length === 0) {
        return;
      }

      const selectedFile = acceptedFiles[0];
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          setFile(reader.result);
        }
      };
      reader.readAsDataURL(selectedFile);

      setUploadCheck(true);
    },
    [setFile]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".webp", ".gif"],
    },
    maxSize,
    multiple: false,
  });

  return (
    <div className="w-full border-2 border-dashed border-border rounded-md h-60 flex flex-col justify-center items-center overflow-hidden mt-4">
      <div {...getRootProps({ className: "dropzone" })}>
        <input {...getInputProps()} />
        {file ? (
          <Image src={file} alt="image" width={500} height={500} />
        ) : (
          <div className="flex flex-col justify-center items-center">
            <IconCloudUpload size={96} />
            <p>Upload Image</p>
          </div>
        )}
      </div>

      {error && <Alert>{error}</Alert>}
    </div>
  );
};

export default SingleFileUploader;
