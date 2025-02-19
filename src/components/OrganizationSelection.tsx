import { useRouter } from "next/navigation";

export default function OrganizationSelection({
  organization,
  setSelectedOrganization,
  onClose,
}: {
  organization: string[];
  setSelectedOrganization: (org: string) => void;
  onClose: () => void;
}) {
  const router = useRouter();
  let orgId = "1";

  return (
    <div className="absolute w-full bg-ci-bg-dark-blue border border-ci-modal-white mt-2 rounded-md shadow-lg z-10">
      <div className="max-h-60 overflow-y-auto">
        {organization.map((org, index) => (
          <div
            key={org}
            className={`flex justify-between items-center px-3 py-2 cursor-pointer hover:bg-ci-modal-blue text-ci-modal-white ${
              index === 0 ? "rounded-t-md" : ""
            }`}
            onClick={() => {
              setSelectedOrganization(org);
              onClose();
            }}
          >
            <span className="text-sm">{org}</span>
          </div>
        ))}
        <hr className="border-ci-modal-white opacity-50 my-2" />

        <div
          key="Manage Organization"
          className="flex justify-between items-center px-3 py-2 cursor-pointer hover:bg-ci-modal-blue text-ci-modal-white"
          onClick={() => {
            router.push(`/organization/manage/${orgId}`);
            onClose();
          }}
        >
          <span className="text-sm">Manage Organization</span>
        </div>
        <div
          key="New Organization"
          className="flex justify-between items-center px-3 py-2 cursor-pointer hover:bg-ci-modal-blue text-ci-modal-white rounded-b-md"
          onClick={() => {
            router.push("/organization/create");
            onClose();
          }}
        >
          <span className="text-sm">New Organization</span>
        </div>
      </div>
    </div>
  );
}
