import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FormikProvider } from "formik";
import "react-phone-number-input/style.css";
import SingleFileUploader from "../ui/imageUploader";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import Error from "../ui/error";

export default function AddThreadDialog({
  open,
  setOpen,
  formik,
  action,
  handleClose,
  uploadCheck,
  setUploadCheck,
  groups,
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

            <div>
              <p className="font-semibold text-sm">Group</p>
              <Select
                value={formik.values.groupId}
                onValueChange={(selectedValue) => {
                  formik.setFieldValue("groupId", parseInt(selectedValue));
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Group" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup className="max-h-52 overflow-y-auto">
                    {groups.map((e: any, index: number) => (
                      <SelectItem key={index} value={e.id}>
                        {e.title}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              {formik.touched.groupId && formik.errors.groupId && (
                <Error error={formik.errors.groupId} />
              )}
            </div>
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