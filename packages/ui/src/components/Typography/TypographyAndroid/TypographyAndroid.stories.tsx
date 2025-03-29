import { For } from 'solid-js';
import type { Meta, StoryObj } from 'storybook-solidjs';

import {
  TypographyAndroid,
  TypographyAndroidVariant,
  TypographyAndroidWeight,
} from './TypographyAndroid.js';
import { getClassesArgType } from '../../../../.storybook/utils.js';

import s from './TypographyAndroid.stories.module.scss';

type StoryComponent = typeof TypographyAndroid;
type Story = StoryObj<StoryComponent>;

const weights: TypographyAndroidWeight[] = ['regular', 'medium'];
const variants: TypographyAndroidVariant[] = [
  'headline5',
  'headline6',
  'headline7',
  'body1',
  'subtitle1',
  'button1',
  'subtitle2',
  'button2',
  'caption1',
  'caption2',
];

const meta: Meta<StoryComponent> = {
  title: 'Typography/TypographyAndroid',
  component: TypographyAndroid,
  tags: ['autodocs'],
};

export default meta;

export const Playground: Story = {
  render(props) {
    return <TypographyAndroid {...props} component={props.component || 'p'}/>;
  },
  args: {
    component: 'p',
    weight: 'regular',
    variant: 'body1',
    children: 'Your text goes here',
    caps: false,
    mono: false,
    strikethrough: false,
  },
  argTypes: {
    component: {
      description: 'The component to use for displaying the component.',
      control: {
        type: 'text',
      },
    },
    caps: {
      description: 'Uppercase text.',
      control: { type: 'boolean' },
    },
    mono: {
      description: 'Use monospace font.',
      control: { type: 'boolean' },
    },
    strikethrough: {
      description: 'Apply strikethrough.',
      control: { type: 'boolean' },
    },
    weight: {
      description: 'Font weight.',
      options: weights,
      defaultValue: { summary: 'regular' },
      control: {
        type: 'select',
        labels: {
          regular: 'Regular',
          medium: 'Medium',
        },
      },
    },
    variant: {
      description: 'Font variant.',
      options: variants,
      defaultValue: { summary: 'body' },
      control: {
        type: 'select',
        labels: {
          headline5: 'Headline 5',
          headline6: 'Headline 6',
          headline7: 'Headline 7',
          body1: 'Body 1',
          subtitle1: 'Subtitle 1',
          button1: 'Button 1',
          subtitle2: 'Subtitle 2',
          button2: 'Button 2',
          caption1: 'Caption 1',
          caption2: 'Caption 2',
        },
      },
    },
    children: {
      description: 'Content to display.',
      control: {
        type: 'text',
      },
    },
    classes: getClassesArgType('root'),
  },
};

export const Preview: Story = {
  render() {
    const items: [
      variant: TypographyAndroidVariant,
      ...[
        text: string,
        ...(TypographyAndroidWeight | 'strikethrough' | 'mono')[]
      ][],
    ][] = [
      ['headline5'],
      ['headline6'],
      ['headline7'],
      [
        'body1',
        ['Medium', 'medium'],
        ['Strikethrough', 'strikethrough'],
        ['Mono', 'mono'],
      ],
      ['subtitle1', ['Medium', 'medium']],
      ['button1'],
      ['subtitle2', ['Medium', 'medium']],
      ['button2'],
      ['caption1'],
      ['caption2', ['Medium', 'medium']],
    ];

    return (
      <main>
        <For each={items}>
          {([variant, ...cases]) => (
            <section class={s.section}>
              <TypographyAndroid component="span" variant={variant}>
                {variant[0].toUpperCase() + variant.slice(1)}
              </TypographyAndroid>
              <For each={cases}>
                {([text, ...mods]) => (
                  <TypographyAndroid
                    class={s.opaque}
                    component={'span'}
                    variant={variant}
                    weight={mods.includes('medium')
                      ? 'medium'
                      : mods.includes('regular')
                        ? 'regular'
                        : undefined}
                    strikethrough={mods.includes('strikethrough')}
                    mono={mods.includes('mono')}
                  >
                    {text}
                  </TypographyAndroid>
                )}
              </For>
            </section>
          )}
        </For>
      </main>
    );
  },
};
