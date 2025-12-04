import { useState } from 'react';
import { TaxProvider } from './context/TaxContext';
import { Header } from './components/layout/Header';
import { CalculatorPage } from './pages/CalculatorPage';
import { ComparisonPage } from './pages/ComparisonPage';

function App() {
  const [activeTab, setActiveTab] = useState<'calculator' | 'comparison'>('calculator');

  return (
    <TaxProvider>
      <div className="min-h-screen bg-gray-50">
        <Header activeTab={activeTab} onTabChange={setActiveTab} />
        <main>
          {activeTab === 'calculator' ? <CalculatorPage /> : <ComparisonPage />}
        </main>
        <footer className="bg-white border-t border-gray-200 py-6 mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-center text-sm text-gray-500">
              Swiss Tax Calculator 2025 - For informational purposes only.
              <br />
              Please consult a tax professional for official tax advice.
            </p>
          </div>
        </footer>
      </div>
    </TaxProvider>
  );
}

export default App;
