import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
    layout("routes/applicant-layout.tsx", [
        index("routes/home.tsx"),
        route("jobs/:id", "routes/job-details.tsx"),
        route("jobs/:id/apply", "routes/job-apply.tsx"),
    ])
] satisfies RouteConfig;
