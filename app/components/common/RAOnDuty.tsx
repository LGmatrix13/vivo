import { EmailButton } from "./EmailButton";
import { PhoneButton } from "./PhoneButton";
import { IRAOnDuty } from "~/models/shifts";

interface RAOnDutyProps {
  raOnDuty: IRAOnDuty;
}

/**
 * details for an RA on duty
 */
export default function RAOnDuty(props: RAOnDutyProps) {
  const { raOnDuty } = props;
  const { name, room, email, phoneNumber } = raOnDuty;

  return (
    <div className="border border-gray-300 rounded-lg divide-y">
      <div className="p-5 space-x-5 flex items-center">
        <img
          src={`/avatars/ra/${raOnDuty.zoneId}`}
          alt={`${name}'s profile picture`}
          className="w-14 h-14 rounded-full"
        />
        <div className="space-y-3">
          <div className="flex flex-col space-y-1">
            <h2 className="font-bold">{name}</h2>
            <p>{room}</p>
          </div>
          <div className="space-x-2 flex">
            <EmailButton email={email}></EmailButton>
            {phoneNumber && (
              <PhoneButton phoneNumber={phoneNumber}>
                {phoneNumber.substring(0, 3)}-{phoneNumber.substring(3, 6)}-
                {phoneNumber.substring(6)}
              </PhoneButton>
            )}
          </div>
        </div>
      </div>
      <div className="px-5 py-3 text-sm">On duty till 11:59 PM</div>
    </div>
  );
}
