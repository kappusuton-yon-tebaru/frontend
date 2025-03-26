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
import { postData } from "@/services/baseRequest";

interface RegisterData {
    email: string;
    password: string;
    confirm_password: string;
}

const registerUser = async (data: RegisterData) => {
    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/register`;
    const response = await postData(url, data);
    return response.data;
};

export default function RegisterPage() {
    const router = useRouter();
    const {
        control,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<RegisterData>();

    const registerMutation = useMutation({
        mutationFn: registerUser,
        onSuccess: (data) => {
            toast.success("Registration Successful!");
            router.push("/login");
        },
        onError: (error: any) => {
            toast.error(
                error.response?.data?.message ||
                    "Registration failed. Please try again."
            );
        },
    });

    const password = watch("password");

    const onSubmit = (data: RegisterData) => {
        const { ...submitData } = data;
        registerMutation.mutate(submitData);
    };

    return (
        <>
            <div className="bg-ci-modal-dark-blue flex flex-col justify-center rounded-xl my-12 mx-[400px] gap-4 items-center p-12">
                <Image src={"/logo.svg"} alt="logo" width={100} height={100} />
                <div className="text-4xl font-bold">Register</div>

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

                    <div className="w-full space-y-2">
                        <div className="font-bold">Confirm Password</div>
                        <Controller
                            name="confirm_password"
                            control={control}
                            rules={{
                                required: "Confirm Password is required",
                                validate: (value) =>
                                    value === password ||
                                    "Passwords do not match",
                            }}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    type="password"
                                    className="h-12 focus:bg-ci-modal-blue active:bg-ci-modal-blue hover:bg-ci-modal-blue text-white bg-ci-bg-dark-blue placeholder:text-ci-modal-grey border-ci-modal-grey"
                                    placeholder="Confirm Password"
                                />
                            )}
                        />
                        {errors.confirm_password && (
                            <p className="text-ci-modal-red">
                                {errors.confirm_password.message as string}
                            </p>
                        )}
                    </div>

                    <Button
                        htmlType="submit"
                        className="border-ci-modal-grey bg-ci-modal-light-blue text-white py-6 w-full text-lg"
                        loading={registerMutation.isPending}
                        disabled={registerMutation.isPending}
                    >
                        {registerMutation.isPending
                            ? "Registering..."
                            : "Register"}
                    </Button>
                </form>
                <div className="flex items-center gap-2">
                    <div>Already have an account?</div>
                    <Link className="text-ci-modal-light-blue" href="/login">
                        Login
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
