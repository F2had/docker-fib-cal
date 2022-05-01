import { connect } from "https://deno.land/x/redis@v0.25.5/mod.ts";

const redisHost = Deno.env.get("REDIS_HOST");
const redisPort = Deno.env.get("REDIS_PORT");


const redis = await connect({
  hostname: redisHost || "localhost",
  port: redisPort,
});

console.log("Redis connected", redis);