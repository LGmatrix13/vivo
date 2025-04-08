import { Phone } from "./Icons";

interface PhoneButtonProps {
  phoneNumber: string;
  children: React.ReactNode;
}

/**
 * used to call a RA or RD on-duty
 */
export function PhoneButton(props: PhoneButtonProps) {
  const { phoneNumber, children } = props;
  return (
    <a
      href={`tel:${phoneNumber}`}
      className="flex items-center space-x-2 w-fit py-2 px-3 bg-green-600 hover:bg-green-700 rounded-lg text-white transition ease-in-out"
    >
      <Phone />
      <span>{children}</span>
    </a>
  );
}
