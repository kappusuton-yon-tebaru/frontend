"use client";
import { useMutation } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import Input from "antd/es/input/Input";
import { Button } from "antd";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";

interface LoginData {
    email: string;
    password: string;
}

const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`;

const loginUser = async (data: LoginData) => {
    const response = await axios.post(url, data, { withCredentials: true });
    console.log(response);
    return response.data;
};

export default function LoginPage() {
    const router = useRouter();

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginData>();

    const loginMutation = useMutation({
        mutationFn: loginUser,
        onSuccess: (data) => {
            router.push("/");
        },
        onError: (error: any) => {
            toast.error(
                error.response?.data?.message ||
                    "Login failed. Please try again."
            );
        },
    });

    const onSubmit = (data: LoginData) => {
        loginMutation.mutate(data);
    };

    return (
        <>
            <div className="bg-ci-modal-dark-blue flex flex-col justify-center rounded-xl my-24 md:mx-[240px] lg:mx-[420px] gap-4 items-center p-12">
                <Image src={"/logo.svg"} alt="logo" width={100} height={100} />
                <div className="text-4xl font-bold">Login</div>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="w-full space-y-4"
                >
                    <div className="w-full space-y-2">
                        <div className="font-bold">Email</div>
                        <Controller
                            name="email"
                            control={control}
                            rules={{
                                required: "Email is required",
                                pattern: {
                                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                                    message: "Invalid email format",
                                },
                            }}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    className="h-12 focus:bg-ci-modal-blue active:bg-ci-modal-blue hover:bg-ci-modal-blue text-white bg-ci-bg-dark-blue placeholder:text-ci-modal-grey border-ci-modal-grey"
                                    placeholder="Email"
                                />
                            )}
                        />
                        {errors.email && (
                            <p className="text-ci-modal-red">
                                {errors.email.message as string}
                            </p>
                        )}
                    </div>

                    <div className="w-full space-y-2">
                        <div className="font-bold">Password</div>
                        <Controller
                            name="password"
                            control={control}
                            rules={{
                                required: "Password is required",
                                minLength: {
                                    value: 6,
                                    message:
                                        "Password must be at least 6 characters long",
                                },
                            }}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    type="password"
                                    className="h-12 focus:bg-ci-modal-blue active:bg-ci-modal-blue hover:bg-ci-modal-blue text-white bg-ci-bg-dark-blue placeholder:text-ci-modal-grey border-ci-modal-grey"
                                    placeholder="Password"
                                />
                            )}
                        />
                        {errors.password && (
                            <p className="text-ci-modal-red">
                                {errors.password.message as string}
                            </p>
                        )}
                    </div>

                    <Link
                        className="w-full flex justify-end text-ci-modal-light-blue"
                        href={"/forgot-password"}
                    >
                        Forgot password?
                    </Link>

                    <Button
                        htmlType="submit"
                        className="border-ci-modal-grey bg-ci-modal-light-blue text-white py-6 w-full text-lg"
                        loading={loginMutation.isPending}
                        disabled={loginMutation.isPending}
                    >
                        {loginMutation.isPending ? "Logging in..." : "Log in"}
                    </Button>
                </form>

                <div className="flex items-center gap-2">
                    <div>Don&apos;t have an account?</div>
                    <Link className="text-ci-modal-light-blue" href="/register">
                        Register
                    </Link>
                </div>
            </div>

            <Toaster
                position="bottom-right"
                toastOptions={{
                    success: {
                        style: {
                            background: "#4CAF50",
                            color: "white",
                        },
                    },
                    error: {
                        style: {
                            background: "#F44336",
                            color: "white",
                        },
                    },
                }}
            />
        </>
    );
}
