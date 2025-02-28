// components/Terms.tsx

import React from 'react';

const Terms: React.FC = () => {
  return (
    <div className="mt-6 border-t border-gray-200 pt-4">
      <h3 className="font-bold mb-2">Terms & Conditions:</h3>
      <ol className="list-decimal list-inside space-y-1 text-sm">
        <li>Goods Once Sold Will Note Be Taken Back.</li>
        <li>Subject To Neemuch Jurisdiction Only.</li>
        <li>E & O.E.</li>
        <li>Pay at https://sagarawat.in/pay.</li>
      </ol>
    </div>
  );
};

export default Terms;