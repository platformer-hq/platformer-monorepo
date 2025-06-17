# @mini-apps/telegram-bridge

[code-badge]: https://img.shields.io/badge/source-black?logo=github

[docs-badge]: https://img.shields.io/badge/documentation-blue?logo=gitbook&logoColor=white

[link]: https://github.com/platformer-hq/platformer-monorepo/tree/master/mini-apps/telegram-bridge

[docs-link]: https://docs.mini-apps.store/packages/mini-apps-telegram-bridge

[npm-link]: https://npmjs.com/package/@mini-apps/telegram-bridge

[npm-badge]: https://img.shields.io/npm/v/@mini-apps/telegram-bridge?logo=npm

[size-badge]: https://img.shields.io/bundlephobia/minzip/@mini-apps/telegram-bridge

[![NPM][npm-badge]][npm-link]
![Size][size-badge]
[![docs-badge]][docs-link]
[![code-badge]][link]

The lowest level communication layer with Telegram Mini Apps.

This package provides fundamental utilities and types for developing applications on the Telegram Mini Apps platform.

While a developer can use this package alone, it's recommended to use a higher-level package
like [@mini-apps/telegram-sdk](https://docs.mini-apps.store/packages/mini-apps-telegram-sdk).

## Installation

```bash
pnpm i @mini-apps/telegram-bridge
# or
npm i @mini-apps/telegram-bridge
# or
yarn add @mini-apps/telegram-bridge
```

## Usage

Here’s a basic example of how to use this package. For more details, refer to the package complete
[documentation](https://docs.mini-apps.store/packages/mini-apps-telegram-bridge).

```ts
import { on, postEvent } from '@mini-apps/telegram-bridge';

// Show the back button, wait for it to be clicked once, then hide it.
postEvent('web_app_setup_back_button', { is_visible: true });

const off = on('back_button_pressed', () => {
  postEvent('web_app_setup_back_button', { is_visible: false });
  off();
});
```