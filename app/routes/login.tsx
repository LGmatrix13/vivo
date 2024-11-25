import { LoginLogo, Office } from "~/components/Icons";
import "@fontsource-variable/golos-text";
import Button from "~/components/Button";
import IconButton from "~/components/IconButton";

export default function LoginPage() {
  return (
    <main className="flex flex-row divide-x">
      <div className="flex items-center justify-center w-1/2 h-screen">
        <div className="flex flex-col space-y-5">
          <LoginLogo />
          <span>Live, Laugh, Love, Vivo</span>
        </div>
      </div>
      <div className="w-1/2 h-screen flex items-center justify-center">
        <IconButton Icon={Office}>Login with Microsoft</IconButton>
      </div>
    </main>
  );
}
