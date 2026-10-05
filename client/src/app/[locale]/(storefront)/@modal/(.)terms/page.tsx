import React from 'react';
import TermsPage from '../../terms/page';
import RouteModal from '@/components/ui/RouteModal';

export default function Modal() {
  return (
    <RouteModal>
      <TermsPage />
    </RouteModal>
  );
}