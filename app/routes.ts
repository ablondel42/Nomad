import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
    layout("routes/applicant-layout.tsx", [
        index("routes/home.tsx"),
        route("dashboard", "routes/dashboard.tsx"),
        route("jobs/:id", "routes/job-details.tsx"),
        route("jobs/:id/apply", "routes/job-apply.tsx"),
        route("login", "routes/login.tsx"),
        route("signup", "routes/signup.tsx"),
    ])
] satisfies RouteConfig;
