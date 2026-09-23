import { defineStore } from "pinia";
import axios from "axios";

export const useCoinsStore = defineStore("coins", {
  state: () => ({
    coins: [],
    isLoading: false,
    error: null,
    searchQuery: "",
    selectedIds: [],
      favorites: JSON.parse(localStorage.getItem("favorites") || "[]"),

  }),
getters: {
  compareCoins(state) {
    return state.coins.filter((coin) => state.selectedIds.includes(coin.id));
  },
  canCompare(state) {
    return state.selectedIds.length >= 2;
  },
},
  actions: {
   
 toggleCompare(coinId) {
    const index = this.selectedIds.indexOf(coinId);
    if (index === -1) {
      if (this.selectedIds.length < this.coins.length) this.selectedIds.push(coinId);
    } else {
      this.selectedIds.splice(index, 1);
    }
  },

  clearCompare() {
    this.selectedIds = [];
  },
  // ...your existing fetchCoins stays as-is

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
        this.coins = response.data.map((coin) => ({
          id: coin.id,
          name: coin.name,
          image: coin.image,
          price_change_percentage_24h: coin.price_change_percentage_24h,
          current_price: coin.current_price,
          market_cap: coin.market_cap,
          high_24h: coin.high_24h,
          low_24h: coin.low_24h,
          ath: coin.ath,
          market_cap_rank: coin.market_cap_rank,
        }));
      } catch (error) {
        this.error = "Failed to load coins. Please try again.";
        console.error("Error fetching coins:", error);
      } finally {
        this.isLoading = false;
      }
    },

  },
});
