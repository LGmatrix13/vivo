import { IRAInfo } from "~/models/people";
import { EmailButton } from "./EmailButton";
import { PhoneButton } from "./PhoneButton";

interface RAInfoProps {
  ra: IRAInfo;
}

export default function RAInfo(props: RAInfoProps) {
  const { ra } = props;
  const { name, room, email, phoneNumber } = ra;

  return (
    <div className="border rounded-lg divide-y">
      <div className="p-5 space-x-5 flex items-center">
        <img
          src={`/avatars/ra/${ra.zoneId}`}
          alt={`${name}'s profile picture`}

          className="w-14 h-14 rounded-full"
        />
        <div className="space-y-3">
          <div className="flex flex-col space-y-1">
            <h2 className="font-bold">{name}</h2>
            <p>{room}</p>
          </div>
          <div className="space-x-2 flex">
            <EmailButton email={email ?? ""}></EmailButton>
            {phoneNumber && (
              <PhoneButton phoneNumber={phoneNumber}>{phoneNumber.substring(0, 3)}-{phoneNumber.substring(3, 6)}-{phoneNumber.substring(6)}</PhoneButton>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
