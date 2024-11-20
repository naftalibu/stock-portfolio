import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, Button, Spin, Statistic, Row, Col } from 'antd';
import type { StatisticProps } from 'antd/es/statistic/Statistic';
import { ArrowLeft } from 'lucide-react';
import axios from 'axios';

interface StockDetail {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changesPercentage: number;
  marketCap: number;
  volume: number;
  open: number;
  previousClose: number;
  dayHigh: number;
  dayLow: number;
}

export const StockDetails = observer(() => {
  const { symbol } = useParams();
  const [loading, setLoading] = useState(true);
  const [stockData, setStockData] = useState<StockDetail | null>(null);

  useEffect(() => {
    const fetchStockDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/portfolio/${symbol}`);
        setStockData(response.data);
      } catch (error) {
        console.error('Failed to fetch stock details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStockDetails();
  }, [symbol]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  const formatMarketCap: StatisticProps['formatter'] = (value) => {
    if (typeof value === 'number') {
      return `$${(value / 1000000000).toFixed(2)}B`;
    }
    return '';
  };

  return (
    <div className="p-6">
      <Link to="/">
        <Button icon={<ArrowLeft className="w-4 h-4" />} className="mb-6">
          Back to Portfolio
        </Button>
      </Link>

      {stockData ? (
        <>
          <Card className="mb-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-2xl font-bold">{stockData.name}</h1>
                <p className="text-gray-500">{stockData.symbol}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">${stockData.price}</p>
                <p className={stockData.change >= 0 ? 'text-green-500' : 'text-red-500'}>
                  {stockData.change > 0 ? '+' : ''}{stockData.change} ({stockData.changesPercentage}%)
                </p>
              </div>
            </div>
          </Card>

          <Row gutter={[16, 16]}>
            <Col span={6}>
              <Card>
                <Statistic title="Open" value={stockData.open} prefix="$" precision={2} />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic title="Previous Close" value={stockData.previousClose} prefix="$" precision={2} />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic title="Day High" value={stockData.dayHigh} prefix="$" precision={2} />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic title="Day Low" value={stockData.dayLow} prefix="$" precision={2} />
              </Card>
            </Col>
            <Col span={12}>
              <Card>
                <Statistic title="Volume" value={stockData.volume} />
              </Card>
            </Col>
            <Col span={12}>
              <Card>
                <Statistic 
                  title="Market Cap" 
                  value={stockData?.marketCap} 
                  formatter={formatMarketCap}
                />
              </Card>
            </Col>
          </Row>
        </>
      ) : (
        <Card>
          <p className="text-center text-gray-500">No data available for {symbol}</p>
        </Card>
      )}
    </div>
  );
});
