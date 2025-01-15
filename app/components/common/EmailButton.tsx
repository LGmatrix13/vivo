import { Mail } from "./Icons";

interface EmailButtonProps {
  email: string;
  children: React.ReactNode;
}

export function EmailButton(props: EmailButtonProps) {
  const { email, children } = props;
  return (
    <a
      href={`mailto:${email}`}
      className="flex items-center space-x-2 w-fit py-2 px-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition ease-in-out"
    >
      <Mail />
      <span>{children}</span>
    </a>
  );
}
