import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Portfolio } from '../pages/Portfolio';
import { StockDetails } from '../pages/StockDetails';

export function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-xl font-bold">Stock Portfolio</h1>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Routes>
          <Route path="/" element={<Portfolio />} />
          <Route path="/stock/:symbol" element={<StockDetails />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
