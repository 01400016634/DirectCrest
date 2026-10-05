import React from 'react';
import SourcingPage from '../../sourcing/page';
import RouteModal from '@/components/ui/RouteModal';

export default function Modal() {
  return (
    <RouteModal>
      <SourcingPage />
    </RouteModal>
  );
}