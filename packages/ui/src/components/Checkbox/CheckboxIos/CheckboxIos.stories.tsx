import { createSignal } from 'solid-js';
import type { Meta, StoryObj } from 'storybook-solidjs';

import { CheckboxIos } from './CheckboxIos.jsx';
import { TypographyIos } from '@/components/Typography/TypographyIos/TypographyIos.js';
import { getClassesArgType } from '../../../../.storybook/utils.js';

import s from './CheckboxIos.stories.module.scss';

type StoryComponent = typeof CheckboxIos;
type Story = StoryObj<StoryComponent>;

const meta: Meta<StoryComponent> = {
  title: 'Checkbox/CheckboxIos',
  component: CheckboxIos,
  tags: ['autodocs'],
};

export default meta;

export const Playground: Story = {
  render: CheckboxIos,
  args: {
    checked: false,
    disabled: false,
  },
  argTypes: {
    checked: {
      description: 'True if the checkbox is checked.',
      defaultValue: { summary: 'false' },
      control: { type: 'boolean' },
    },
    disabled: {
      description: 'Is switch disabled.',
      defaultValue: { summary: 'false' },
      control: { type: 'boolean' },
    },
    classes: getClassesArgType('root', 'input', 'icon'),
  },
};

export const Preview: Story = {
  render() {
    const [checked, setChecked] = createSignal(true);

    return (
      <main class={s.root}>
        <TypographyIos>Default</TypographyIos>
        <CheckboxIos/>
        <CheckboxIos disabled/>
        <CheckboxIos
          checked={checked()}
          onChange={e => {
            setChecked(e.target.checked);
          }}
        />
      </main>
    );
  },
};
