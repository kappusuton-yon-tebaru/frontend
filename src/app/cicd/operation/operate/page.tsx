"use client";
import CustomToast from "@/components/cicd/CustomToast";
import InputField from "@/components/cicd/InputField";
import Selector, { SelectorOption } from "@/components/cicd/Selector";
import { getData, postData } from "@/services/baseRequest";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import toast from "react-hot-toast";
import ClipLoader from "react-spinners/ClipLoader";

export interface BuildPayload {
  project_id: string;
  services: ServiceInfo[];
}
export interface ServiceInfo {
  service_name: string;
  tag: string;
}

const operationOptions: SelectorOption[] = [
  { id: "build", label: "Build Image", type: "BUILD", data: { url: "/build" } },
  { id: "deploy", label: "Deploy", type: "DEPLOY", data: { url: "/deploy" } },
  {
    id: "both",
    label: "Build & Deploy",
    type: "BOTH",
    data: { url: "/both" },
  },
];

function OperationPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const organizationId = "678fcf897c67bca50cfae34e";

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [projectSpaceOptions, setProjectSpaceOptions] = useState<
    SelectorOption[]
  >([]);
  const [projectOptions, setProjectOptions] = useState<SelectorOption[]>([]);
  const [serviceOptions, setServiceOptions] = useState<SelectorOption[]>([]);

  const [selectedOperation, setSelectedOperation] = useState(
    operationOptions[0]
  );
  const [selectedProjectSpace, setSelectedProjectSpace] = useState<
    SelectorOption | undefined
  >();
  const [selectedProject, setSelectedProject] = useState<
    SelectorOption | undefined
  >();
  const [selectedServices, setSelectedServices] = useState<SelectorOption[]>(
    []
  );
  const [projectRepo, setProjectRepo] = useState<string>();

  const endpoints = {
    projectSpace: `${baseUrl}/resources/children/${organizationId}`,
    project: `${baseUrl}/resources/children/${selectedProjectSpace?.id}`,
    registry: `${baseUrl}/regproviders`,
    service: `${baseUrl}/project/${selectedProject?.id}/services `,
  };

  const canSubmitData = () => {
    return (
      !selectedProjectSpace || !selectedProject || selectedServices.length === 0
    );
  };

  const handleChange = (id: string, value: string) => {
    setSelectedServices((prev) => {
      return prev.map((service) =>
        service.id === id
          ? { ...service, data: { ...service.data, tag_version: value } }
          : service
      );
    });
  };

  const handleSubmit = async () => {
    try {
      const services = selectedServices.map(
        ({ data: { service_name, dockerfile, tag_version } }) => ({
          service_name: service_name,
          tag: `${service_name}-${tag_version}`,
        })
      );
      const buildPayload: BuildPayload = {
        project_id: selectedProject?.data.id,
        services: services,
      };
      console.log(buildPayload);
      const operation = await postData(
        baseUrl + selectedOperation.data.url,
        buildPayload
      );
      router.push(`/operation/jobs/${operation.parent_id}`);
    } catch (error) {
      toast.error(`Create operation failed.\n${error}`);
    }
  };

  useEffect(() => {
    const type = searchParams.get("ops");
    const matchedOperation = operationOptions.find(
      (option) => option.type === type
    );
    if (matchedOperation) setSelectedOperation(matchedOperation);
  }, [searchParams]);

  useEffect(() => {
    const fetchProjectSpaces = async () => {
      try {
        const data = await getData(endpoints.projectSpace);
        setProjectSpaceOptions(
          data.data.map((item: { resource_name: string; id: string }) => ({
            label: item.resource_name,
            id: item.id,
            data: item,
          }))
        );
      } catch (error) {
        setError(error instanceof Error ? error.message : "Unknown error");
      }
    };

    fetchProjectSpaces();
    setLoading(false);
  }, [endpoints.projectSpace]);

  useEffect(() => {
    if (!selectedProjectSpace) return;

    const fetchProjects = async () => {
      try {
        const data = await getData(endpoints.project);
        setProjectOptions(
          data.data.map((item: { resource_name: string; id: string }) => ({
            label: item.resource_name,
            id: item.id,
            data: item,
          }))
        );
      } catch (error) {
        setError(error instanceof Error ? error.message : "Unknown error");
      }
    };

    fetchProjects();
  }, [endpoints.project, selectedProjectSpace]);

  useEffect(() => {
    if (!selectedProject) return;
    const fetchServices = async () => {
      try {
        const data = await getData(
          endpoints.service,
          process.env.NEXT_PUBLIC_GITHUB_TOKEN //wait for auth
        );
        setServiceOptions(
          data.data.map(
            (item: { service_name: string; dockerfile: string }) => ({
              label: item.service_name,
              id: item.service_name,
              data: { ...item, tag_version: "latest" },
            })
          )
        );
        setProjectRepo(data.repo_url);
      } catch (error) {
        setError(error instanceof Error ? error.message : "Unknown error");
      }
    };

    fetchServices();
  }, [endpoints.service, selectedProject]);

  if (loading) {
    return (
      <div className="min-h-screen bg-ci-bg-dark-blue px-16 py-4 flex justify-center items-center">
        <CustomToast />
        <ClipLoader
          size={100}
          color={"#245FA1"}
          cssOverride={{
            borderWidth: "10px",
          }}
          loading={loading}
        />
      </div>
    );
  }

  return (
<<<<<<< HEAD:src/app/cicd/operation/operate/page.tsx
    <div className="min-h-screen bg-ci-bg-dark-blue px-16 py-8">
=======
    <div className="min-h-screen bg-ci-bg-dark-blue px-16 py-20">
>>>>>>> origin/fix/change-design-and-misc:src/app/(cicd)/operation/operate/page.tsx
      <div className="flex flex-col gap-y-8">
        <div className="flex flex-col gap-y-4">
          <h2 className="text-2xl font-bold">Build and Deploy</h2>
          <div className="text-lg text-ci-modal-grey">
            You can select the operation, project space, project, service(s)
            that you want to perform in this page
          </div>
          <hr className="border-t border-gray-300 col-span-6" />
        </div>
        <div className="grid grid-cols-6 gap-x-12 gap-y-10">
          {[
            {
              label: "Operation",
              options: operationOptions,
              state: setSelectedOperation,
              initial: selectedOperation,
            },
            {
              label: "Select Project Space",
              options: projectSpaceOptions,
              state: setSelectedProjectSpace,
              initial: null,
            },
            {
              label: "Select Project",
              options: projectOptions,
              state: setSelectedProject,
              initial: null,
            },
          ].map(({ label, options, state, initial }) => (
            <div key={label} className="col-span-2 flex flex-col gap-y-6">
              <label className="text-base font-semibold">{label}</label>
              <Selector
                options={options}
                initialOption={initial}
                onSelect={state}
              />
            </div>
          ))}

          <div className="col-span-6 flex flex-col gap-y-6">
            <label className="text-base font-semibold">Select Service</label>
            <Selector
              options={serviceOptions}
              initialOption={null}
              onSelect={setSelectedServices}
              isMultiSelect
            />
          </div>

          {selectedOperation.type === "BUILD" && (
            <>
              {selectedServices.length > 0 && (
                <>
                  <hr className="border-t border-gray-300 col-span-6" />
                  <h2 className="text-xl font-bold col-span-6">
                    Image Tag Setting
                  </h2>
                  {selectedServices.map((item: SelectorOption, index) => (
                    <div key={index} className="col-span-2 col-start-1">
                      <InputField
                        label={item.label}
                        placeholder="Image version"
                        value={item.data.tag_version}
                        onChange={(value) => handleChange(item.id, value)}
                      />
                    </div>
                  ))}
                </>
              )}
            </>
          )}
          <div className="col-span-4"></div>
          <div className="col-start-6">
            <button
              className={`bg-ci-modal-black hover:bg-ci-modal-blue border border-ci-modal-grey py-2 rounded-lg text-base w-full ${
                canSubmitData() ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={canSubmitData()}
              onClick={() => handleSubmit()}
            >
              Proceed
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OperationPage />
    </Suspense>
  );
}
