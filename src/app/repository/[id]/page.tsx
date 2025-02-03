import Image from "next/image";

export default function Repository() {
  const folders = [
    { name: "Folder 1", date: "31 Feb 2099", time: "14:30", msg: "Commit 1", type: "folder" },
    { name: "Folder 2", date: "31 Feb 2099", time: "10:00", msg: "Commit 1", type: "folder" },
  ];
  const files = [
    { name: "File 1", date: "31 Feb 2099", time: "14:30", msg: "Commit 1", type: "file" },
    { name: "File 2", date: "31 Feb 2099", time: "10:00", msg: "Commit 1", type: "file" },
  ];
  const itemArr = folders.concat(files);
  return (
    <div>
      <div className="flex flex-row my-5">
        <h1 className="font-bold text-[24px]">Repositories</h1>
        <select className="border border-ci-modal-grey px-6 py-1 bg-ci-modal-black rounded-md font-bold">
          Select Branch
        </select>
        <button className="border border-ci-modal-grey px-6 py-1 bg-ci-modal-black rounded-md font-bold">
          Merge
        </button>
      </div>
      <div className="bg-ci-modal-black text-white rounded-lg w-full border border-ci-modal-grey">
        <div className="divide-y divide-ci-modal-grey">
          {itemArr.map((item, index) => (
            <div
              key={index}
              className="flex items-center p-4 transition cursor-pointer"
            >
              <Image
                src={`/${item.type}-icon.svg`}
                alt={`${item.type}-icon`}
                width={24}
                height={24}
                className="mr-3"
              />
              <div className="grid grid-cols-3 w-full">
                <div className="font-medium">{item.name}</div>
                <div className="text-ci-modal-grey flex justify-center">{item.msg}</div>
                <div className="text-ci-modal-grey flex justify-end">
                  {item.date + ", " + item.time}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
