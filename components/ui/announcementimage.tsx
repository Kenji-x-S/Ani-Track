import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Alert } from "../ui/alert";

interface AnnouncementImageProps {
  file: string | null; // Use string for data URL or null
  setFile: (file: string | null) => void; // SetFile to accept null
}

const AnnouncementImage: React.FC<AnnouncementImageProps> = ({
  file,
  setFile,
}) => {
  const [error, setError] = useState<string | null>(null);
  const maxSize = 10 * 1024 * 1024;

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
          setFile(reader.result as string);
        }
      };
      reader.readAsDataURL(selectedFile);
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
    <div>
      <div {...getRootProps({ className: "dropzone" })}>
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors duration-300">
          {file ? (
            <img
              src={file}
              alt="Uploaded"
              className="object-cover w-full h-full rounded-lg"
            />
          ) : (
            <p className="pt-5 pb-6 text-center text-gray-500">
              Drag and drop an image here, or click to select an image
            </p>
          )}
        </div>
      </div>

      {error && <Alert>{error}</Alert>}
    </div>
  );
};

export default AnnouncementImage;
