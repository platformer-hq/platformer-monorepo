import { For } from 'solid-js';
import type { Meta, StoryObj } from 'storybook-solidjs';

import { ButtonIos, ButtonIosTheme, ButtonIosVariant } from './ButtonIos.js';
import { getClassesArgType } from '../../../../.storybook/utils.js';
import { ArrowUpCircleFill24, ArrowUpCircleFill28 } from '@/icons/index.js';

import s from './ButtonIos.stories.module.scss';

type StoryComponent = typeof ButtonIos;
type Story = StoryObj<StoryComponent>;

const variants: ButtonIosVariant[] = ['regular', 'multiline', 'small-rounded', 'small-squared'];
const themes: ButtonIosTheme[] = ['filled', 'tinted', 'plain', 'gray'];

const meta: Meta<StoryComponent> = {
  title: 'Button/ButtonIos',
  component: ButtonIos,
  tags: ['autodocs'],
};

export default meta;

export const Playground: Story = {
  render: ButtonIos,
  args: {
    children: 'Label',
    disabled: false,
    shine: false,
    fullWidth: false,
  },
  argTypes: {
    children: {
      description: 'Button content.',
      control: { type: 'text' },
    },
    disabled: {
      description: 'Is button disabled.',
      defaultValue: { summary: 'false' },
      control: { type: 'boolean' },
    },
    shine: {
      description: 'True if the button should have a shining effect. Applicable only to filled button',
      defaultValue: { summary: 'false' },
      control: { type: 'boolean' },
    },
    Icon: {
      description: 'Icon to display inside the button.',
      options: ['ArrowUpCircleFill24', 'ArrowUpCircleFill28'],
      mapping: {
        'ArrowUpCircleFill24': ArrowUpCircleFill24,
        'ArrowUpCircleFill28': ArrowUpCircleFill28,
      },
      control: {
        type: 'select',
      },
    },
    fullWidth: {
      description: 'True if the button should take all allowed horizontal space.',
      defaultValue: { summary: 'false' },
      control: { type: 'boolean' },
    },
    variant: {
      description: 'Button variant.',
      defaultValue: { summary: 'regular' },
      options: variants,
      control: { type: 'select' },
    },
    theme: {
      description: 'Button palette.',
      defaultValue: { summary: 'filled' },
      options: themes,
      control: { type: 'select' },
    },
    classes: getClassesArgType('root', 'input', 'thumb', 'checkIcon', 'uncheckIcon'),
  },
};

export const Preview: Story = {
  render() {
    return (
      <main class={s.root}>
        <section class={s.section}>
          <ButtonIos shine>Label</ButtonIos>
          <For each={themes}>
            {theme => <ButtonIos theme={theme}>Label</ButtonIos>}
          </For>
          <ButtonIos disabled>Label</ButtonIos>
        </section>
        <section class={s.section}>
          <ButtonIos Icon={ArrowUpCircleFill24} shine>Label</ButtonIos>
          <For each={themes}>
            {theme => (
              <ButtonIos Icon={ArrowUpCircleFill24} theme={theme}>
                Label
              </ButtonIos>
            )}
          </For>
          <ButtonIos Icon={ArrowUpCircleFill24} disabled>
            Label
          </ButtonIos>
        </section>
        <section class={s.section}>
          <ButtonIos Icon={ArrowUpCircleFill28} shine variant="multiline">Label</ButtonIos>
          <For each={themes}>
            {theme => (
              <ButtonIos Icon={ArrowUpCircleFill28} theme={theme} variant="multiline">
                Label
              </ButtonIos>
            )}
          </For>
          <ButtonIos Icon={ArrowUpCircleFill28} disabled variant="multiline">
            Label
          </ButtonIos>
        </section>
        <section class={s.section}>
          <ButtonIos shine variant="small-rounded">Label</ButtonIos>
          <For each={themes}>
            {theme => (
              <ButtonIos theme={theme} variant="small-rounded">
                Label
              </ButtonIos>
            )}
          </For>
          <ButtonIos variant="small-rounded" disabled>Label</ButtonIos>
        </section>
        <section class={s.section}>
          <ButtonIos shine variant="small-squared">Label</ButtonIos>
          <For each={themes}>
            {theme => (
              <ButtonIos theme={theme} variant="small-squared">
                Label
              </ButtonIos>
            )}
          </For>
          <ButtonIos variant="small-squared" disabled>Label</ButtonIos>
        </section>
        <section class={s.section}>
          <ButtonIos variant="regular" theme="filled" fullWidth shine>Full width</ButtonIos>
          <ButtonIos variant="regular" fullWidth>Full width</ButtonIos>
        </section>
      </main>
    );
  },
};
