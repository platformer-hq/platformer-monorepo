import { openLink, openTelegramLink } from '@tma.js/sdk-vue';

/**
 * Opens the link using the appropriate method.
 */
export function openAnyLink(link: string) {
  if (link.startsWith('https://t.me')) {
    openTelegramLink(link);
  } else {
    openLink(link);
  }
}
