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
}

export default function Form(props: FormProps) {
  const { children, button, encType, intent } = props;
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
    >
      {children}
      <WideButton
        options={{
          type: "submit",
          name: "intent",
          value: intent,
          disabled: navigation.state === "submitting",
        }}
      >
        {button}
      </WideButton>
    </RemixForm>
  );
}
