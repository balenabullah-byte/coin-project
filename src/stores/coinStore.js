import { defineStore } from "pinia";
import axios from "axios";

export const useCoinsStore = defineStore("coins", {
  state: () => {
    const storedFavorites = JSON.parse(
      localStorage.getItem("favorites") || "[]"
    );

    return {
      coins: [],
      isLoading: false,
      error: null,
      searchQuery: "",
      selectedIds: [],
      favorites: Array.isArray(storedFavorites)
        ? storedFavorites.filter((coinId) => typeof coinId === "string")
        : [],
    };
  },
  //state == data, getters == computed properties, actions == methods
  getters: {
    compareCoins(state) {
      return state.coins.filter((coin) => state.selectedIds.includes(coin.id));
    },
    canCompare(state) {
      return state.selectedIds.length >= 2;
    },
    isFavorite: (state) => (coinId) => state.favorites.includes(coinId),
  },
  actions: {
    toggleFavorite(coinId) {
      this.favorites = this.favorites.filter((id) => typeof id === "string");

      if (typeof coinId === "string" && coinId.length > 0) {
        const index = this.favorites.indexOf(coinId);

        if (index === -1) {
          this.favorites.push(coinId);
        }
        else {
          this.favorites.splice(index, 1);
        }
      }

      localStorage.setItem("favorites", JSON.stringify(this.favorites));
    },
    toggleCompare(coinId) {
      const index = this.selectedIds.indexOf(coinId);

      if (index === -1) {
        this.selectedIds.push(coinId);
      }
      else {
        this.selectedIds.splice(index, 1);
      }
    },
    clearCompare() {
      this.selectedIds = [];
    },
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
