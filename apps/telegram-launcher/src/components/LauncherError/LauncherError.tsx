import { StatusPage, type StatusPageProps } from '@/components/StatusPage/StatusPage.js';

import image from './sad.png?process';

export function LauncherError(props: Pick<StatusPageProps, 'title' | 'subtitle'>) {
  return <StatusPage {...props} image={image}/>;
}