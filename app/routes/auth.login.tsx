import { LoginLogo, Office } from "~/components/common/Icons";
import IconButton from "~/components/common/IconButton";
import { ActionFunctionArgs } from "@remix-run/node";
import { auth } from "~/utilties/auth.server";
import { msalConfig } from "~/utilties/msal";
import { PublicClientApplication } from "@azure/msal-browser";
import { useEffect } from "react";
import { useNavigate } from "@remix-run/react";

export async function loader({ request }: ActionFunctionArgs) {
  await auth.rejectAuthorized(request);
  return null;
}

// Create a single instance of PublicClientApplication
const pca = new PublicClientApplication(msalConfig);

export default function LoginPage() {
  const navigate = useNavigate();
  useEffect(() => {
    pca.initialize().then(() => {
      pca.handleRedirectPromise().catch((error) => {
        console.error("Error handling redirect:", error);
      });
    });
  }, []);

  async function login() {
    try {
      const accounts = pca.getAllAccounts();
      if (accounts.length > 0) {
        navigate("/response-oidc");
      }

      await pca.loginRedirect({
        scopes: ["User.Read"],
        redirectUri: "http://localhost:5173/response-oidc",
      });
    } catch (error) {
      console.error("Login error:", error);
    }
  }

  return (
    <main className="flex flex-row divide-x">
      <div className="flex items-center justify-center w-1/2 h-screen">
        <div className="flex flex-col space-y-5 w-96">
          <LoginLogo />
          <div className="space-y-3 flex flex-col">
            <span className="text-lg">
              "How very good and pleasant it is when kindred live together in
              unity"
            </span>
            <span>Psalms 133:1</span>
          </div>
        </div>
      </div>
      <div className="w-1/2 h-screen flex flex-col items-center justify-center space-y-5">
        <IconButton
          onClick={() => login()}
          Icon={Office}
          options={{
            type: "submit",
          }}
        >
          Login with Microsoft
        </IconButton>
      </div>
    </main>
  );
}
