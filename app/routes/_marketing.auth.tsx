import {
  type MetaFunction,
  type ActionFunctionArgs,
  type LinksFunction,
} from "@remix-run/node";
import AuthForm from "~/components/auth/AuthForm";
import { login, signup } from "~/data/auth.server";
import { validateCredentials } from "~/data/validation.server";
import authStyles from "~/styles/auth.css";
import type { StatusError } from "~/types/interfaces";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: authStyles },
];

export const meta: MetaFunction = () => {
  return [
    { title: "Spendy | Login" },
    {
      name: "description",
      content: "Login or Sign up",
    },
  ];
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const searchParams = new URL(request.url).searchParams;
  const authMode = searchParams.get("mode") || "login";

  const credentials = Object.fromEntries(await request.formData());
  try {
    const validatedCredentials = validateCredentials(credentials);
    if (authMode === "login") {
      return await login(validatedCredentials);
    } else {
      return await signup(validatedCredentials);
    }
  } catch (error) {
    if (error instanceof Error) {
      if (
        (error as StatusError).status === 422 ||
        (error as StatusError).status === 401
      ) {
        return { credentials: error.message };
      }
    }
    return error;
  }
};

export default function Auth() {
  return (
    <main>
      <AuthForm />
    </main>
  );
}
