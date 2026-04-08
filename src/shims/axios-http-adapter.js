/**
 * Stub for axios's Node-only `http` adapter on Metro web.
 * Without this, Metro bundles `axios/lib/adapters/http.js`, which pulls Node builtins
 * and throws (e.g. TypeError: Cannot read properties of undefined (reading 'prototype')).
 * Axios skips falsy adapters and uses `xhr` / `fetch` on web.
 */
export default false;
