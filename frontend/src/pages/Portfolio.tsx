import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { stockStore } from '../stores/stockStore';
import { Button, Card, List, Modal, Input } from 'antd';
import { Plus, Trash2 } from 'lucide-react';

export const Portfolio = observer(() => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [symbol, setSymbol] = useState('');

  useEffect(() => {
    stockStore.fetchPortfolio();
  }, []);

  const handleAddStock = async () => {
    if (symbol.trim()) {
      await stockStore.addStock(symbol.trim().toUpperCase());
      setSymbol('');
      setIsModalVisible(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Portfolio</h1>
        <Button 
          type="primary"
          icon={<Plus className="w-4 h-4" />}
          onClick={() => setIsModalVisible(true)}
        >
          Add Stock
        </Button>
      </div>

      <List
        grid={{ gutter: 16, column: 3 }}
        dataSource={stockStore.stocks}
        loading={stockStore.loading}
        renderItem={(stock) => (
          <List.Item>
            <Card
              title={
                <Link to={`/stock/${stock.symbol}`}>
                  {stock.symbol} - {stock.name}
                </Link>
              }
              extra={
                <Button
                  type="text"
                  danger
                  icon={<Trash2 className="w-4 h-4" />}
                  onClick={() => stockStore.removeStock(stock.symbol)}
                />
              }
            >
              <p className="text-lg font-semibold">${stock.price}</p>
              <p className={stock.change >= 0 ? 'text-green-500' : 'text-red-500'}>
                {stock.change}%
              </p>
            </Card>
          </List.Item>
        )}
      />

      <Modal
        title="Add Stock"
        open={isModalVisible}
        onOk={handleAddStock}
        onCancel={() => setIsModalVisible(false)}
        okButtonProps={{ disabled: !symbol.trim() }}
      >
        <Input 
          placeholder="Enter stock symbol (e.g., AAPL)"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          onPressEnter={handleAddStock}
        />
      </Modal>
    </div>
  );
});
