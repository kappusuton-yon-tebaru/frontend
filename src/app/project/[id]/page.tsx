import Image from "next/image";

export default function Project() {
  const projectSpaces = [
    { name: "Project Space 1", date: "31 Feb 2099", time: "14:30" },
    { name: "Project Space 2", date: "31 Feb 2099", time: "10:00" },
  ];
  return (
    <div>
      <div className="flex flex-row justify-between my-5">
        <h1 className="font-bold text-[24px]">Project Spaces</h1>
        <button className="border border-ci-modal-grey px-6 py-1 bg-ci-modal-black rounded-md font-bold">
          New Project Space
        </button>
      </div>
      <div className="bg-ci-modal-black text-white rounded-lg w-full border border-ci-modal-grey">
        <div className="divide-y divide-ci-modal-grey">
          {projectSpaces.map((space, index) => (
            <div
              key={index}
              className="flex items-center p-4 transition cursor-pointer"
            >
              <Image
                src={"/space-icon.svg"}
                alt="space-icon"
                width={24}
                height={24}
                className="mr-3"
              />
              <div className="grid grid-cols-2 w-full">
                <div className="font-medium">{space.name}</div>
                <div className="text-ci-modal-grey flex justify-end">
                  {space.date + ", " + space.time}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
