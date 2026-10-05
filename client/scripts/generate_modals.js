const fs = require('fs');
const path = require('path');

const baseDir = '/Users/user/Documents/DirectCrest/client/src/app/[locale]/(storefront)';
const modalDir = path.join(baseDir, '@modal');

if (!fs.existsSync(modalDir)) {
  fs.mkdirSync(modalDir);
}

// Write default.tsx
fs.writeFileSync(path.join(modalDir, 'default.tsx'), `export default function Default() { return null; }`);

const pages = ['about', 'contact', 'privacy', 'shipping', 'sourcing', 'terms'];

pages.forEach(page => {
  const pageDir = path.join(modalDir, `(.)${page}`);
  if (!fs.existsSync(pageDir)) {
    fs.mkdirSync(pageDir, { recursive: true });
  }

  const componentName = page.charAt(0).toUpperCase() + page.slice(1) + 'Page';

  const content = `
import React from 'react';
import ${componentName} from '../../../${page}/page';
import RouteModal from '@/components/ui/RouteModal';

export default function Modal() {
  return (
    <RouteModal>
      <${componentName} />
    </RouteModal>
  );
}
`;
  
  fs.writeFileSync(path.join(pageDir, 'page.tsx'), content.trim());
});

console.log('Successfully created intercepting routes');
