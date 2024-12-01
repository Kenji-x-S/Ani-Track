import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FormikProvider } from "formik";
import "react-phone-number-input/style.css";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios, { AxiosResponse } from "axios";
import { CardContent, CardFooter } from "../ui/card";
import { Textarea } from "../ui/textarea";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
export default function UpdateProfile({ session, open, setOpen }: any) {
  const router = useRouter();

  useEffect(() => {
    if (session) formik.setValues(session?.user);
  }, [session]);
  const validationSchema = Yup.object({
    username: Yup.string()
      .required("Username is required")
      .test("username-exists", "Username already taken", async (value) => {
        try {
          const response: AxiosResponse = await axios.post(
            "/api/users/verifyusername",
            {
              username: value,
              action: "view",
              id: session?.user?.id,
            }
          );
          const isExist = response.data;
          return value && (isExist as any);
        } catch (error: any) {}
      }),
    email: Yup.string()
      .required("Email is required")
      .email("Invalid email address")
      .test("email-exists", "Email already taken", async (value) => {
        try {
          const response: AxiosResponse = await axios.post(
            "/api/users/verifyemail",
            {
              email: value,
              action: "view",
              id: session?.user?.id,
            }
          );
          const isExist = response.data;
          return value && (isExist as any);
        } catch (error: any) {}
      }),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .nullable(""),
    name: Yup.string().required("Name is required"),
    bio: Yup.string()
      .required("")
      .min(10, "Bio must be at least 10 characters")
      .max(200, "Bio must not exceed 200 characters"),
  });

  const formik = useFormik({
    validateOnChange: false,
    validateOnBlur: true,
    initialValues: {
      username: "",
      password: "",
      email: "",
      name: "",
      bio: "",
    },
    validationSchema,
    onSubmit: (values) => {
      const createUser = async () => {
        try {
          await axios.post("/api/users/updateprofile", values);
          window.location.reload();
        } catch (error: any) {}
      };

      createUser();
    },
  });
  return (
    <Dialog open={open}>
      <DialogContent className="max-w-[900px] w-full max-h-screen overflow-y-auto">
        <FormikProvider value={formik}>
          <form encType="multipart/form-data" onSubmit={formik.handleSubmit}>
            <CardContent className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="text"
                  name="name"
                  placeholder="johndoe"
                  required
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.name && formik.errors.name && (
                  <p className="text-orange-600 text-sm font-semibold">
                    {formik.errors.name}
                  </p>
                )}
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  name="username"
                  placeholder="johndoe"
                  required
                  value={formik.values.username}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.username && formik.errors.username && (
                  <p className="text-orange-600 text-sm font-semibold">
                    {formik.errors.username}
                  </p>
                )}

                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="text"
                  name="email"
                  placeholder="johndoe"
                  required
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.email && formik.errors.email && (
                  <p className="text-orange-600 text-sm font-semibold">
                    {formik.errors.email}
                  </p>
                )}
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  name="password"
                  placeholder="********"
                  required
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.password && formik.errors.password && (
                  <p className="text-orange-600 text-sm font-semibold">
                    {formik.errors.password}
                  </p>
                )}
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  name="bio"
                  placeholder="Bio"
                  required
                  value={formik.values.bio}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.bio && formik.errors.bio && (
                  <p className="text-orange-600 text-sm font-semibold">
                    {formik.errors.bio}
                  </p>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col items-start gap-4">
              <Button type="submit" className="w-full">
                Update
              </Button>
            </CardFooter>
          </form>
        </FormikProvider>
      </DialogContent>
    </Dialog>
  );
}
