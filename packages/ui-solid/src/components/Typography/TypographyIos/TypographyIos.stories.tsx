import { For } from 'solid-js';
import type { Meta, StoryObj } from 'storybook-solidjs';

import {
  TypographyIos,
  TypographyIosVariant,
  TypographyIosWeight,
} from './TypographyIos.js';
import { getClassesArgType } from '../../../../.storybook/utils.js';

import s from './TypographyIos.stories.module.scss';
import { classNames } from '@/css/classnames.js';

type StoryComponent = typeof TypographyIos;
type Story = StoryObj<StoryComponent>;

const weights: TypographyIosWeight[] = ['regular', 'medium', 'semibold', 'bold'];
const variants: TypographyIosVariant[] = [
  'title1',
  'title2',
  'title3',
  'headline',
  'body',
  'callout',
  'subheadline1',
  'subheadline2',
  'footnote',
  'caption1',
  'caption2',
];

const meta: Meta<StoryComponent> = {
  title: 'Typography/TypographyIos',
  component: TypographyIos,
  tags: ['autodocs'],
};

export default meta;

export const Playground: Story = {
  render(props) {
    return <TypographyIos {...props} component={props.component || 'p'}/>;
  },
  args: {
    component: 'p',
    weight: 'regular',
    variant: 'body',
    rounded: false,
    monoNumbers: false,
    mono: false,
    strikethrough: false,
    caps: false,
    children: 'Your text goes here',
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
    rounded: {
      description: 'Use rounded font.',
      control: { type: 'boolean' },
    },
    mono: {
      description: 'Use monospace font.',
      control: { type: 'boolean' },
    },
    monoNumbers: {
      description: 'Use monospace numbers font.',
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
          semibold: 'Semibold',
          bold: 'Bold',
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
          title1: 'Title 1',
          title2: 'Title 2',
          title3: 'Title 3',
          headline: 'Headline',
          body: 'Body',
          callout: 'Callout',
          subheadline1: 'Subheadline 1',
          subheadline2: 'Subheadline 2',
          footnote: 'Footnote',
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
      variant: TypographyIosVariant,
      ...[
        text: string,
        ...(
          TypographyIosWeight | 'rounded' | 'caps' | 'strikethrough' | 'monoNumbers' | 'mono'
          )[]
      ][],
    ][] = [
      [
        'title1',
        ['Semibold Rounded', 'semibold', 'rounded'],
        ['Bold Rounded', 'bold', 'rounded'],
      ],
      ['title2', ['Semibold', 'semibold']],
      [
        'title3',
        ['Semibold', 'semibold'],
        ['Semibold Rounded', 'semibold', 'rounded'],
        ['Bold', 'bold'],
      ],
      ['headline'],
      [
        'body',
        ['Medium', 'medium'],
        ['Semibold', 'semibold'],
        ['Strikethrough', 'strikethrough'],
        ['Mono', 'mono'],
        ['MonoNumbers', 'monoNumbers'],
      ],
      [
        'callout',
        ['Medium', 'medium'],
        ['Semibold', 'semibold'],
      ],
      [
        'subheadline1',
        ['Semibold Rounded', 'semibold', 'rounded'],
        ['Semibold Rounded · Caps', 'semibold', 'rounded', 'caps'],
        ['Mono', 'mono'],
      ],
      [
        'subheadline2',
        ['Semibold', 'semibold'],
        ['Semibold Rounded', 'semibold', 'rounded'],
      ],
      [
        'footnote',
        ['Medium', 'medium'],
        ['Semibold', 'semibold'],
        ['Semibold Rounded', 'semibold', 'rounded'],
        ['Caps', 'caps'],
      ],
      ['caption1'],
      ['caption2', ['Medium', 'medium']],
    ];

    return (
      <main>
        <For each={items}>
          {([variant, ...cases]) => (
            <section class={s.section}>
              <TypographyIos class={s.item} variant={variant}>
                {variant[0].toUpperCase() + variant.slice(1)}
              </TypographyIos>
              <For each={cases}>
                {([text, ...mods]) => (
                  <TypographyIos
                    class={classNames(s.opaque, s.item)}
                    variant={variant}
                    weight={
                      mods.includes('regular')
                        ? 'regular'
                        : mods.includes('semibold')
                          ? 'semibold'
                          : mods.includes('medium')
                            ? 'medium'
                            : mods.includes('bold')
                              ? 'bold'
                              : undefined
                    }
                    caps={mods.includes('caps')}
                    rounded={mods.includes('rounded')}
                    strikethrough={mods.includes('strikethrough')}
                    mono={mods.includes('mono')}
                    monoNumbers={mods.includes('monoNumbers')}
                  >
                    {text}
                  </TypographyIos>
                )}
              </For>
            </section>
          )}
        </For>
      </main>
    );
  },
};
