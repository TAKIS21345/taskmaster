import React from 'react';
import { Trophy } from 'lucide-react';
import { usePoints } from '../../contexts/PointsContext';

const PointsDisplay: React.FC = () => {
  const { points } = usePoints();

  return (
    <div className="flex items-center bg-white rounded-lg shadow-sm p-3 transition-all hover:shadow-md">
      <div className="flex-shrink-0 bg-yellow-100 rounded-full p-2 mr-3">
        <Trophy className="h-5 w-5 text-yellow-500" />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-600">Available Points</p>
        <p className="text-xl font-bold text-purple-700">{points}</p>
      </div>
    </div>
  );
};

export default PointsDisplay;