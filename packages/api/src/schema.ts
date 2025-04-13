export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  Date: { input: string; output: string; }
};

/** Application information. This object can only be returned in case, current user is a member of it. */
export type App = {
  __typename?: 'App';
  /** Short description. */
  description?: Maybe<Scalars['String']['output']>;
  /** Public identifier. */
  id: Scalars['Int']['output'];
  /** List of management invites. */
  managementInvites: Array<AppManagementInvite>;
  /** List of managers. */
  managers: Array<AppManager>;
  /** Visibility level. */
  privacy: AppPrivacy;
  /**
   * Secret key, used to sign launch parameters.
   *
   * This value may be omitted if the current user has not enough access rights
   * to request this kind of data.
   */
  secretKey?: Maybe<Scalars['String']['output']>;
  /** Bound Telegram Bot identifier. */
  telegramBotID?: Maybe<Scalars['Int']['output']>;
  /**
   * URL to be opened in the Telegram application.
   *
   * This value may be omitted if there is no URL for the platform, specified in the launch parameters.
   *
   * If `isExternal` == `true`, the server will use the application ID to determine if
   * the init data signature is correct.
   *
   * If `reSignInitData` == `true`, the server will re-sign the init data using the application's
   * secret key.
   */
  telegramURL?: Maybe<Scalars['String']['output']>;
  /** List of test groups. */
  testGroups: Array<AppTestGroup>;
  /** Localized title. */
  title: Scalars['String']['output'];
  /** List of URLs for the each platform. */
  urls: Array<AppUrl>;
};


/** Application information. This object can only be returned in case, current user is a member of it. */
export type AppTelegramUrlArgs = {
  isExternal?: InputMaybe<Scalars['Boolean']['input']>;
  launchParams: Scalars['String']['input'];
  reSignInitData?: InputMaybe<Scalars['Boolean']['input']>;
};

export type AppManagementInvite = {
  __typename?: 'AppManagementInvite';
  /** Connected application. */
  app: App;
  /** User who was invited. */
  from: User;
  /** Invite identifier. */
  id: Scalars['Int']['output'];
  /** Invite role. */
  role: AppManagementInviteRole;
  /** Invite initiator. */
  to: User;
};

export enum AppManagementInviteRole {
  /** Provides the application write access. */
  Admin = 'ADMIN',
  /** Provides the application read access. */
  Member = 'MEMBER'
}

export type AppManager = {
  __typename?: 'AppManager';
  /** User role in the application. */
  role: AppRole;
  /** User information. */
  user: User;
};

export enum AppPrivacy {
  /** Application is visible only to application managers. */
  Hidden = 'HIDDEN',
  /** Application is visible to all users. */
  Visible = 'VISIBLE'
}

export enum AppRole {
  /** Provides the application write access. */
  Admin = 'ADMIN',
  /** Provides the application read access. */
  Member = 'MEMBER',
  /** Application owner role. */
  Owner = 'OWNER'
}

export type AppTestGroup = {
  __typename?: 'AppTestGroup';
  /** Is this test group currently active. */
  enabled: Scalars['Boolean']['output'];
  /** Test group identifier. */
  id: Scalars['Int']['output'];
  /** Test group platform. */
  platform: Platform;
  /** Test group title. */
  title: Scalars['String']['output'];
  /** URL used for this test group. */
  url: Scalars['String']['output'];
  /** List of users in this test group. */
  users: Array<User>;
};

export type AppUrl = {
  __typename?: 'AppURL';
  /** Platform. */
  platform: Platform;
  /** URL to be opened. */
  url: Scalars['String']['output'];
};

/** Current user object. */
export type CurrentUser = {
  __typename?: 'CurrentUser';
  /** Managed applications. */
  apps: Array<UserManagedApp>;
  /** User's Platformer identifier. */
  id: Scalars['Int']['output'];
  /** Application management invites. */
  managementInvites: Array<AppManagementInvite>;
  /** User's name every other user sees. */
  name: Scalars['String']['output'];
  /** User Telegram-related information. */
  telegramData?: Maybe<UserTelegramData>;
};

export type Health = {
  __typename?: 'Health';
  /** Is the project DB connected. */
  dbConnected: Scalars['Boolean']['output'];
};

export type Image = {
  __typename?: 'Image';
  scales: Array<ImageScale>;
};

export type ImageScale = {
  __typename?: 'ImageScale';
  scale: Scalars['Int']['output'];
  url: Scalars['String']['output'];
};

export type InputAppUrl = {
  /** Platform identifier. */
  platformID: Scalars['Int']['input'];
  /** URL to set. */
  url: Scalars['String']['input'];
};

export type Jwt = {
  __typename?: 'JWT';
  /** Date, when the token expires. */
  expiresAt: Scalars['Date']['output'];
  /** Token value. */
  token: Scalars['String']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  /**
   * Performs authentication using Telegram Mini App init data. If appID is missing,
   * the server considers this authentication as being performed using the main Platformer mini app.
   *
   * Returns a JSON Web Token used in all other resolvers.
   */
  authenticateTelegram: Jwt;
  /** Creates a new application on behalf of the user. */
  createApp: App;
  /** Invites a user to manage the application. */
  createAppManagementInvite: AppManagementInvite;
  /** Creates a new application test group. */
  createAppTestGroup: AppTestGroup;
  /** Deletes the app using its identifier. */
  deleteApp: Scalars['Boolean']['output'];
  /** Deletes the application test group. */
  deleteAppTestGroup: Scalars['Boolean']['output'];
  /** Deletes the user from the application managers. */
  removeAppManager: Scalars['Boolean']['output'];
  /** Responds to the application management invite. */
  respondAppManagementInvite: Scalars['Boolean']['output'];
  /** Revokes previously created application management invite. */
  revokeAppManagementInvite: Scalars['Boolean']['output'];
  /** Updates basic application information. */
  updateApp: App;
  /** Updates application management invite. */
  updateAppManagementInvite: AppManagementInvite;
  /** Updates an application manager role. */
  updateAppManagerRole: AppManager;
  /** Updates the application test group. */
  updateAppTestGroup: AppTestGroup;
};


