import React from 'react';
import ContactPage from '../../contact/page';
import RouteModal from '@/components/ui/RouteModal';

export default function Modal() {
  return (
    <RouteModal>
      <ContactPage />
    </RouteModal>
  );
}