import { Form as RemixForm, useSubmit } from "@remix-run/react";
import WideButton from "./WideButton";
import { useToastContext } from "./Toast";
import { useDrawerContext } from "./Drawer";
import React from "react";

interface FormProps {
  toast?: string;
  children: React.ReactNode;
  button: string;
  encType?:
    | "application/x-www-form-urlencoded"
    | "multipart/form-data"
    | "text/plain";
}

export default function Form(props: FormProps) {
  const { toast: toastMessage, children, button, encType } = props;
  const toast = useToastContext();
  const submit = useSubmit();
  const [, setOpen] = useDrawerContext();
  return (
    <RemixForm
      action="post"
      onSubmit={(event) => {
        setOpen(false);
        if (toastMessage) toast.success(toastMessage);
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
          value: "delete",
        }}
      >
        {button}
      </WideButton>
    </RemixForm>
  );
}
