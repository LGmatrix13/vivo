import { Mail } from "./Icons";

interface EmailButtonProps {
  email: string;
}

/**
 * button to open an email draft with the user's email client
 */
export function EmailButton(props: EmailButtonProps) {
  const { email } = props;
  return (
    <a
      href={`mailto:${email}`}
      className="flex items-center space-x-2 w-fit py-2 px-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition ease-in-out"
    >
      <Mail />
    </a>
  );
}
