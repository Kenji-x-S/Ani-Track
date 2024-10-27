import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Alert } from "../ui/alert";
import { IconUpload } from "@tabler/icons-react";
import { Button } from "./button";

interface SingleFileUploaderProps {
  media: any;
  setMedia: any;
}

const PdfUploader: React.FC<SingleFileUploaderProps> = ({
  media,
  setMedia,
}) => {
  const [error, setError] = useState<string | null>(null);
  const maxSize = 100 * 1024 * 1024; // 100 MB

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setError(null);

      if (acceptedFiles.length === 0) {
        return;
      }

      const selectedFile = acceptedFiles[0];

      if (selectedFile.size > maxSize) {
        setError("Document file size exceeds the 100 MB limit.");
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          // Set both file_url and file_name in the media object
          setMedia((prev: any) => ({
            ...prev,
            file_url: reader.result,
            file_name: selectedFile.name, // Store the file name
          }));
        }
      };
      reader.readAsDataURL(selectedFile);
    },
    [setMedia]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
    },
    multiple: false,
    validator: (file) => {
      const fileType = file.type.split("/")[1];
      if (fileType !== "pdf") {
        return {
          code: "file-invalid-type",
          message: "Invalid file type. Only PDF files are allowed.",
        };
      }
      return null;
    },
  });

  return (
    <div>
      <div {...getRootProps({ className: "dropzone" })}>
        <input {...getInputProps()} />
        {media.file_url ? (
          <div>
            <p>Uploaded File: {media.file_name}</p>{" "}
            {/* Show file name if uploaded */}
          </div>
        ) : (
          <div className="flex items-center justify-center h-48 w-full border-2 border-dashed rounded-lg">
            <IconUpload />
          </div>
        )}
      </div>
      {media.file_url && (
        <Button
          className="mt-2"
          onClick={() =>
            setMedia({ ...media, file_url: null, file_name: null })
          }
        >
          Reset
        </Button>
      )}
      {error && <Alert>{error}</Alert>}
    </div>
  );
};

export default PdfUploader;
