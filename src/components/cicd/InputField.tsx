export default function InputField({
  label,
  placeholder,
}: {
  label: string;
  placeholder: string;
}) {
  return (
    <div className="flex flex-col gap-y-6">
      <label className="text-base font-semi-bold">{label}</label>
      <input
        className="px-4 py-2 bg-ci-modal-black hover:bg-ci-modal border border-ci-modal-grey rounded-lg text-base placeholder:text-sm"
        type="text"
        placeholder={placeholder}
      />
    </div>
  );
}
