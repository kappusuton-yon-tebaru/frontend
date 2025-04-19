"use client";
import InputField from "@/components/cicd/InputField";
import { useToast } from "@/context/ToastContext";
import { getData, postData } from "@/services/baseRequest";
import { useEffect, useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";

export default function MaxWorkerSettingPage() {
  const organizationId = "678fcf897c67bca50cfae34e";
  const [worker, setWorker] = useState();
  const [loading, setLoading] = useState<boolean>(true);

  const { triggerToast } = useToast();

  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const getUrl = `${baseUrl}/setting/workerpool?org=${organizationId}`;
  const updateUrl = `${baseUrl}/setting/workerpool?org=${organizationId}`;

  useEffect(() => {
    const fetchMaxWworker = async () => {
      try {
        const data = await getData(getUrl);
        setWorker(data.pool_size);
      } catch (error) {
        const errMessage =
          error instanceof Error ? error.message : "Unknown error";
        // setError(errMessage);
        triggerToast(`${errMessage}`, "error");
      } finally {
        setLoading(false);
      }
    };

    fetchMaxWworker();
  }, []);

  const handleSubmit = async () => {
    try {
      const data = {
        pool_size: Number(worker),
      };
      const post = await postData(updateUrl, data);
      triggerToast("Setting max worker success!", "success");
    } catch (error) {
      triggerToast(`Setting max worker failed.\n${error}`, "error");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-ci-bg-dark-blue px-16 py-8 flex justify-center items-center">
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
    <div className="min-h-screen bg-ci-bg-dark-blue px-16 py-8">
      <div className="flex flex-col gap-y-16">
        <h2 className="text-xl font-bold">Max Worker Pool Setting</h2>
        <div className="grid grid-cols-6 gap-x-12 gap-y-10">
          <div className="col-span-3">
            <InputField
              label="Max Worker Pool"
              placeholder="Max Worker Pool"
              value={worker}
              onChange={setWorker}
            />
          </div>
          <div className="col-span-3"></div>
          <div className="col-start-6 ">
            <button
              className="bg-ci-modal-black hover:bg-ci-modal-blue border border-ci-modal-grey py-2 rounded-lg text-base w-full"
              onClick={handleSubmit}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
