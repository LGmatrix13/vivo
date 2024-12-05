import Form from "../common/Form";

export default function UploadForm() {
  return (
    <Form button="Continue" encType="application/x-www-form-urlencoded">
      <h2 className="font-bold text-xl">Upload</h2>
      <label htmlFor="file" className="sr-only">
        Choose File
      </label>
      <input
        type="file"
        name="file"
        className="w-full file:border-0 file:bg-gray-50 file:text-black border rounded-lg border-input mr-5 file:cursor-pointer file:px-3 file:py-2 file:me-3"
      />
    </Form>
  );
}
