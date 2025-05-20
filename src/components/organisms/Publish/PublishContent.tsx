import React from 'react';
import QueuedPosts from './QueuedPosts';
import PendingApproval from './PendingApproval';
import DraftsPosts from './DraftsPosts';
import DeliveredPosts from './DeliveredPosts';
import ManageQueueTimes from './ManageQueueTimes';
import { cn } from '../../../lib/utils';

interface PublishContentProps {
  className?: string;
  activeView: string;
}

export const PublishContent: React.FC<PublishContentProps> = ({ 
  className,
  activeView = 'queued'
}) => {
  return (
    <div className={cn("w-full", className)}>
      {activeView === 'queued' && <QueuedPosts />}
      
      {activeView === 'pending-approval' && <PendingApproval />}
      
      {activeView === 'drafts' && <DraftsPosts />}
      
      {activeView === 'delivered' && <DeliveredPosts />}
      
      {activeView === 'queue-times' && <ManageQueueTimes />}
    </div>
  );
};

export default PublishContent; 