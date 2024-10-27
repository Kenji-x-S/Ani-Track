import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Alert } from "../ui/alert";
import { IconUpload } from "@tabler/icons-react";
import { Button } from "./button";

interface SingleFileUploaderProps {
  media: any;
  setMedia: any;
}

const BannerUploader: React.FC<SingleFileUploaderProps> = ({
  media,
  setMedia,
}) => {
  const [error, setError] = useState<string | null>(null);
  const maxImageSize = 5 * 1024 * 1024;
  const maxVideoSize = 100 * 1024 * 1024;

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setError(null);

      if (acceptedFiles.length === 0) {
        return;
      }

      const selectedFile = acceptedFiles[0];
      const fileType = selectedFile.type.split("/")[0];
      if (fileType === "image" && selectedFile.size > maxImageSize) {
        setError("Image file size exceeds the 5 MB limit.");
        return;
      } else if (fileType === "video" && selectedFile.size > maxVideoSize) {
        setError("Video file size exceeds the 100 MB limit.");
        return;
      }
      if (fileType === "image") {
        setMedia((prev: any) => ({ ...prev, media_type: "PHOTO" }));
      } else if (fileType === "video") {
        setMedia((prev: any) => ({ ...prev, media_type: "VIDEO" }));
      }

      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          setMedia((prev: any) => ({ ...prev, media: reader.result }));
        }
      };
      reader.readAsDataURL(selectedFile);
    },
    [setMedia]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".webp", ".gif"],
      // "video/*": [".mp4", ".mov", ".avi", ".mkv"],
    },
    multiple: false,
    validator: (file) => {
      const fileType = file.type.split("/")[0];

      // Check for valid image or video format
      if (fileType !== "image" && fileType !== "video") {
        return {
          code: "file-invalid-type",
          message: "Invalid file type. Only images and videos are allowed.",
        };
      }

      return null;
    },
  });

  return (
    <div>
      <div {...getRootProps({ className: "dropzone" })}>
        <input {...getInputProps()} />
        {media.media ? (
          <>
            {media.media_type === "PHOTO" && media.media ? (
              <img
                src={
                  media.media?.startsWith("data:image")
                    ? media.media
                    : `${process.env.NEXT_PUBLIC_IMAGE_URL}images/${media.media}`
                }
                alt="Uploaded media"
                style={{ width: "100%", height: "auto" }}
              />
            ) : media.media_type === "VIDEO" && media.media ? (
              <video controls className="max-w-full max-h-full">
                <source
                  src={
                    media.media?.startsWith("data:video")
                      ? media.media
                      : `${process.env.NEXT_PUBLIC_IMAGE_URL}images/${media.media}`
                  }
                  type="video/mp4"
                />
                Your browser does not support the video tag.
              </video>
            ) : (
              <></>
            )}
          </>
        ) : (
          <div className="flex items-center justify-center h-48 w-full border-2 border-dashed rounded-lg">
            <IconUpload />
          </div>
        )}
      </div>
      {media.media && (
        <Button
          className="mt-2"
          onClick={() =>
            setMedia({ ...media, media: null, media_type: "TEXT" })
          }
        >
          Reset
        </Button>
      )}
      {error && <Alert>{error}</Alert>}
    </div>
  );
};

export default BannerUploader;
