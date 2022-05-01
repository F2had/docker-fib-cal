import { Application, Router } from "https://deno.land/x/oak@v10.5.1/mod.ts";
import { oakCors } from "https://deno.land/x/cors@v1.2.2/mod.ts";
import { Client } from "https://deno.land/x/postgres@v0.15.0/mod.ts";
import { connect } from "https://deno.land/x/redis@v0.25.5/redis.ts";
import { RedisValue } from "https://deno.land/x/redis@v0.25.5/mod.ts";

const router = new Router();
const redis = await connect({
  hostname: Deno.env.get("REDIS_HOST") || "localhost",
  port: Deno.env.get("REDIS_PORT") || 6379,
  maxRetryCount: 20,
  retryInterval: 1000,
});

const client = new Client({
  user: Deno.env.get("DB") || "postgres",
  database: Deno.env.get("DB_NAMe") || "postgres",
  password: Deno.env.get("DB_PASSWORD"),
  hostname: Deno.env.get("DB_HOST"),
  port: parseInt(Deno.env.get("DB_PORT") || "5432"),
});

router.get("/values", async (ctx) => {
  const index: RedisValue = ctx.request.url.searchParams.get("index") || "0";

  if (parseInt(index) > 40) {
    ctx.response.status = 400;
    return ctx.response.body = "I am not that smart";
  }
  await redis.hset("values", index, "not yet");
  await redis.publish("insert", index);
  client.queryObject("INSERT INTO fibonacci (number) VALUES ($1)", [
    index,
  ]);
  ctx.response.body = "OK";
});

router.get("/values/all", async (ctx) => {
  const result = await client.queryObject("SELECT * FROM fibonacci");
  ctx.response.body = result.rows;
});

router.get("/values/current", async (ctx) => {
  const result = await redis.hgetall("values");
  ctx.response.body = result;
});

const app = new Application();
app.use(oakCors());
app.use(router.routes());
app.use(router.allowedMethods());

await client.connect();
await client.queryObject(
  "CREATE TABLE IF NOT EXISTS fibonacci (number INTEGER)",
);

app.listen({ port: 3000 }).then(() => {
  console.log("Server is running on http://localhost:3000");
})
  .catch((err) => {
    console.log(err);
  });
