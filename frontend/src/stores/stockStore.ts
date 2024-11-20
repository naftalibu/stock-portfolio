import { makeAutoObservable } from 'mobx';
import axios, { AxiosError } from 'axios';
import { message } from 'antd';

interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
}

class StockStore {
  stocks: Stock[] = [];
  loading = false;

  constructor() {
    makeAutoObservable(this);
  }

  async fetchPortfolio() {
    this.loading = true;
    try {
      const response = await axios.get('http://localhost:3000/api/portfolio');
      this.stocks = response.data;
    } catch (error) {
      console.error('Failed to fetch portfolio:', error);
    }
    this.loading = false;
  }

  async addStock(symbol: string) {
    try {
      await axios.post('http://localhost:3000/api/portfolio', { symbol });
      message.success(`Successfully added ${symbol} to portfolio`);
      await this.fetchPortfolio();
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          message.error(`Stock symbol ${symbol} not found`);
        } else {
          message.error('Failed to add stock. Please try again.');
        }
      }
      console.error('Failed to add stock:', error);
    }
  }

  async removeStock(symbol: string) {
    try {
      await axios.delete(`http://localhost:3000/api/portfolio/${symbol}`);
      await this.fetchPortfolio();
    } catch (error) {
      console.error('Failed to remove stock:', error);
    }
  }
}

export const stockStore = new StockStore();
