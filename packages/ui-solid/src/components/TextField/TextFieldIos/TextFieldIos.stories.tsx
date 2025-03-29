// import { For } from 'solid-js';
import type { Meta, StoryObj } from 'storybook-solidjs';

import {
  TextFieldIos,
} from './TextFieldIos.jsx';
// import { getClassesArgType } from '../../../../.storybook/utils.js';

// import s from './TypographyIos.stories.module.scss';
// import { classNames } from '@/css/classnames.js';
import { TextFieldIosClear, TextFieldIosInput, TextFieldIosPlaceholder } from './boxes.js';

type StoryComponent = typeof TextFieldIos;
type Story = StoryObj<StoryComponent>;

const meta: Meta<StoryComponent> = {
  title: 'TextField/TextFieldIos',
  component: TextFieldIos,
  tags: ['autodocs'],
};

export default meta;

// export const Playground: Story = {
//   render(props) {
//     return <TypographyIos {...props} component={props.component || 'p'}/>;
//   },
//   args: {
//     component: 'p',
//     weight: 'regular',
//     variant: 'body',
//     rounded: false,
//     monoNumbers: false,
//     mono: false,
//     strikethrough: false,
//     caps: false,
//     children: 'Your text goes here',
//   },
//   argTypes: {
//     component: {
//       description: 'The component to use for displaying the component.',
//       control: {
//         type: 'text',
//       },
//     },
//     caps: {
//       description: 'Uppercase text.',
//       control: { type: 'boolean' },
//     },
//     rounded: {
//       description: 'Use rounded font.',
//       control: { type: 'boolean' },
//     },
//     mono: {
//       description: 'Use monospace font.',
//       control: { type: 'boolean' },
//     },
//     monoNumbers: {
//       description: 'Use monospace numbers font.',
//       control: { type: 'boolean' },
//     },
//     strikethrough: {
//       description: 'Apply strikethrough.',
//       control: { type: 'boolean' },
//     },
//     weight: {
//       description: 'Font weight.',
//       options: weights,
//       defaultValue: { summary: 'regular' },
//       control: {
//         type: 'select',
//         labels: {
//           regular: 'Regular',
//           medium: 'Medium',
//           semibold: 'Semibold',
//           bold: 'Bold',
//         },
//       },
//     },
//     variant: {
//       description: 'Font variant.',
//       options: variants,
//       defaultValue: { summary: 'body' },
//       control: {
//         type: 'select',
//         labels: {
//           title1: 'Title 1',
//           title2: 'Title 2',
//           title3: 'Title 3',
//           headline: 'Headline',
//           body: 'Body',
//           callout: 'Callout',
//           subheadline1: 'Subheadline 1',
//           subheadline2: 'Subheadline 2',
//           footnote: 'Footnote',
//           caption1: 'Caption 1',
//           caption2: 'Caption 2',
//         },
//       },
//     },
//     children: {
//       description: 'Content to display.',
//       control: {
//         type: 'text',
//       },
//     },
//     classes: getClassesArgType('root'),
//   },
// };

export const Preview: Story = {
  render() {
    return (
      <main>
        <section>
          <TextFieldIos>
            <TextFieldIosPlaceholder>Your input goes here</TextFieldIosPlaceholder>
            <TextFieldIosInput value="Text"/>
            <TextFieldIosClear/>
          </TextFieldIos>
        </section>
      </main>
    );
  },
};
