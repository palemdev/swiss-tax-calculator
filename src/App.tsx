import { useState } from 'react';
import { TaxProvider } from './context/TaxContext';
import { BudgetProvider } from './context/BudgetContext';
import { ChatProvider } from './context/ChatContext';
import { Header } from './components/layout/Header';
import { CalculatorPage } from './pages/CalculatorPage';
import { ComparisonPage } from './pages/ComparisonPage';
import { BudgetPage } from './pages/BudgetPage';
import { ChatbotButton } from './components/chatbot/ChatbotButton';

export type TabType = 'calculator' | 'comparison' | 'budget';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('calculator');

  const renderPage = () => {
    switch (activeTab) {
      case 'calculator':
        return <CalculatorPage />;
      case 'comparison':
        return <ComparisonPage />;
      case 'budget':
        return <BudgetPage />;
    }
  };

  return (
    <TaxProvider>
      <BudgetProvider>
        <ChatProvider>
          <div className="min-h-screen bg-gray-50">
            <Header activeTab={activeTab} onTabChange={setActiveTab} />
            <main>{renderPage()}</main>
            <footer className="bg-white border-t border-gray-200 py-6 mt-12">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <p className="text-center text-sm text-gray-500">
                  Swiss Tax Calculator 2025 - For informational purposes only.
                  <br />
                  Please consult a tax professional for official tax advice.
                </p>
              </div>
            </footer>
            <ChatbotButton />
          </div>
        </ChatProvider>
      </BudgetProvider>
    </TaxProvider>
  );
}

export default App;
