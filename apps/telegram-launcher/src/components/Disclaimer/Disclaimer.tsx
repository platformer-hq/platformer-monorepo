import { TypographyIos } from 'ui';
import { openTelegramLink } from '@telegram-apps/sdk-solid';

import { useTranslator } from '@/providers/MainProvider.js';

import './Disclaimer.scss';

export function Disclaimer() {
  const t = useTranslator({
    en: {
      prefix: 'Works on',
      suffix: 'Platformer',
    },
    ru: {
      prefix: 'Работает на',
      suffix: 'Платформере',
    },
  });
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