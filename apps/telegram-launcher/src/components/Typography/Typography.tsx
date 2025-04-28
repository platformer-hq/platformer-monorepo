import { TypographyIos, TypographyAndroid, styled } from 'ui';
import { type ParentProps, Show } from 'solid-js';
import { accessor, pickProps } from 'solid-utils';

import { useMainContext } from '@/providers/MainProvider.js';

import './Typography.scss';

const WrappedAndroid = styled(TypographyAndroid, {
  root: 'typography',
});

export function Typography(props: ParentProps<{
  class?: string;
  variant?: 'heading' | 'footnote';
  component?: 'span';
  weight?: 'semibold';
}>) {
  const context = useMainContext();
  const $variant = accessor(props, 'variant');
  return (
    <Show
      when={['macos', 'ios'].includes(context.platform)}
      fallback={
        <WrappedAndroid
          {...pickProps(props, ['component', 'children', 'class'])}
          weight={props.weight === 'semibold' ? 'medium' : undefined}
          variant={({
            heading: 'headline5',
            footnote: 'caption1',
            default: 'body1',
          } as const)[$variant() || 'default']}
        />
      }
    >
      <TypographyIos
        {...pickProps(props, ['component', 'children', 'class', 'weight'])}
        variant={({
          heading: 'title1',
          footnote: 'footnote',
          default: 'body',
        } as const)[$variant() || 'default']}
      />
    </Show>
  );
}