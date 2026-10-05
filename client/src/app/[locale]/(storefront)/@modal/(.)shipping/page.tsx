import React from 'react';
import ShippingPage from '../../shipping/page';
import RouteModal from '@/components/ui/RouteModal';

export default function Modal() {
  return (
    <RouteModal>
      <ShippingPage />
    </RouteModal>
  );
}