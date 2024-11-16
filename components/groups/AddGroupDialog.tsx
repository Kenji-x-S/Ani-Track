import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FormikProvider } from "formik";
import "react-phone-number-input/style.css";
import SingleFileUploader from "../ui/imageUploader";

export default function AddGroupDialog({
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
              {action === "create" ? "Create Group" : "Update Group"}
            </p>

            <div className="mt-4">
              <Label htmlFor="title" className="font-semibold text-sm">
                Group Title
              </Label>
              <Input
                className="mt-2"
                placeholder="Group Title"
                id="title"
                name="title"
                value={formik.values.title}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.title && formik.errors.title && (
                <p className="text-orange-600 text-sm font-semibold">
                  {formik.errors.title}
                </p>
              )}
            </div>
            <div className="mt-4">
              <Label
                htmlFor="threadDescription"
                className="font-semibold text-sm"
              >
                Group Description
              </Label>
              <Input
                className="mt-2"
                placeholder="Group Description"
                id="description"
                name="description"
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.description && formik.errors.description && (
                <p className="text-orange-600 text-sm font-semibold">
                  {formik.errors.description}
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