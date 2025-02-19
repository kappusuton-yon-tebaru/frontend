import { Dispatch, SetStateAction } from "react";

export default function InputField({
  label,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  placeholder: string;
  value: any;
  onChange: Dispatch<SetStateAction<any>>;
}) {
  return (
    <div className="flex flex-col gap-y-6">
      <label className="text-base font-semibold">{label}</label>
      <input
        className="px-4 py-2 bg-ci-modal-black hover:bg-ci-modal border border-ci-modal-grey rounded-lg text-base placeholder:text-sm"
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
