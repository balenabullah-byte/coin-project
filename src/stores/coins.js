import { defineStore } from 'pinia'
import axios from 'axios'

export const useCoinsStore = defineStore('coins', {
  state: () => ({
    coins: [],
    searchQuery: ''
  }),

  actions: {
    async fetchCoins() {
      const response = await axios.request({
        method: 'GET',
        url: 'https://api.coingecko.com/api/v3/coins/markets',
        params: {
          vs_currency: 'usd'
        },
        headers: {
          'x-cg-demo-api-key': 'CG-a1cG8KvoxGKgoJvYXuWeNg9k'
        }
      })

      console.log('Coins API response:', response.data)
      this.coins = response.data
    }
  }
})
