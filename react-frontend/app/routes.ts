import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/index.tsx"),
  route("welcome", "routes/welcome.tsx"),
  route("auth/login", "routes/auth/login.tsx"),
  route("auth/register", "routes/auth/register.tsx"),
  route("home", "routes/home.tsx"),
  route("physics", "routes/subjects/physics.tsx"),
  //route("chemistry", "routes/subjects/chemistry.ts"),
  //route("higher-math", "routes/subjects/higher_math.ts"),
  //route("biology", "routes/subjects/biology.ts"),
] satisfies RouteConfig;
