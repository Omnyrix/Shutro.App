import type { LoaderFunctionArgs } from "@remix-run/router";
import { redirect } from "react-router";
import Home from "../home/home";

// Helper to get cookie from request header
function getSessionFromRequest(request: Request) {
  const cookie = request.headers.get("cookie");
  if (!cookie) return null;
  const match = cookie.match(/session=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

export async function loader({ request }: LoaderFunctionArgs) {
  if (!getSessionFromRequest(request)) {
    throw redirect("/welcome");
  }
  return null;
}

export default Home;