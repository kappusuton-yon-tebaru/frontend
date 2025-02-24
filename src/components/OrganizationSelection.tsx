import { useRouter } from "next/navigation";
import { Resource } from "@/interfaces/workspace";

export default function OrganizationSelection({
  organization,
  setSelectedOrganization,
  onClose,
}: {
  organization: Resource[];
  setSelectedOrganization: (org: Resource) => void;
  onClose: () => void;
}) {
  const router = useRouter();
  // const orgId = "1";

  return (
    <div className="absolute w-full bg-ci-bg-dark-blue border border-ci-modal-white mt-2 rounded-md shadow-lg z-10">
      <div className="max-h-60 overflow-y-auto">
        {organization.map((org, index) => (
          <div
            key={org.resource_name}
            className={`flex justify-between items-center px-3 py-2 cursor-pointer hover:bg-ci-modal-blue text-ci-modal-white ${
              index === 0 ? "rounded-t-md" : ""
            }`}
            onClick={() => {
              setSelectedOrganization(org);
              router.push(`/organization/${org.id}`);
              onClose();
            }}
          >
            <span className="text-sm">{org.resource_name}</span>
          </div>
        ))}
        <hr className="border-ci-modal-white opacity-50 my-2" />
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
