import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Stock } from './stock.schema';
import axios from 'axios';

@Injectable()
export class StockService {
  private readonly logger = new Logger(StockService.name);

  constructor(
    @InjectModel(Stock.name) private stockModel: Model<Stock>
  ) {
    this.logger.log(`FMP API Key is ${process.env.FMP_API_KEY ? 'present' : 'missing'}`);
  }

  async getPortfolio() {
    const stocks = await this.stockModel.find().exec();
    if (stocks.length === 0) return [];
    
    try {
      const quotes = await this.fetchQuotes(stocks.map(s => s.symbol));
      return stocks.map(stock => ({
        ...stock.toJSON(),
        ...quotes[stock.symbol]
      }));
    } catch (error) {
      this.logger.error('Error fetching quotes:', error.message);
      return stocks;
    }
  }

  async addStock(symbol: string) {
    try {
      const quote = await this.fetchQuote(symbol);
      if (!quote) {
        throw new NotFoundException(`Stock symbol ${symbol} not found`);
      }

      const stock = new this.stockModel({
        symbol: symbol.toUpperCase(),
        name: quote.name || quote.companyName,
        lastUpdated: new Date()
      });

      return await stock.save();
    } catch (error) {
      if (error.response?.status === 401) {
        throw new NotFoundException(`Stock symbol ${symbol} not found or invalid`);
      }
      throw error;
    }
  }

  async removeStock(symbol: string) {
    return this.stockModel.deleteOne({ symbol: symbol.toUpperCase() }).exec();
  }

  private async fetchQuote(symbol: string) {
    try {
      const response = await axios.get(
        `https://financialmodelingprep.com/api/v3/quote/${symbol}`,
        {
          params: {
            apikey: process.env.FMP_API_KEY
          }
        }
      );
      
      if (response.data && response.data.length > 0) {
        return response.data[0];
      }
      return null;
    } catch (error) {
      this.logger.error(`Error fetching quote for ${symbol}:`, error.message);
      throw error;
    }
  }

  private async fetchQuotes(symbols: string[]) {
    try {
      const quotes = await Promise.all(
        symbols.map(symbol => this.fetchQuote(symbol))
      );
      return quotes.reduce((acc, quote, index) => {
        if (quote) {
          acc[symbols[index]] = quote;
        }
        return acc;
      }, {});
    } catch (error) {
      this.logger.error('Error fetching multiple quotes:', error.message);
      throw error;
    }
  }

  async getStockDetails(symbol: string) {
    try {
      const quote = await this.fetchQuote(symbol);
      if (!quote) {
        throw new NotFoundException(`Stock ${symbol} not found`);
      }
      return quote;
    } catch (error) {
      this.logger.error(`Error fetching details for ${symbol}:`, error.message);
      throw error;
    }
  }
}