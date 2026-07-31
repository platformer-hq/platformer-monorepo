import fs from 'node:fs';
import path from 'node:path';
import * as v from 'valibot';

type TokenDescription = (
  | { kind: 'color'; color: string }
  | { kind: 'reference'; reference: string }
);

function resolve(...p: string[]) {
  return path.resolve(import.meta.dirname, ...p);
}

function resolveFromRoot(...p: string[]) {
  return resolve('../..', ...p);
}

function formatTokenName(key: string): string {
  return key
    .replaceAll('_', '-')
    .replace('[deprecated]', '')
    .trim()
    .split('')
    .map((letter, idx) => {
      if (letter.match(/^[a-z]$/i) && letter.toUpperCase() === letter) {
        return (idx ? '-' : '') + letter.toLowerCase();
      }
      return letter;
    })
    .join('');
}

function sortAlphabetical(values: string[]) {
  return [...values].sort((a, b) => a.localeCompare(b));
}

const ignoredTokens = ['secondary_accent_color', 'accent-orange', 'accent-yellow'];
const ignoredCategories = ['Telegram'];
const externalCssTokens = [
  'bg_color',
  'text_color',
  'hint_color',
  'link_color',
  'button_text_color',
  'button_color',
  'secondary_bg_color',
  'header_bg_color',
  'section_bg_color',
  'accent_text_color',
  'subtitle_text_color',
  'section_header_text_color',
  'destructive_text_color',
  'section_separator_color',
  'bottom_bar_bg_color',
].map(formatTokenName);
const tokensSettings: Record<string, {
  /**
   * Dark theme file path.
   */
  dark: string;
  /**
   * Light theme file path.
   */
  light: string;
  /**
   * Tokens to add each theme.
   */
  addTokens?: Record<string, {
    category: string;
    dark: string;
    light: string;
  }>;
  /**
   * Replace tokens.
   */
  replaceTokens?: Record<string, {
    dark?: string;
    light?: string;
  }>;
}> = {
  android: {
    dark: resolveFromRoot('tokens/android/Dark.tokens.json'),
    light: resolveFromRoot('tokens/android/Light.tokens.json'),
    addTokens: {
      'primary-fill-background': {
        category: 'Custom',
        dark: '#7B7B7B5B',
        light: '#7A7A7A33',
      },
    },
    replaceTokens: {
      'button-destructive-color': {
        dark: '#EE686F19',
      },
      'separator-non-opaque': {
        dark: '#545458A6',
      },
    },
  },
  ios: {
    dark: resolveFromRoot('tokens/ios/Dark.tokens.json'),
    light: resolveFromRoot('tokens/ios/Light.tokens.json'),
  },
};

const collected: {
  [platform: string]: {
    [theme: string]: {
      [category: string]: {
        [token: string]: TokenDescription;
      };
    };
  };
} = {};
const collectedCssTokens = new Set<string>();

const registerCssToken = ({ category, key, platform, theme, value }: {
  platform: string;
  theme: string;
  category: string;
  key: string;
  value: TokenDescription;
}) => {
  collected[platform] ||= {};
  collected[platform][theme] ||= {};
  collected[platform][theme][category] ||= {};
  if (key in collected[platform][theme][category]) {
    throw new Error(`Duplicate token "${key}" in ${platform}.${theme}`);
  }
  collected[platform][theme][category][key] = value;
  collectedCssTokens.add(key);
};

