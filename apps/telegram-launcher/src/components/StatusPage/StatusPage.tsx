import { type JSXElement, Show } from 'solid-js';

import { Picture, type PictureProps } from '@/components/Picture/Picture.js';

import './StatusPage.scss';

export interface StatusPageProps {
  image?: PictureProps;
  title: JSXElement;
  subtitle?: JSXElement;
}

export function StatusPage(props: StatusPageProps) {
  return (
    <div class="status-page">
      <Show when={props.image}>
        {img => <Picture class="status-page__image" {...img()}/>}
      </Show>
      <h1 class="status-page__title">{props.title}</h1>
      <Show when={props.subtitle}>
        <p class="status-page__subtitle">
          {props.subtitle}
        </p>
      </Show>
    </div>
  );
}