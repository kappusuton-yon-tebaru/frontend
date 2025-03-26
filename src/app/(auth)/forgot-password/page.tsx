import Input from "antd/es/input/Input";
import { Button } from "antd";

export default function LoginPage() {
    return (
        <div className="bg-ci-modal-dark-blue flex flex-col justify-center rounded-xl my-24 mx-[480px] gap-4 items-center p-12">
            <div className="text-4xl font-bold">Reset your password</div>
            <div className="w-full space-y-2">
                <div className="font-bold text-sm">
                    Enter your email address to receive a password reset email.
                </div>
                <Input
                    className="h-12 bg-ci-bg-dark-blue placeholder:text-ci-modal-grey border-ci-modal-grey"
                    placeholder="Enter your email address"
                />
            </div>
            <Button className="border-ci-modal-grey bg-ci-modal-light-blue text-white py-6 w-full text-lg">
                Send password reset email
            </Button>
        </div>
    );
}
