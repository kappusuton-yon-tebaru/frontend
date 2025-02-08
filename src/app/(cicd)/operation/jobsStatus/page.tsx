"use client";
import InputField from "@/components/cicd/InputField";
import Selector, { SelectorOption } from "@/components/cicd/Selector";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";

const operationOptions: SelectorOption[] = [
  { label: "Build Image", type: "BUILD" },
  { label: "Deploy", type: "DEPLOY" },
  { label: "Build & Deploy", type: "BOTH" },
];

const projectSearchUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/resources`;
const registrySearchUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/regproviders`;

export default function AddImageRegistryPage() {
  const searchParams = useSearchParams();

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [projectOptions, setProjectOptions] = useState<SelectorOption[]>([]);
  const [registryOptions, setRegistryOptions] = useState<SelectorOption[]>([]);

  const [selectedOperation, setSelectedOperation] = useState<SelectorOption>(
    operationOptions[0]
  );
  const [selectedProject, setSelectedProject] = useState<SelectorOption>(
    projectOptions[0]
  );
  const [selectedRegistry, setSelectedRegistry] = useState<SelectorOption>(
    registryOptions[0]
  );

  useEffect(() => {
    const type = searchParams.get("ops");
    console.log(type);
    if (type) {
      const matchedOperation = operationOptions.find(
        (option) => option.type === type
      );
      if (matchedOperation) {
        setSelectedOperation(matchedOperation);
      }
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectRes, registryRes] = await Promise.all([
          fetch(projectSearchUrl),
          fetch(registrySearchUrl),
        ]);

        if (!projectRes.ok || !registryRes.ok) {
          throw new Error("Failed to fetch data");
        }

        const [projectData, registryData] = await Promise.all([
          projectRes.json(),
          registryRes.json(),
        ]);

        setProjectOptions(
          projectData.map((item: { resource_name: string; id: string }) => ({
            label: item.resource_name,
            id: item.id,
          }))
        );

        setRegistryOptions(
          registryData.map((item: { name: string; id: string }) => ({
            label: item.name,
            id: item.id,
          }))
        );
      } catch (error) {
        const errMessage =
          error instanceof Error ? error.message : "Unknown error";
        setError(errMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-ci-bg-dark-blue px-16 py-20 flex justify-center items-center">
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
    <div className="min-h-screen bg-ci-bg-dark-blue px-16 py-20">
      <div className="flex flex-col gap-y-16">
        <h2 className="text-xl font-bold">Build and Deploy</h2>
        <div className="grid grid-cols-6 gap-x-12 gap-y-10">
          <div className="col-span-2 flex flex-col gap-y-6">
            <label className="text-base font-semibold">Operation</label>
            <Selector
              options={operationOptions}
              initialOption={selectedOperation || null}
              onSelect={setSelectedOperation}
            />
          </div>
          <div className="col-span-4 flex flex-col gap-y-6">
            <label className="text-base font-semibold">Select Project</label>
            <Selector
              options={projectOptions}
              initialOption={projectOptions[0]}
              onSelect={setSelectedProject}
            />
          </div>
          {selectedOperation.type === "BUILD" && (
            <>
              <div className="col-span-2 flex flex-col gap-y-6">
                <label className="text-base font-semibold">
                  Select Registry
                </label>
                <Selector
                  options={registryOptions}
                  initialOption={registryOptions[0]}
                  onSelect={setSelectedRegistry}
                />
              </div>
              <div className="col-span-4"></div>
            </>
          )}
          <div className="col-start-6 ">
            <button className="bg-ci-modal-black hover:bg-ci-modal-blue border border-ci-modal-grey py-2 rounded-lg text-base w-full">
              Proceed
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
