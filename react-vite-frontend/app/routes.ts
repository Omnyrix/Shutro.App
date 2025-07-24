import { type RouteConfig, index, route } from "@react-router/dev/routes";


export default [
  index("routes/index.tsx"),
  route("auth/login", "routes/auth/login.tsx"),
  route("auth/register", "routes/auth/register.tsx"),
  route("auth/verify", "routes/auth/verify.tsx"),
  route("home", "routes/home.tsx"),
  route("physics", "routes/subjects/physics.tsx"),
  route("physics/1st-paper", "routes/subjects/papers/physics_1st/1st-paper-chapter-selection-page.tsx"),
  route("physics/1st-paper/ch-1", "routes/subjects/papers/physics_1st/ch-1.tsx"),
  route("physics/1st-paper/ch-2", "routes/subjects/papers/physics_1st/ch-2.tsx"),
  route("physics/1st-paper/ch-3", "routes/subjects/papers/physics_1st/ch-3.tsx"), 
  route("physics/1st-paper/ch-4", "routes/subjects/papers/physics_1st/ch-4.tsx"),
  route("physics/1st-paper/ch-5", "routes/subjects/papers/physics_1st/ch-5.tsx"),
  route("physics/1st-paper/ch-6", "routes/subjects/papers/physics_1st/ch-6.tsx"),
  route("physics/1st-paper/ch-7", "routes/subjects/papers/physics_1st/ch-7.tsx"),
  route("physics/1st-paper/ch-8", "routes/subjects/papers/physics_1st/ch-8.tsx"),
  route("physics/1st-paper/ch-9", "routes/subjects/papers/physics_1st/ch-9.tsx"),
  route("physics/1st-paper/ch-10", "routes/subjects/papers/physics_1st/ch-10.tsx"),
  route("chemistry", "routes/subjects/chemistry.tsx"),
  route("highermath", "routes/subjects/higher_math.tsx"),
  route("biology", "routes/subjects/biology.tsx"),
  route("profile", "routes/profile.tsx"),
  route("*", "routes/404.tsx"),
] satisfies RouteConfig;
