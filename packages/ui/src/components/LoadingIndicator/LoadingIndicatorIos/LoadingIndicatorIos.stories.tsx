import { For } from 'solid-js';
import type { Meta, StoryObj } from 'storybook-solidjs';

import { LoadingIndicatorIos } from './LoadingIndicatorIos.js';

type StoryComponent = typeof LoadingIndicatorIos;
type Story = StoryObj<StoryComponent>;

const meta: Meta<StoryComponent> = {
  title: 'Loading Indicator/LoadingIndicatorIos',
  component: LoadingIndicatorIos,
  tags: ['autodocs'],
};

export default meta;

export const Preview: Story = {
  render() {
    return (
      <div style={{ display: 'flex', gap: '10px' }}>
        <For each={[24, 28, 32]}>
          {(size) => (
            <LoadingIndicatorIos style="flex: 0 0 auto" size={size}/>
          )}
        </For>
      </div>
    );
  },
};
