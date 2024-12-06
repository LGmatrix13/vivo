import { createCookie } from "@remix-run/node";
import { SignJWT, jwtVerify } from "jose";
import { Role } from "~/models/role";
import { IUser } from "~/models/user";

const SECRET_KEY = new TextEncoder().encode(process.env.AUTHENTICATION_SECRET);
const ISSUER = "vivo.gcc.edu";

const cookie = createCookie("jwt", {
  secrets: [process.env.COOKIE_SECRET as string],
});

async function signJWT(user: IUser) {
  const signedJwt = await new SignJWT({ ...user })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setIssuer(ISSUER)
    .setAudience(user.role)
    .setExpirationTime("1 day")
    .sign(SECRET_KEY);
  return signedJwt;
}

async function decodeJWT(jwt: string, role: Role) {
  try {
    const { payload } = await jwtVerify(jwt, SECRET_KEY, {
      issuer: ISSUER,
      audience: role,
    });
    return payload as unknown as IUser;
  } catch (cause) {
    console.log((cause as Error).message);
    return null;
  }
}

export const auth = {
  signJWT,
  decodeJWT,
  cookie,
};
