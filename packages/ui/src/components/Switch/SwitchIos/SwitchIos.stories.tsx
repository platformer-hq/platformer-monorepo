import { createSignal } from 'solid-js';
import type { Meta, StoryObj } from 'storybook-solidjs';

import { SwitchIos } from './SwitchIos.jsx';
import { TypographyIos } from '@/components/Typography/TypographyIos/TypographyIos.js';
import { getClassesArgType } from '../../../../.storybook/utils.js';

import s from './SwitchIos.stories.module.scss';

type StoryComponent = typeof SwitchIos;
type Story = StoryObj<StoryComponent>;

const meta: Meta<StoryComponent> = {
  title: 'Switch/SwitchIos',
  component: SwitchIos,
  tags: ['autodocs'],
};

export default meta;

export const Playground: Story = {
  render: SwitchIos,
  args: {
    checked: false,
    disabled: false,
    iconed: false,
  },
  argTypes: {
    checked: {
      description: 'Is switch checked.',
      defaultValue: { summary: 'false' },
      control: { type: 'boolean' },
    },
    disabled: {
      description: 'Is switch disabled.',
      defaultValue: { summary: 'false' },
      control: { type: 'boolean' },
    },
    iconed: {
      description: 'Should icons inside the thumb be displayed. Enabling this mode will also slightly modify the switch colors.',
      defaultValue: { summary: 'false' },
      control: { type: 'boolean' },
    },
    classes: getClassesArgType('root', 'input', 'thumb', 'checkIcon', 'uncheckIcon'),
  },
};

export const Preview: Story = {
  render() {
    const [checked, setChecked] = createSignal(true);

    return (
      <main class={s.root}>
        <TypographyIos>Default</TypographyIos>
        <SwitchIos/>
        <SwitchIos disabled/>
        <SwitchIos
          checked={checked()}
          onChange={e => {
            setChecked(e.target.checked);
          }}
        />
        <TypographyIos>Iconed</TypographyIos>
        <SwitchIos iconed/>
        <SwitchIos checked iconed/>
        <SwitchIos
          checked={checked()}
          iconed
          onChange={e => {
            setChecked(e.target.checked);
          }}
        />
      </main>
    );
  },
};
