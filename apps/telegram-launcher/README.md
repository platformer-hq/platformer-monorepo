# Platformer Telegram Launcher

A launcher for running [Platformer](https://t.me/platformer_hq) applications directly inside
Telegram.

## Options

The list of options you may use to configure the launcher. All options should be passed as a list of
query parameters to the launcher's base URL.

| Name           | Type     | Description                                                                                                                                                                                                                                                             |
|----------------|----------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `app_id`       | `number` | Your Platformer application identifier you can get in the admin panel.                                                                                                                                                                                                  |
| `api_base_url` | `string` | _Optional_. Platformer API base URL. It will be used to communicate with Platformer functionality.                                                                                                                                                                      |
| `fallback_url` | `string` | _Optional_. URL to use if something goes wrong with Platformer. Ensures the user can still access the application even if Platformer is unavailable.                                                                                                                    |
| `init_timeout` | `number` | _Optional_. Time in milliseconds to load data from Platformer. If the timeout is reached, the launcher uses the `fallback_url` to display the application. If the fallback URL is not specified, the load error page will be displayed. Defaults to `5000` (5 seconds). |
| `load_timeout` | `number` | _Optional_. Time in milliseconds for **your** application to load. If the specified time runs out, the launcher displays a load error. Defaults to `10000` (10 seconds).                                                                                                |

## Debugging

The launcher allows enabling debug features using the Telegram Mini
Apps [start parameter](https://docs.telegram-mini-apps.com/platform/start-parameter).

| Name      | Description                                                                                                                                                                                                       |
|-----------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `p-debug` | Enables debug mode outputting useful logs into the console.                                                                                                                                                       |
| `p-eruda` | Displays the [eruda](http://npmjs.com/package/eruda) console. Note, that enabling it will lead to downloading eruda first, and then the whole application. So, use it for development or debugging purposes only. |

The launcher just checks if there are strings specified above in the start parameter, so you can pass them in any
format preferred.

Here is a complete example of a valid link enabling all features:

```
https://t.me/bot/app?start=p-debug_p-eruda
// or
https://t.me/bot?startapp=p-debug_p-eruda
```

## Usage

To start using the launcher, take its base URL (`https://tgl.mini-apps.store/`) and append the
following [options](#options) as a list of query parameters.

For example, if you have a Platformer application with the identifier `10` and a `fallback_url` set
to `https://walletbot.me/app`, the complete URL would be:

```
https://tgl.mini-apps.store/?app_id=10&fallback_url=https%3A%2F%2Fwalletbot.me%2Fapp
```

Once you have the final URL, use it when creating a Mini App
in [@BotFather](https://t.me/botfather). When opening your application, the Telegram client will
load the URL specified above.

## How It Works

The launcher workflow is straightforward.

### 1. Read and Validate [Options](#options)

The launcher reads and validates the options, ensuring they are correct. If something is invalid,
the launcher will display an error page.

### 2. Authenticate the User

The launcher extracts the user's Platformer authorization token to communicate with its API. If the
token is missing, it performs the authentication process and saves the token locally.

### 3. Retrieve Application Data

The launcher retrieves the application information using the `app_id` option.

Once the data is retrieved, it displays one of the following screens:

1. A message indicating that your application is unavailable for any reason. It can either be some error, a missing URL
   for the current platform, or even the application security settings.
2. Your application itself, if any URL was returned from the Platformer's server.

### 4. Render the Application

The launcher inserts an `iframe` with the URL returned from Platformer. This URL represents the one
you set in the admin panel, along with the launch parameters originally passed to the Mini App.

After inserting the iframe, the launcher waits for the number of milliseconds specified in
the `load_timeout` option until the [web_app_ready](https://docs.telegram-mini-apps.com/platform/methods#web-app-ready)
method was called by your application.

Unlike Telegram, to prevent uncontrollable behavior, Platformer does not automatically display the application when all
assets are loaded. Therefore, calling the `web_app_ready` method is required.

## Security Concerns

Security is one of Platformer's most important aspects.

Platformer uses local storage solely to store its authorization token. It does not use Telegram's
Cloud Storage or any other storage, as Platformer cannot guarantee that data stored there cannot be
reused. This approach prevents other applications from stealing and using the token.

You may not realize it, but the Platformer launcher handles the most critical, important, and
sensitive type of data an app can
have—[init data](https://docs.telegram-mini-apps.com/platform/init-data). To ensure developers do
not worry about Platformer misusing this data (e.g., impersonating a user in their applications),
the launcher removes the `hash` property from the init data, preventing Platformer from using it
elsewhere.

Instead, Platformer leverages a recently added feature
called [Third-Party Validation](https://docs.telegram-mini-apps.com/platform/init-data#using-telegram-public-key),
which allows third-party projects to validate init data using the `signature` property. Thanks to
this feature, Platformer only requires you to specify your Bot's identifier in the admin panel for
your Mini App.

## Troubleshooting

### Application Failed to Load Due to Timeout

Your application may fail to display for one of the following reasons:

- **Low download speed** – Your server took too long to load the application assets.
- **Required method not called** – Your application didn’t call
  the [web_app_ready](https://docs.telegram-mini-apps.com/platform/methods#web-app-ready) method.
- **Incompatible SDK** – Platformer doesn’t support **Telegram SDK** or **@telegram-apps/sdk** version 2 or earlier due
  to incorrect implementation of communication between mini apps and Telegram clients. However,
  using [@telegram-apps/sdk@3](https://docs.telegram-mini-apps.com/packages/telegram-apps-sdk/3-x) should resolve this
  issue.

## Environment Support

[//]: # (TODO)
TBA