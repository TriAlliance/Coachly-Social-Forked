import React, { useState } from 'react';
import { Statistics } from './Statistics';
import { ProgressTracking } from './ProgressTracking';
import { PersonalRecords } from './PersonalRecords';
import { AchievementBadges } from './AchievementBadges';
import { DetailedProgress } from './DetailedProgress';
import { Feed } from './Feed';
import { RoutePlanning } from './RoutePlanning';
import { Groups } from './Groups';
import { Teams } from './Teams';
import { Events } from './Events';
import { DashboardPage } from '../pages/DashboardPage';
import { TrainingPlans } from './TrainingPlans';
import { QandA } from './QandA';
import { TrendingPage } from './TrendingPage';

export function StatsAndAnalytics() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="p-6">
      {activeTab === 'dashboard' && <DashboardPage />}
      {activeTab === 'feed' && <Feed />}
      {activeTab === 'trending' && <TrendingPage />}
      {activeTab === 'training' && <TrainingPlans />}
      {activeTab === 'groups' && <Groups />}
      {activeTab === 'teams' && <Teams />}
      {activeTab === 'events' && <Events />}
      {activeTab === 'qanda' && <QandA />}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <Statistics />
          <ProgressTracking />
          <PersonalRecords />
          <AchievementBadges />
        </div>
      )}
      {activeTab === 'progress' && (
        <div className="space-y-6">
          <ProgressTracking />
          <DetailedProgress />
        </div>
      )}
      {activeTab === 'records' && <PersonalRecords />}
      {activeTab === 'achievements' && (
        <div className="space-y-6">
          <AchievementBadges />
        </div>
      )}
      {activeTab === 'routes' && <RoutePlanning />}
    </div>
  );
}