export type MutationAuthenticateTelegramArgs = {
  appID?: InputMaybe<Scalars['Int']['input']>;
  initData: Scalars['String']['input'];
};


export type MutationCreateAppArgs = {
  title: Scalars['String']['input'];
};


export type MutationCreateAppManagementInviteArgs = {
  appID: Scalars['Int']['input'];
  role: AppManagementInviteRole;
  userID: Scalars['Int']['input'];
};


export type MutationCreateAppTestGroupArgs = {
  appID: Scalars['Int']['input'];
  enabled?: InputMaybe<Scalars['Boolean']['input']>;
  platformID: Scalars['Int']['input'];
  title?: InputMaybe<Scalars['String']['input']>;
  url: Scalars['String']['input'];
  userIDs: Array<Scalars['Int']['input']>;
};


export type MutationDeleteAppArgs = {
  appID: Scalars['Int']['input'];
};


export type MutationDeleteAppTestGroupArgs = {
  testGroupID: Scalars['Int']['input'];
};


export type MutationRemoveAppManagerArgs = {
  appID: Scalars['Int']['input'];
  userID: Scalars['Int']['input'];
};


export type MutationRespondAppManagementInviteArgs = {
  accept: Scalars['Boolean']['input'];
  inviteID: Scalars['Int']['input'];
};


export type MutationRevokeAppManagementInviteArgs = {
  inviteID: Scalars['Int']['input'];
};


export type MutationUpdateAppArgs = {
  appID: Scalars['Int']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  privacy?: InputMaybe<AppPrivacy>;
  secretKey?: InputMaybe<Scalars['Boolean']['input']>;
  telegramBotID?: InputMaybe<Scalars['Int']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  urls?: InputMaybe<Array<InputAppUrl>>;
};


export type MutationUpdateAppManagementInviteArgs = {
  inviteID: Scalars['Int']['input'];
  role: AppManagementInviteRole;
};


export type MutationUpdateAppManagerRoleArgs = {
  appID: Scalars['Int']['input'];
  role: AppManagementInviteRole;
  userID: Scalars['Int']['input'];
};


export type MutationUpdateAppTestGroupArgs = {
  enabled?: InputMaybe<Scalars['Boolean']['input']>;
  platformID?: InputMaybe<Scalars['Int']['input']>;
  testGroupID: Scalars['Int']['input'];
  title?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
  userIDs?: InputMaybe<Array<Scalars['Int']['input']>>;
};

export type Platform = {
  __typename?: 'Platform';
  /** Platform identifier. */
  id: Scalars['Int']['output'];
  /** Platform original name (identifier). */
  name: Scalars['String']['output'];
  /** Localized platform title. */
  title: Scalars['String']['output'];
  /** Platform vendor. */
  vendor: PlatformVendor;
};

export type PlatformVendor = {
  __typename?: 'PlatformVendor';
  /** Unique identifier. */
  id: Scalars['Int']['output'];
  /** Unique name. */
  name: Scalars['String']['output'];
  /** Localized title. */
  title: Scalars['String']['output'];
};

export type Query = {
  __typename?: 'Query';
  /** Application information. */
  app?: Maybe<App>;
  /**
   * URL to be opened in the Telegram application.
   * This value may be omitted if there is no URL for the platform, specified in the launch parameters.
   */
  appTelegramURL?: Maybe<Scalars['String']['output']>;
  /** Current user information. */
  currentUser: CurrentUser;
  /** List of all supported platforms. */
  platforms: Array<Platform>;
  /** Searches users by the specified input. */
  searchUsers: Array<User>;
};


export type QueryAppArgs = {
  appID: Scalars['Int']['input'];
};


export type QueryAppTelegramUrlArgs = {
  appID: Scalars['Int']['input'];
  launchParams: Scalars['String']['input'];
};


export type QuerySearchUsersArgs = {
  text: Scalars['String']['input'];
};

export type User = {
  __typename?: 'User';
  /** Platformer user unique identifier. */
  id: Scalars['Int']['output'];
  /** User's profile image. */
  image?: Maybe<Image>;
  /** Display name. */
  name: Scalars['String']['output'];
  /** User's Telegram profile data. */
  telegramData?: Maybe<UserTelegramData>;
};

export type UserManagedApp = {
  __typename?: 'UserManagedApp';
  /** Application information. */
  app: App;
  /** User role in this application. */
  role: AppRole;
};

export type UserTelegramData = {
  __typename?: 'UserTelegramData';
  /** User's profile image. */
  avatar?: Maybe<Image>;
  /** User's first name. */
  firstName: Scalars['String']['output'];
  /** Telegram unique identifier. */
  id?: Maybe<Scalars['Int']['output']>;
  /** User's last name. */
  lastName?: Maybe<Scalars['String']['output']>;
  /** User's username. */
  login?: Maybe<Scalars['String']['output']>;
};
