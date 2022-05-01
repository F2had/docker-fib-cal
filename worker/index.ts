import { connect } from "https://deno.land/x/redis@v0.25.5/mod.ts";

const redisHost = Deno.env.get("REDIS_HOST");
const redisPort = Deno.env.get("REDIS_PORT");

const redis = await connect({
  hostname: redisHost || "localhost",
  port: redisPort,
  maxRetryCount: 20,
  retryInterval: 1000,
});

const redisSub = await redis.subscribe();

const fibonacci = (n: number): number => {
  if (n <= 1) return n;

  return fibonacci(n - 1) + fibonacci(n - 2);
};

const fibonacciWorker = async (n: number): Promise<number> => {
  const key = `fibonacci:${n}`;
  const result = await redis.get(key);

  if (result) {
    return Number(result);
  }

  const value = fibonacci(n);

  await redis.set(key, value);

  return value;
};

(async () => {
  for await (const { channel, message } of redisSub.receive()) {
    const n = parseInt(message);
    fibonacciWorker(n);
  }
})();

redisSub.subscribe("insert");
console.log("Worker started");
