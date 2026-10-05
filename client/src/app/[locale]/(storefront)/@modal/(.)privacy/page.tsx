import React from 'react';
import PrivacyPage from '../../privacy/page';
import RouteModal from '@/components/ui/RouteModal';

export default function Modal() {
  return (
    <RouteModal>
      <PrivacyPage />
    </RouteModal>
  );
}