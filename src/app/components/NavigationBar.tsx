import Image from "next/image";
import Link from "next/link";
import OrganizationButton from "./OrganizationButton";

export default async function NavigationBar() {
  const organization = ["Organizaiton 1", "Organization 2", "Organization 3"];
  return (
    <div className="flex flex-row h-16 bg-[#081126] fixed top-0 left-0 right-0 z-30 items-center px-9 justify-between font-bold">
      <div className="flex flex-row gap-x-12 items-center h-12">
        <Image
          src={"/logo.svg"}
          alt="logo"
          width={44}
          height={44}
          className=""
        />
        <div className="">Project</div>
        <div className="">Image and Deployment</div>
      </div>
      <div className="flex flex-row gap-x-12 items-center">
        <OrganizationButton organization={organization} />
        {/* <select name="organization" id="" className="bg-ci-bg-dark-blue py-3 px-4 rounded-md ">
          <option>Organization 1</option>
        </select> */}
        <div className="bg-[#D9D9D9] rounded-full w-12 h-12 flex items-center justify-center">
          <Image src="/user_icon.svg" alt="user_icon" width={44} height={44} />
        </div>
      </div>
    </div>
  );
}
