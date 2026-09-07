import { defineStore } from "pinia";
import axios from "axios";

export const useCoinsStore = defineStore("coins", {
  state: () => ({
    coins: [],
    isLoading: false,
    error: null,
    searchQuery: "",
  }),

  actions: {
    async fetchCoins() {
      if (this.isLoading) return;

      this.isLoading = true;
      this.error = null;

      try {
        const response = await axios.request({
          method: "GET",
          url: "https://api.coingecko.com/api/v3/coins/markets",
          params: { vs_currency: "usd" },
          headers: {
            "x-cg-demo-api-key": import.meta.env.VITE_COINGECKO_API_KEY,
          },
        });
        this.coins = response.data;
      } catch (error) {
        this.error = "Failed to load coins. Please try again.";
        console.error("Error fetching coins:", error);
      } finally {
        this.isLoading = false;
      }
    },
  },
});
