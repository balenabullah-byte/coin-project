import axios from "axios";
import { afterEach, beforeEach, describe, test, expect, vi } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useCoinsStore } from "@/stores/coinStore";

vi.mock("axios", () => ({
  default: { request: vi.fn() },
}));

beforeEach(() => {
  // Start each test with a clean store and request mock.
  localStorage.clear();
  setActivePinia(createPinia());
  axios.request.mockReset();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("favorites", () => {
  test("toggleFavorite adds a coin id, then removes it", () => {
    const store = useCoinsStore();

    store.toggleFavorite("bitcoin");
    expect(store.favorites).toEqual(["bitcoin"]);

    store.toggleFavorite("bitcoin");
    expect(store.favorites).toEqual([]);
  });
  test("toggleFavorite ignores an object", () => {
    const store = useCoinsStore();

    store.toggleFavorite({ id: "bitcoin" });

    expect(store.favorites).toEqual([]);
  });
});

describe("compare", () => {
  test("toggleCompare adds a selected coin id, then removes it", () => {
    const store = useCoinsStore();

    store.toggleCompare("bitcoin");
    expect(store.selectedIds).toEqual(["bitcoin"]);

    store.toggleCompare("bitcoin");
    expect(store.selectedIds).toEqual([]);
  });
  test("toggleCompare ignores an object", () => {
    const store = useCoinsStore();
    store.toggleCompare({ id: "bitcoin" });
    expect(store.selectedIds).toEqual([]);
  });

  test("canCompare requires at least two selected coins", () => {
    const store = useCoinsStore();

    expect(store.canCompare).toBe(false);

    store.toggleCompare("bitcoin");
    expect(store.canCompare).toBe(false);

    store.toggleCompare("ethereum");
    expect(store.canCompare).toBe(true);

    store.toggleCompare("litecoin");
    expect(store.canCompare).toBe(true);
  });
  test("compareCoins returns selected coins by id", () => {
    const store = useCoinsStore();
    const bitcoin = { id: "bitcoin", name: "Bitcoin" };
    const ethereum = { id: "ethereum", name: "Ethereum" };
    const litecoin = { id: "litecoin", name: "Litecoin" };

    store.coins = [bitcoin, ethereum, litecoin];
    store.toggleCompare("litecoin");
    store.toggleCompare("bitcoin");

    expect(store.compareCoins).toEqual([bitcoin, litecoin]);
  });
});

describe("fetchCoins", () => {
  test("fetchCoins fills coins from the successful response", async () => {
    const store = useCoinsStore();
    const apiCoin = {
      id: "bitcoin",
      name: "Bitcoin",
      image: "bitcoin.png",
      price_change_percentage_24h: 1.5,
      current_price: 50000,
      market_cap: 1000000,
      high_24h: 51000,
      low_24h: 49000,
      ath: 69000,
      market_cap_rank: 1,
    };
    const requestMock = vi.fn().mockResolvedValue({ data: [apiCoin] });
    axios.request.mockImplementation(requestMock);

    await store.fetchCoins();

    expect(axios.request).toHaveBeenCalledOnce();
    expect(store.coins).toEqual([apiCoin]);
    expect(store.error).toBeNull();
  });

  test("fetchCoins keeps loading true while the request is pending", async () => {
    const store = useCoinsStore();
    let resolveRequest;
    const requestMock = vi.fn(
      () =>
        new Promise((resolve) => {
          resolveRequest = resolve;
        })
    );
    axios.request.mockImplementation(requestMock);

    const fetchPromise = store.fetchCoins();

    expect(store.isLoading).toBe(true);
    resolveRequest({ data: [] });
    await fetchPromise;
    expect(store.isLoading).toBe(false);
  });

  test("fetchCoins sets an error and preserves coins after a network failure", async () => {
    const store = useCoinsStore();
    const existingCoin = { id: "ethereum", name: "Ethereum" };
    store.coins = [existingCoin];
    const requestMock = vi.fn().mockRejectedValue(new Error("Network error"));
    axios.request.mockImplementation(requestMock);
    vi.spyOn(console, "error").mockImplementation(() => {});

    await expect(store.fetchCoins()).resolves.toBeUndefined();
    expect(store.error).toBe("Failed to load coins. Please try again.");

    expect(store.coins).toEqual([existingCoin]);
    expect(store.isLoading).toBe(false);
  });
  test("fetchCoins handles a bad response and preserves coins", async () => {
    const store = useCoinsStore();
    const existingCoin = { id: "ethereum", name: "Ethereum" };
    store.coins = [existingCoin];
    const badResponseError = new Error("Request failed with status code 500");
    badResponseError.response = { status: 500, data: {} };
    const requestMock = vi.fn().mockRejectedValue(badResponseError);
    axios.request.mockImplementation(requestMock);
    vi.spyOn(console, "error").mockImplementation(() => {});

    await expect(store.fetchCoins()).resolves.toBeUndefined();

    expect(store.error).toBe("Failed to load coins. Please try again.");
    expect(store.coins).toEqual([existingCoin]);
    expect(store.isLoading).toBe(false);
  });


  test("fetchCoins clears the old error after a successful retry", async () => {
  const store = useCoinsStore()
  vi.spyOn(console, "error").mockImplementation(() => {})

  axios.request.mockRejectedValueOnce(new Error("Network error"))
  await store.fetchCoins()
  expect(store.error).not.toBeNull()

  axios.request.mockResolvedValueOnce({ data: [] })
  await store.fetchCoins()
  expect(store.error).toBeNull()
})
});