//#region Collecting tokens information.
for (const platform in tokensSettings) {
  collected[platform] = {};

  const themeSettings = tokensSettings[platform as keyof typeof tokensSettings]!;
  const themes = {
    dark: themeSettings.dark,
    light: themeSettings.light,
  };
  for (const themeName in themes) {
    const json = v.parse(
      v.record(
        v.string(),
        v.record(
          v.pipe(v.string(), v.transform(formatTokenName)),
          v.union([
            v.string(),
            v.looseObject({
              $type: v.literal('color'),
              $value: v.union([
                v.pipe(v.string(), v.transform(input => {
                  const match = input.match(/{Telegram\.(.+)}/);
                  if (!match || !externalCssTokens.includes(formatTokenName(match[1]!))) {
                    throw new Error(`Unable to infer referenced variable from "${input}"`);
                  }
                  return { kind: 'reference' as const, reference: formatTokenName(match[1]!) };
                })),
                v.pipe(
                  v.looseObject({
                    hex: v.pipe(v.string(), v.hexColor()),
                    alpha: v.pipe(v.number(), v.minValue(0), v.maxValue(1)),
                  }),
                  v.transform(input => ({
                    kind: 'color' as const,
                    color: input.hex + Math
                      .trunc(input.alpha * 255)
                      .toString(16)
                      .toUpperCase()
                      .padStart(2, '0')
                      .replace('FF', ''),
                  })),
                ),
              ]),
            }),
          ]),
        ),
      ),
      JSON.parse(fs.readFileSync(themes[themeName as keyof typeof themes], 'utf-8')),
    );
    collected[platform][themeName] = {};

    for (const token in themeSettings.addTokens) {
      registerCssToken({
        platform,
        theme: themeName,
        category: themeSettings.addTokens[token]!.category,
        key: token,
        value: {
          kind: 'color',
          color: themeSettings.addTokens[token]![themeName as 'dark' | 'light'],
        },
      });
    }

    for (const categoryName in json) {
      if (categoryName.startsWith('$') || ignoredCategories.includes(categoryName)) {
        continue;
      }
      collected[platform][themeName][categoryName] ||= {};
      const colors = json[categoryName as keyof typeof json];
      for (const token in colors) {
        if (ignoredTokens.includes(token)) {
          continue;
        }
        const tokenMeta = colors[token as keyof typeof colors]!;
        if (typeof tokenMeta === 'string') {
          continue;
        }
        const override = themeSettings.replaceTokens?.[token]?.[themeName as 'dark' | 'light'];
        registerCssToken({
          platform,
          theme: themeName,
          category: categoryName,
          key: token,
          value: override
            ? { kind: 'color', color: override }
            : tokenMeta.$value,
        });
      }
    }
  }
}
//#endregion

//#region Checking tokens consistency across all themes.
const themesCssTokens: {
  platform: string;
  theme: string;
  tokens: Set<string>;
}[] = [];

for (const platform in collected) {
  const themes = collected[platform as keyof typeof collected];
  for (const theme in themes) {
    const categories = themes[theme as keyof typeof themes];
    const themeCssTokens = new Set<string>();

    for (const category in categories) {
      const tokens = categories[category as keyof typeof categories];
      for (const token in tokens) {
        themeCssTokens.add(token);
      }
    }
    themesCssTokens.push({
      platform,
      theme,
      tokens: themeCssTokens,
    });
  }
}

themesCssTokens.forEach(({ platform, theme, tokens }) => {
  collectedCssTokens.forEach(collected => {
    if (!tokens.has(collected)) {
      console.warn(`"${platform}.${theme}" is missing "${collected}" token from the pool of all collected tokens`);
    }
  });
});

//#endregion

//#region Generating SCSS and TS files.
const contentPlatforms: string[] = [];

for (const platform in collected) {
  const themes = collected[platform];
  const platformLines: string[] = [
    `:root[data-platform="${platform}"] {`,
  ];
  const platformThemes: string[] = [];
  for (const theme in themes) {
    const categories = themes[theme];
    const themeLines: string[] = [
      `${' '.repeat(2)}&[data-theme="${theme}"] {`,
    ];
    for (const category in categories) {
      if (category.startsWith('$')) {
        continue;
      }
      const categoryLines: string[] = [`// #region ${category}.`];
      const tokens = categories[category]!;

      Object
        .entries(tokens)
        .sort(([a], [b]) => a.localeCompare(b))
        .forEach(([token, tokenMeta]) => {
          categoryLines.push(`--${token}: ` + (
            tokenMeta.kind === 'color' ? tokenMeta.color : `var(--${tokenMeta.reference})`
          ) + ';');
        });
      categoryLines.push('// #endregion');
      themeLines.push(categoryLines.map(v => ' '.repeat(4) + v).join('\n'));
    }
    themeLines.push(`${' '.repeat(2)}}`);
    platformThemes.push(themeLines.join('\n'));
  }
  platformLines.push(platformThemes.join('\n\n'), '}');
  contentPlatforms.push(platformLines.join('\n'));
}

fs.writeFileSync(resolveFromRoot('app/assets/generated.scss'), contentPlatforms.join('\n\n'));

const allCssTokens = sortAlphabetical([...collectedCssTokens.values(), ...externalCssTokens]);
fs.writeFileSync(
  resolveFromRoot('app/generated.ts'),
  [
    '// THIS FILE WAS AUTOGENERATED VIA SCRIPT. DO NOT EDIT.',
    '/* eslint-disable */',
    'export type KnownCssColorToken = (',
    ...allCssTokens.map(token => `  | '${token}'`),
    ');\n',
    'export const knownCssColorTokensSet: Set<KnownCssColorToken> = new Set([',
    ...allCssTokens.map(token => `  '${token}',`),
    ']);\n',
  ].join('\n'),
);
//#endregion
