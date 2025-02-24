"use client";

import Image from "next/image";
import { useRouter, useParams } from "next/navigation";

export default function ProjectSpace() {
  const router = useRouter();
  const { projSpaceId } = useParams();
  // const [repositories, setRepositories] = useState<Resource[]>([]);


  // const getRepositories = async () => {
  //   const response = await getData(
  //     `${process.env.NEXT_PUBLIC_BACKEND_URL}/resources/children/${projSpaceId}`
  //   );
  // };

  const repositories = [
    {
      name: "Repository 1",
      date: "31 Feb 2099",
      time: "14:30",
      msg: "Commit 1",
    },
    {
      name: "Repository 2",
      date: "31 Feb 2099",
      time: "10:00",
      msg: "Commit 1",
    },
  ];
  return (
    <div>
      <div className="flex flex-row justify-between">
        <h1 className="font-bold text-[24px]">Repositories</h1>
        <button
          className="border border-ci-modal-grey px-6 py-1 bg-ci-modal-black rounded-md font-bold hover:bg-ci-modal-blue"
          onClick={() => router.push(`${projSpaceId}/new-repository`)}
        >
          New Repository
        </button>
      </div>
      <div className="bg-ci-modal-black text-white rounded-lg w-full border border-ci-modal-grey mt-4">
        <div className="divide-y divide-ci-modal-grey">
          {repositories.map((repo, index) => (
            <div
              key={index}
              className="flex items-center p-4 transition cursor-pointer"
            >
              <Image
                src={"/repo-icon.svg"}
                alt="repo-icon"
                width={24}
                height={24}
                className="mr-3"
              />
              <div className="grid grid-cols-3 w-full">
                <div className="font-medium">{repo.name}</div>
                <div className="text-ci-modal-grey flex justify-center">
                  {repo.msg}
                </div>
                <div className="text-ci-modal-grey flex justify-end">
                  {repo.date + ", " + repo.time}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
