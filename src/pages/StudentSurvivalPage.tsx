import React from 'react';
import StudentSurvivalMode from '@/components/dashboard/StudentSurvivalMode';

const StudentSurvivalPage: React.FC = () => {
  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <h1 className="text-lg font-bold text-foreground">Student Survival Mode</h1>
      <StudentSurvivalMode />
    </div>
  );
};

export default StudentSurvivalPage;
