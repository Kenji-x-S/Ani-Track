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
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import axios, { AxiosResponse } from "axios";
import { useFormik } from "formik";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import * as Yup from "yup";
export default function LoginForm() {
  const router = useRouter();
  const { toast } = useToast();
  const { data: session } = useSession();

  const validationSchema = Yup.object({
    username: Yup.string()
      .required("Username is required")
      .test("username-exists", "Username already taken", async (value) => {
        try {
          const response: AxiosResponse = await axios.post(
            "/api/users/verifyusername",
            {
              username: value,
              action: "create",
            }
          );
          const isExist = response.data;
          return value && (isExist as any);
        } catch (error: any) {
          toast({
            variant: "destructive",
            title: "Error",
            description:
              error?.response?.data?.error || error?.error || error?.message,
          });
        }
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
              action: "create",
            }
          );
          const isExist = response.data;
          return value && (isExist as any);
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
          await axios.post("/api/users/createuser", values);

          toast({
            title: "Success",
            description: "Account created successfully",
          });
          router.push("/sign-in");
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
    <div className="w-full min-h-screen flex justify-center items-center flex-col">
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
              Sign Up
            </Button>
            <Button
              type="button"
              onClick={() => router.push("/sign-in")}
              className="w-full"
            >
              Sign In
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
