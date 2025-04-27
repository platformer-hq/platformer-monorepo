import { TypographyIos } from 'ui';
import { translator } from '@solid-primitives/i18n';
import { openTelegramLink } from '@telegram-apps/sdk-solid';

import { useMainContext } from '@/providers/MainProvider.js';

import './Disclaimer.scss';

const translations = {
  en: {
    prefix: 'Works on',
    suffix: 'Platformer',
  },
  ru: {
    prefix: 'Работает на',
    suffix: 'Платформере',
  },
};

export function Disclaimer() {
  const { locale } = useMainContext();
  const t = translator(() => translations[locale]);
  const link = 'https://t.me/platformer_hq';

  return (
    <TypographyIos class="disclaimer" variant="footnote">
      {t('prefix')}&nbsp;
      <a
        class="disclaimer__link"
        href={link}
        onClick={e => {
          e.preventDefault();
          openTelegramLink(link);
        }}
      >
        {t('suffix')}
      </a>
    </TypographyIos>
  );
}