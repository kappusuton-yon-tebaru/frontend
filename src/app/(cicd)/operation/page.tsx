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

export default function AddImageRegistryPage() {
  const searchParams = useSearchParams();

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedOperation, setSelectedOperation] = useState<SelectorOption>(
    operationOptions[0]
  );
  const [projectOptions, setProjectOption] = useState<SelectorOption[]>([]);

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
        const response = await fetch(projectSearchUrl);
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        const selectorOptions: SelectorOption[] = data.map(
          (item: { resource_name: any; id: any }) => ({
            label: item.resource_name,
            id: item.id,
          })
        );
        setProjectOption(selectorOptions);
      } catch (error: any) {
        setError(error.message);
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
              onSelect={setSelectedOperation}
            />
          </div>
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
