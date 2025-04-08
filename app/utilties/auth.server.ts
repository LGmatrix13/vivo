import { createCookie, redirect } from "@remix-run/node";
import { SignJWT, jwtVerify } from "jose";
import { Role } from "~/models/role";
import { IUser } from "~/models/user";

const SECRET_KEY = new TextEncoder().encode(process.env.AUTHENTICATION_SECRET);
const ISSUER = "vivo.gcc.edu";

const jwtCookie = createCookie("jwt", {
  secrets: [process.env.COOKIE_SECRET as string],
  maxAge: 86400, // one day
});

/**
 * for redirecting back to login
 */
async function loginRedirect() {
  return redirect("/auth/login", {
    headers: {
      "Set-Cookie": await jwtCookie.serialize(""),
    },
  });
}

/**
 * sign a jwt
 */
async function signJwt(user: IUser) {
  const signedJwt = await new SignJWT({ ...user })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setIssuer(ISSUER)
    .setAudience(user.role)
    .setExpirationTime("1 day")
    .sign(SECRET_KEY);
  return signedJwt;
}

/**
 * read a user safely (catch exceptions)
 */
async function safeReadUser(request: Request) {
  try {
    const cookieHeader = request.headers.get("Cookie");
    const jwt = await jwtCookie.parse(cookieHeader);

    if (!jwt) {
      return null;
    }

    const { payload } = await jwtVerify(jwt, SECRET_KEY, {
      issuer: ISSUER,
    });

    return payload as unknown as IUser;
  } catch (cause) {
    console.log((cause as Error).message);
    return null;
  }
}

/**
 * read whether a user is authorized safely (catch exceptions)
 */
async function safeAuthorized(request: Request, roles: Role[]) {
  const user = await safeReadUser(request);

  if (user === null) {
    return false;
  } else if (!roles.includes(user.role)) {
    return false;
  }

  return true;
}

/**
 * reject unauthroized users (redirect to login)
 */
async function rejectUnauthorized(request: Request, roles: Role[]) {
  const authorized = await safeAuthorized(request, roles);

  if (!authorized) {
    throw await loginRedirect();
  }
}

/**
 * reject based on role if attempting to visiting another
 */
function redirectRole(role: Role, headers?: HeadersInit) {
  switch (role) {
    case "admin":
    case "rd":
      return redirect("/staff/shifts/on-duty", {
        headers,
      });
    case "ra":
      return redirect("/ra/shifts/on-duty", {
        headers,
      });
    case "resident":
      return redirect("/resident/on-duty", {
        headers,
      });
  }
}

/**
 * reject authorized users (don't let authorized users see login)
 */
async function rejectAuthorized(request: Request) {
  const user = await safeReadUser(request);

  if (user) {
    throw redirectRole(user.role);
  }
}

/**
 * read user. redirect as necessary if unauthorized
 */
async function readUser(request: Request, roles: Role[]) {
  const user = await safeReadUser(request);

  if (user === null) {
    throw await loginRedirect();
  } else if (!roles.includes(user.role)) {
    throw redirectRole(user.role);
  }

  return user;
}

/**
 * read user. redirect as necessary if unauthorized
 */
async function login(user: IUser) {
  const jwt = await signJwt(user);
  return redirectRole(user.role, {
    "Set-Cookie": await auth.jwtCookie.serialize(jwt),
  });
}

export const auth = {
  jwtCookie,
  signJwt,
  safeReadUser,
  loginRedirect,
  rejectUnauthorized,
  rejectAuthorized,
  safeAuthorized,
  readUser,
  login,
};
