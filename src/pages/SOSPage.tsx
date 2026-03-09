import React from 'react';
import SOSMoneyRequest from '@/components/dashboard/SOSMoneyRequest';

const SOSPage: React.FC = () => {
  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <h1 className="text-lg font-bold text-foreground">S.O.S Money Request</h1>
      <SOSMoneyRequest />
    </div>
  );
};

export default SOSPage;
