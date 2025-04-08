import { Form as RemixForm, useNavigation, useSubmit } from "@remix-run/react";
import WideButton from "./WideButton";
import { useDrawerContext } from "./Drawer";
import React from "react";

interface FormProps {
  intent: string;
  children: React.ReactNode;
  button: string;
  encType?:
    | "application/x-www-form-urlencoded"
    | "multipart/form-data"
    | "text/plain";
  action?: string;
}

/**
 * generic form component for uploading and user input
 */
export default function Form(props: FormProps) {
  const { children, button, encType, intent, action } = props;
  const navigation = useNavigation();
  const submit = useSubmit();
  const [, setOpen] = useDrawerContext();
  return (
    <RemixForm
      method="post"
      onSubmit={(event) => {
        setOpen(false);
        submit(event.currentTarget);
      }}
      encType={encType}
      className="space-y-5 flex flex-col"
      action={action}
    >
      {children}
      <WideButton
        options={{
          type: "submit",
          name: "intent",
          value: intent,
        }}
        disabled={navigation.state === "submitting"}
      >
        {button}
      </WideButton>
    </RemixForm>
  );
}
