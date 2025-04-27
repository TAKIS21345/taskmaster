import React, { useState } from 'react';
import { ShoppingBag, AlertCircle, Gift, Palette, BookTemplate as FileTemplate, Lightbulb, Crown } from 'lucide-react';
import { usePoints } from '../../contexts/PointsContext';
import { RewardItem } from '../../types';

const RewardsShop: React.FC = () => {
  const { rewardItems, points, purchaseReward } = usePoints();
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = [
    { id: 'all', name: 'All Items', icon: Gift },
    { id: 'theme', name: 'Themes', icon: Palette },
    { id: 'template', name: 'Templates', icon: FileTemplate },
    { id: 'tip', name: 'Pro Tips', icon: Lightbulb },
    { id: 'premium', name: 'Premium', icon: Crown }
  ];

  const handlePurchase = (item: RewardItem) => {
    if (points < item.pointCost) {
      setMessage({ text: 'Not enough points to purchase this item', type: 'error' });
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    const success = purchaseReward(item.id);
    if (success) {
      setMessage({ text: `You purchased ${item.name}!`, type: 'success' });
      setTimeout(() => setMessage(null), 3000);
    } else {
      setMessage({ text: 'Failed to purchase item', type: 'error' });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const filteredItems = selectedCategory && selectedCategory !== 'all'
    ? rewardItems.filter(item => item.type === selectedCategory)
    : rewardItems;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center">
          <ShoppingBag className="mr-2 h-5 w-5 text-teal-600" />
          Rewards Shop
        </h2>
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
          {points} points available
        </span>
      </div>

      {message && (
        <div className={`mb-4 p-3 rounded-md ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'} flex items-center animate-fadeIn`}>
          <AlertCircle className="h-5 w-5 mr-2" />
          {message.text}
        </div>
      )}

      <div className="mb-6 flex overflow-x-auto gap-2 pb-2">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id === 'all' ? null : category.id)}
              className={`flex items-center px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                (category.id === 'all' && !selectedCategory) || category.id === selectedCategory
                  ? 'bg-teal-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Icon className="h-4 w-4 mr-2" />
              {category.name}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredItems.map((item) => (
          <div 
            key={item.id} 
            className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200"
          >
            {item.imageSrc && (
              <img
                src={item.imageSrc}
                alt={item.name}
                className="w-full h-32 object-cover"
              />
            )}
            <div className="p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800">
                  {item.pointCost} pts
                </span>
              </div>
              <p className="mt-1 text-sm text-gray-600">{item.description}</p>
              
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs text-gray-500 capitalize">{item.type}</span>
                <button
                  onClick={() => handlePurchase(item)}
                  disabled={points < item.pointCost}
                  className={`inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md ${
                    points >= item.pointCost
                      ? 'text-white bg-teal-600 hover:bg-teal-700'
                      : 'text-gray-500 bg-gray-200 cursor-not-allowed'
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500`}
                >
                  {points >= item.pointCost ? 'Purchase' : 'Not enough points'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RewardsShop