import { Form, useNavigation, useSubmit } from "@remix-run/react";
import WideButton from "../common/WideButton";

interface ReleaseALLRCIsFormProps {
  rciIds: number[];
  title: string;
  prompt: string;
  toast?: string;
}

export default function ReleaseAllRCIsForm(props: ReleaseALLRCIsFormProps) {
  const { rciIds, title, prompt } = props;
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
      <input type="hidden" name="ids" value={JSON.stringify(rciIds)} />
      <WideButton
        options={{
          type: "submit",
          name: "intent",
          value: "updateAll",
          disbaled: navigation.state === "submitting",
        }}
      >
        Confirm
      </WideButton>
    </Form>
  );
}
