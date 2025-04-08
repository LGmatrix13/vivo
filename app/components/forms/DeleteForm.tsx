import { Form, useNavigation, useSubmit } from "@remix-run/react";
import WideButton from "../common/WideButton";

interface DeleteFormProps {
  id: number;
  title: string;
  prompt: string;
  toast?: string;
}

/**
 * generic delete form to delete an entity
 */
export default function DeleteForm(props: DeleteFormProps) {
  const { id, title, prompt } = props;
  const submit = useSubmit();
  const navigation = useNavigation();

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
          disbaled: navigation.state === "submitting",
        }}
      >
        Confirm
      </WideButton>
    </Form>
  );
}
