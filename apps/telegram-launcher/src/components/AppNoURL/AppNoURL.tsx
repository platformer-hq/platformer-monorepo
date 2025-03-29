import { StatusPage } from '@/components/StatusPage/StatusPage.js';

import image from './nothing-here.png?process';

export function AppNoURL() {
  return (
    <StatusPage
      image={image}
      title="Nothing here"
      subtitle="The application is inaccessible on your device"
    />
  );
}