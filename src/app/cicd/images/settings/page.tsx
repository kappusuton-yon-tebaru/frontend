"use client";
import CustomToast from "@/components/cicd/CustomToast";
import InputField from "@/components/cicd/InputField";
import { getData, postData } from "@/services/baseRequest";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ClipLoader from "react-spinners/ClipLoader";

export default function ImageWorkerSettingPage() {
  const [worker, setWorker] = useState();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const getUrl = `${baseUrl}/setting/maxworker`;
  const updateUrl = `${baseUrl}/setting/maxworker`;

  useEffect(() => {
    const fetchMaxWworker = async () => {
      try {
        const data = await getData(getUrl);
        setWorker(data.max_worker);
      } catch (error) {
        const errMessage =
          error instanceof Error ? error.message : "Unknown error";
        setError(errMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchMaxWworker();
  }, []);

  const handleSubmit = async () => {
    try {
      const data = {
        max_worker: Number(worker),
      };
      const post = await postData(updateUrl, data);
      toast.success("Setting max worker success!");
    } catch (error) {
      toast.error(`Setting max worker failed.\n${error}`);
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

  if (error) {
    return (
      <div className="min-h-screen bg-ci-bg-dark-blue px-16 py-20">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ci-bg-dark-blue px-16 py-20">
      <CustomToast />
      <div className="flex flex-col gap-y-16">
        <h2 className="text-xl font-bold">Image Builder Setting</h2>
        <div className="grid grid-cols-6 gap-x-12 gap-y-10">
          <div className="col-span-3">
            <InputField
              label="Max Worker"
              placeholder="Max Worker"
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
