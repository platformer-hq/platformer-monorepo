import type { Meta, StoryObj } from 'storybook-solidjs';

import { Notifications30 } from '@/icons/settings/30/Notifications30.js';
import { TouchID30 } from '@/icons/settings/30/TouchID30.js';
import { Apps30 } from '@/icons/settings/30/Apps30.js';
import { Announcements30 } from '@/icons/settings/30/Announcements30.js';

import { ListIos } from '../ListIos/ListIos.js';
import {
  ListIosItem,
  ListIosItemBody,
  ListIosItemBodyLeftLabel,
  ListIosItemBodyLeftSubtitle,
  ListIosItemLeft,
  ListIosItemBodyRight,
  ListIosItemBodyRightLabel,
  ListIosItemBodyRightChevron,
  ListIosItemBodyLeft,
  ListIosItemRightCounter,
} from '../slots.js';

import image from './image.png';
import s from './ListIos.stories.module.scss';

type StoryComponent = typeof ListIos;
type Story = StoryObj<StoryComponent>;

const meta: Meta<StoryComponent> = {
  title: 'List/ListIos',
  component: ListIos,
  tags: ['autodocs'],
};

export default meta;

export const Preview: Story = {
  render() {
    return (
      <main class={s.root}>
        <section class={s.section}>
          <ListIos
            title="One-liners"
            footer="Here goes some examples of list items with only 1 line"
          >
            <ListIosItem>
              <ListIosItemBodyLeft>
                <ListIosItemBody>
                  <ListIosItemBodyLeftLabel>
                    Lorem ipsum odor amet, consectetuer adipiscing elit. Erat commodo lobortis nulla
                    fames fames ipsum dis ligula. Placerat viverra urna auctor adipiscing dapibus
                    pharetra torquent etiam nunc. Platea torquent habitasse semper auctor volutpat
                    lectus ridiculus et.
                  </ListIosItemBodyLeftLabel>
                </ListIosItemBody>
              </ListIosItemBodyLeft>
            </ListIosItem>
            <ListIosItem>
              <ListIosItemBodyLeft>
                <ListIosItemBody>
                  <ListIosItemBodyLeftLabel>Label</ListIosItemBodyLeftLabel>
                </ListIosItemBody>
              </ListIosItemBodyLeft>
            </ListIosItem>
            <ListIosItem variant="accent">
              <ListIosItemBodyLeft>
                <ListIosItemBody>
                  <ListIosItemBodyLeftLabel>Label</ListIosItemBodyLeftLabel>
                </ListIosItemBody>
              </ListIosItemBodyLeft>
            </ListIosItem>
            <ListIosItem variant="destructive">
              <ListIosItemBodyLeft>
                <ListIosItemBody>
                  <ListIosItemBodyLeftLabel>Label</ListIosItemBodyLeftLabel>
                </ListIosItemBody>
              </ListIosItemBodyLeft>
            </ListIosItem>
            <ListIosItem variant="placeholder">
              <ListIosItemBodyLeft>
                <ListIosItemBody>
                  <ListIosItemBodyLeftLabel>Label</ListIosItemBodyLeftLabel>
                </ListIosItemBody>
              </ListIosItemBodyLeft>
            </ListIosItem>
          </ListIos>
        </section>
        <section class={s.section}>
          <ListIos
            title="Two-liners"
            footer="Here goes some examples of list items with only 2 lines"
          >
            <ListIosItem lines={2}>
              <ListIosItemBodyLeft>
                <ListIosItemBody>
                  <ListIosItemBodyLeftLabel>
                    Lorem ipsum odor amet, consectetuer adipiscing elit. Erat commodo lobortis nulla
                    fames fames ipsum dis ligula. Placerat viverra urna auctor adipiscing dapibus
                    pharetra torquent etiam nunc. Platea torquent habitasse semper auctor volutpat
                    lectus ridiculus et.
                  </ListIosItemBodyLeftLabel>
                  <ListIosItemBodyLeftSubtitle>
                    Lorem ipsum odor amet, consectetuer adipiscing elit. Erat commodo lobortis nulla
                    fames fames ipsum dis ligula. Placerat viverra urna auctor adipiscing dapibus
                    pharetra torquent etiam nunc. Platea torquent habitasse semper auctor volutpat
                    lectus ridiculus et.
                  </ListIosItemBodyLeftSubtitle>
                </ListIosItemBody>
              </ListIosItemBodyLeft>
            </ListIosItem>
            <ListIosItem lines={2}>
              <ListIosItemBodyLeft>
                <ListIosItemBody>
                  <ListIosItemBodyLeftLabel>Label</ListIosItemBodyLeftLabel>
                  <ListIosItemBodyLeftSubtitle>Subtitle</ListIosItemBodyLeftSubtitle>
                </ListIosItemBody>
              </ListIosItemBodyLeft>
            </ListIosItem>
            <ListIosItem lines={2}>
              <ListIosItemBodyLeft>
                <ListIosItemBody>
                  <ListIosItemBodyLeftLabel medium>Label medium weight</ListIosItemBodyLeftLabel>
                  <ListIosItemBodyLeftSubtitle>Subtitle</ListIosItemBodyLeftSubtitle>
                </ListIosItemBody>
              </ListIosItemBodyLeft>
            </ListIosItem>
            <ListIosItem lines={2} reversed>
              <ListIosItemBodyLeft>
                <ListIosItemBody>
                  <ListIosItemBodyLeftLabel>Reversed Label</ListIosItemBodyLeftLabel>
                  <ListIosItemBodyLeftSubtitle>Reversed subtitle</ListIosItemBodyLeftSubtitle>
                </ListIosItemBody>
              </ListIosItemBodyLeft>
            </ListIosItem>
          </ListIos>
        </section>
        <section class={s.section}>
          <ListIos title="Settings">
            <ListIosItem>
              <ListIosItemLeft>
                <Notifications30 color="#FF3B30"/>
              </ListIosItemLeft>
              <ListIosItemBodyLeft>
                <ListIosItemBody>
                  <ListIosItemBodyLeftLabel>Notifications</ListIosItemBodyLeftLabel>
                </ListIosItemBody>
              </ListIosItemBodyLeft>
            </ListIosItem>
            <ListIosItem>
              <ListIosItemLeft>
                <Apps30 color="#007AFF"/>
              </ListIosItemLeft>
              <ListIosItemBodyLeft>
                <ListIosItemBody>
                  <ListIosItemBodyLeftLabel>Apps</ListIosItemBodyLeftLabel>
                </ListIosItemBody>
              </ListIosItemBodyLeft>
            </ListIosItem>
            <ListIosItem>
              <ListIosItemLeft>
                <Announcements30 color="#32ADE6"/>
              </ListIosItemLeft>
              <ListIosItemBodyLeft>
                <ListIosItemBody>
                  <ListIosItemBodyLeftLabel>Announcements</ListIosItemBodyLeftLabel>
                </ListIosItemBody>
              </ListIosItemBodyLeft>
            </ListIosItem>
            <ListIosItem>
              <ListIosItemLeft>
                <TouchID30 color="#FF2D55"/>
              </ListIosItemLeft>
              <ListIosItemBodyLeft>
                <ListIosItemBody>
                  <ListIosItemBodyLeftLabel>Touch ID</ListIosItemBodyLeftLabel>
                </ListIosItemBody>
              </ListIosItemBodyLeft>
            </ListIosItem>
          </ListIos>
        </section>
        <section class={s.section}>
          <ListIos title="With image">
            <ListIosItem lines={2}>
              <ListIosItemLeft>
                <img src={image}/>
              </ListIosItemLeft>
              <ListIosItemBodyLeft>
                <ListIosItemBody>
                  <ListIosItemBodyLeftLabel>NFT Pig</ListIosItemBodyLeftLabel>
                  <ListIosItemBodyLeftSubtitle>
                    Buy this one to unlock additional features
                  </ListIosItemBodyLeftSubtitle>
                </ListIosItemBody>
              </ListIosItemBodyLeft>
            </ListIosItem>
          </ListIos>
        </section>
        <section class={s.section}>
          <ListIos title="Other">
            <ListIosItem lines={2} clickable>
              <ListIosItemBodyLeft>
                <ListIosItemBody>
                  <ListIosItemBodyLeftLabel>Do Not Translate</ListIosItemBodyLeftLabel>
                  <ListIosItemBodyLeftSubtitle>Language to ignore</ListIosItemBodyLeftSubtitle>
                </ListIosItemBody>
                <ListIosItemBodyRight>
                  <ListIosItemBodyRightLabel>Russian</ListIosItemBodyRightLabel>
                  <ListIosItemBodyRightChevron/>
                </ListIosItemBodyRight>
              </ListIosItemBodyLeft>
            </ListIosItem>
            <ListIosItem lines={2} clickable>
              <ListIosItemBodyLeft>
                <ListIosItemBody>
                  <ListIosItemBodyLeftLabel>Notifications</ListIosItemBodyLeftLabel>
                  <ListIosItemBodyLeftSubtitle>Application notification settings</ListIosItemBodyLeftSubtitle>
                </ListIosItemBody>
                <ListIosItemBodyRight>
                  <ListIosItemRightCounter>2</ListIosItemRightCounter>
                  <ListIosItemBodyRightChevron/>
                </ListIosItemBodyRight>
              </ListIosItemBodyLeft>
            </ListIosItem>
          </ListIos>
        </section>
      </main>
    );
  },
};
