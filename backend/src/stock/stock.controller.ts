import { Controller, Get, Post, Delete, Body, Param } from '@nestjs/common';
import { StockService } from './stock.service';

@Controller('portfolio')
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Get()
  getPortfolio() {
    console.log('GET /portfolio endpoint hit');
    return this.stockService.getPortfolio();
  }

  @Post()
  addStock(@Body('symbol') symbol: string) {
    console.log('POST /portfolio endpoint hit with symbol:', symbol);
    return this.stockService.addStock(symbol);
  }

  @Delete(':symbol')
  removeStock(@Param('symbol') symbol: string) {
    return this.stockService.removeStock(symbol);
  }

  @Get(':symbol')
  async getStockDetails(@Param('symbol') symbol: string) {
    return this.stockService.getStockDetails(symbol);
  }
}