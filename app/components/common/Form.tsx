import { Form as RemixForm } from "@remix-run/react";

interface FormProps {
    action: string;
    children: React.ReactNode[]
}

export default function Form(props: FormProps) {
    const { action, children } = props;

    return (
        <RemixForm action={action} className="space-y-5 mb-10">
            {children}
            <button className="bg-blue-700 p-3 rounded-lg text-white w-full">Save</button>
        </RemixForm>
    )
}