import React from 'react';
import AboutPage from '../../about/page';
import RouteModal from '@/components/ui/RouteModal';

export default function Modal() {
  return (
    <RouteModal>
      <AboutPage />
    </RouteModal>
  );
}