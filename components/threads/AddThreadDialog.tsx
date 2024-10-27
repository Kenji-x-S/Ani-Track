import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FormikProvider } from "formik";
import "react-phone-number-input/style.css";
import SingleFileUploader from "../ui/imageUploader";

export default function AddThreadDialog({
  open,
  setOpen,
  formik,
  action,
  handleClose,
  uploadCheck,
  setUploadCheck,
}: any) {
  return (
    <Dialog open={open}>
      <DialogContent className="max-w-[900px] w-full max-h-screen overflow-y-auto">
        <FormikProvider value={formik}>
          <form encType="multipart/form-data" onSubmit={formik.handleSubmit}>
            <p className="font-bold">
              {action === "create" ? "Create Thread" : "Update Thread"}
            </p>

            <div className="mt-4">
              <Label htmlFor="threadTitle" className="font-semibold text-sm">
                Thread Title
              </Label>
              <Input
                className="mt-2"
                placeholder="Thread Title"
                id="threadTitle"
                name="threadTitle"
                value={formik.values.threadTitle}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.threadTitle && formik.errors.threadTitle && (
                <p className="text-orange-600 text-sm font-semibold">
                  {formik.errors.threadTitle}
                </p>
              )}
            </div>
            <div className="mt-4">
              <Label
                htmlFor="threadDescription"
                className="font-semibold text-sm"
              >
                Thread Description
              </Label>
              <Input
                className="mt-2"
                placeholder="Thread Description"
                id="threadDescription"
                name="threadDescription"
                value={formik.values.threadDescription}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.threadDescription &&
                formik.errors.threadDescription && (
                  <p className="text-orange-600 text-sm font-semibold">
                    {formik.errors.threadDescription}
                  </p>
                )}
            </div>
            <SingleFileUploader
              file={formik.values.image}
              setFile={(file: string) => formik.setFieldValue("image", file)}
              uploadCheck={uploadCheck}
              setUploadCheck={setUploadCheck}
            />
            {formik.values.image && (
              <Button
                className="mt-2"
                onClick={() => {
                  formik.setFieldValue("image", null);
                  setUploadCheck(false);
                }}
              >
                Remove
              </Button>
            )}
            <DialogFooter className="mt-6">
              <Button type="submit">
                {action === "create" ? "Create" : "Update"}
              </Button>
              <Button type="button" onClick={handleClose}>
                Close
              </Button>
            </DialogFooter>
          </form>
        </FormikProvider>
      </DialogContent>
    </Dialog>
  );
}
