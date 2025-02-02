import BranchButton from "@/components/codeeditor/BranchButton";

export default function RepositoryPage() {
  const branches = ["main", "branch 1", "branch 2"];
  return (
    <>
      <div className="bg-ci-bg-dark-blue w-screen flex flex-col px-16 py-16">
        <div className="flex flex-row gap-8">
          <div className="text-ci-modal-white font-bold text-2xl">
            Repository 1
          </div>
          <BranchButton branches={branches} />
        </div>
      </div>
    </>
  );
}
