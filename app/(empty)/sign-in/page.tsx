"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import axios, { AxiosResponse } from "axios";
import { useFormik } from "formik";
import { signIn, useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import * as Yup from "yup";
export default function LoginForm() {
  const router = useRouter();
  const { toast } = useToast();
  const { data: session } = useSession();
  const { theme } = useTheme();
  const validationSchema = Yup.object({
    username: Yup.string()
      .required("Username is required")
      .test("username-exists", "Username is not registered", async (value) => {
        try {
          const response: AxiosResponse = await axios.post(
            "/api/users/verifyusername",
            {
              username: value,
              action: "create",
            }
          );
          const isExist = response.data;
          return value && (!isExist as any);
        } catch (error: any) {
          toast({
            variant: "destructive",
            title: "Error",
            description:
              error?.response?.data?.error || error?.error || error?.message,
          });
        }
      }),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .required(""),
  });

  const formik = useFormik({
    validateOnChange: false,
    validateOnBlur: true,
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema,
    onSubmit: (values) => {
      const createUser = async () => {
        try {
          const response = await signIn("credentials", {
            username: values.username,
            password: values.password,
            redirect: false,
            callbackUrl: `/anime`,
          });
          if (response?.error) {
            toast({
              variant: "destructive",
              title: "Error",
              description: response.error,
            });
          } else {
            toast({
              title: "Success",
              description: "Login successful",
            });
            router.push("/anime");
          }
        } catch (error: any) {
          toast({
            variant: "destructive",
            title: "Error",
            description:
              error?.response?.data?.error || error?.error || error?.message,
          });
        }
      };

      createUser();
    },
  });
  return (
    <div
      className="w-full min-h-screen flex justify-center items-center flex-col  bg-center bg-cover"
      style={{
        background:
          theme === "light"
            ? "url('Ani-Track wht.png')"
            : "url('Ani-Track blk.png')",
      }}
    >
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Login</CardTitle>
          <CardDescription>
            Enter your details username and password to login to your account.
          </CardDescription>
        </CardHeader>

        <form encType="multipart/form-data" onSubmit={formik.handleSubmit}>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
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
            </div>
          </CardContent>
          <CardFooter className="flex flex-col items-start gap-4">
            <Button type="submit" className="w-full">
              Sign In
            </Button>
            <Button
              type="button"
              onClick={() => router.push("/sign-up")}
              className="w-full"
            >
              Sign Up
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
