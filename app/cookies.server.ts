import { createCookie } from "react-router";

/**
 * Cookie to persist home page search/filter state across visits.
 * maxAge of 30 days keeps it alive across browser restarts.
 */
export const searchStateCookie = createCookie("home-search", {
    maxAge: 60 * 60 * 24 * 30, // 30 days
    sameSite: "lax",
    path: "/",
});
