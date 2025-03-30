import { StatusPage, type StatusPageProps } from '@/components/StatusPage/StatusPage.js';

export function ErrorStatusPage(props: Pick<StatusPageProps, 'title' | 'text'>) {
  return <StatusPage state="error" {...props} />;
}