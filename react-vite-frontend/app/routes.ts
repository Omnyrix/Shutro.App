import { type RouteConfig, index, route } from "@react-router/dev/routes";


export default [
  index("routes/index.tsx"),
  route("auth/login", "routes/auth/login.tsx"),
  route("auth/register", "routes/auth/register.tsx"),
  route("auth/verify", "routes/auth/verify.tsx"),
  route("home", "routes/home.tsx"),
  route("physics", "routes/subjects/physics.tsx"),
  route("physics/1st-paper", "routes/subjects/papers/physics_1st/1st-paper-chapter-selection-page.tsx"),
  route("chemistry", "routes/subjects/chemistry.tsx"),
  route("highermath", "routes/subjects/higher_math.tsx"),
  route("biology", "routes/subjects/biology.tsx"),
  route("profile", "routes/profile.tsx"),
  route("*", "routes/404.tsx"),
] satisfies RouteConfig;
