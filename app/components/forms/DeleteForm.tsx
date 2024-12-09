import { Form, useActionData, useSubmit } from "@remix-run/react";
import { deleteRA } from "~/actions/people";
import WideButton from "../common/WideButton";

interface DeleteFormProps {
  id: number;
  title: string;
  prompt: string;
  toast?: string;
}

export default function DeleteForm(props: DeleteFormProps) {
  const { id, title, prompt, toast: toastMessage } = props;
  const submit = useSubmit();
  const data = useActionData<typeof deleteRA>();

  if (data) {
    return (
      <div className="space-y-5">
        <h2 className="font-bold text-xl">{title}</h2>
        <p>{data.error}</p>
      </div>
    );
  }

  return (
    <Form
      method="post"
      encType="multipart/form-data"
      className="space-y-5"
      onSubmit={(event) => {
        submit(event.currentTarget);
      }}
    >
      <h2 className="font-bold text-xl">{title}</h2>
      <p>{prompt}</p>
      <input type="hidden" name="id" value={id} />
      <WideButton
        options={{
          type: "submit",
          name: "intent",
          value: "delete",
        }}
      >
        Confirm
      </WideButton>
    </Form>
  );
}
