import { VotingStatusCache } from "../votingCache";

describe("VotingStatusCache", () => {
  let cache: VotingStatusCache;

  beforeEach(() => {
    cache = new VotingStatusCache(1000); // 1 second TTL for testing
  });

  afterEach(() => {
    cache.clear();
  });

  test("should store and retrieve data", () => {
    const testData = { test: "data" };
    cache.set("test-key", testData);

    const retrieved = cache.get("test-key");
    expect(retrieved).toEqual(testData);
  });

  test("should return null for non-existent keys", () => {
    const retrieved = cache.get("non-existent");
    expect(retrieved).toBeNull();
  });

  test("should expire data after TTL", async () => {
    const testData = { test: "data" };
    cache.set("test-key", testData);

    // Wait for expiration
    await new Promise((resolve) => setTimeout(resolve, 1100));

    const retrieved = cache.get("test-key");
    expect(retrieved).toBeNull();
  });

  test("should clear all data", () => {
    cache.set("key1", "data1");
    cache.set("key2", "data2");

    expect(cache.size()).toBe(2);

    cache.clear();
    expect(cache.size()).toBe(0);
  });

  test("should invalidate specific keys", () => {
    cache.set("key1", "data1");
    cache.set("key2", "data2");

    cache.invalidate("key1");

    expect(cache.get("key1")).toBeNull();
    expect(cache.get("key2")).toBe("data2");
  });

  test("should return correct size", () => {
    expect(cache.size()).toBe(0);

    cache.set("key1", "data1");
    expect(cache.size()).toBe(1);

    cache.set("key2", "data2");
    expect(cache.size()).toBe(2);
  });
});
