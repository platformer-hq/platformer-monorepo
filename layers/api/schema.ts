/* eslint-disable */
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
  Time: { input: string; output: string; }
};

/** Application information. This object can only be returned in case, current user is a member of it. */
export type App = {
  __typename?: 'App';
  /** The current user role in this application. */
  currentUserRole: AppRole;
  /** Short description. */
  description?: Maybe<Scalars['String']['output']>;
  /** Public identifier. */
  id: Scalars['ID']['output'];
  /** Application limits. */
  limits: AppLimits;
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
  /** The currently active application subscription. */
  subscription?: Maybe<AppSubscription>;
  /** Bound Telegram Bot identifier. */
  telegramBotID?: Maybe<Scalars['Int']['output']>;
  /** True if the Telegram launch parameters must be proxied. */
  telegramProxyLaunchParams: Scalars['Boolean']['output'];
  /** List of test groups. */
  testGroups: Array<AppTestGroup>;
  /** Localized title. */
  title: Scalars['String']['output'];
  /** Transfer request related to the current application. */
  transferRequest?: Maybe<AppTransferRequest>;
  /** List of URLs for the each platform. */
  urls: Array<AppUrl>;
  /** Date, when the URLs cache was reset. */
  urlsCacheResetAt?: Maybe<Scalars['Time']['output']>;
};

export type AppLimits = {
  __typename?: 'AppLimits';
  /** Maximum description length */
  maxDescriptionLength?: Maybe<Scalars['Int']['output']>;
  /** Maximum allowed active invites count for the application. */
  maxManagementInvitesCount?: Maybe<Scalars['Int']['output']>;
  /** Maximum allowed managers count. */
  maxManagersCount?: Maybe<Scalars['Int']['output']>;
  /** Maximum allowed test group title length. */
  maxTestGroupTitleLength?: Maybe<Scalars['Int']['output']>;
  /** Maximum allowed users count in test group. */
  maxTestGroupUsersCount?: Maybe<Scalars['Int']['output']>;
  /** Maximum allowed test groups. */
  maxTestGroupsCount?: Maybe<Scalars['Int']['output']>;
  /** Maximum title length. */
  maxTitleLength?: Maybe<Scalars['Int']['output']>;
  /** Max allowed application URL length. This value is used for both test groups and platform-specific URLs. */
  maxURLLength?: Maybe<Scalars['Int']['output']>;
};

export type AppManagementInvite = {
  __typename?: 'AppManagementInvite';
  /** Connected application. */
  app: App;
  /** User who was invited. */
  from: User;
  /** Invite identifier. */
  id: Scalars['ID']['output'];
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

export type AppSubscription = {
  __typename?: 'AppSubscription';
  /** True if the auto renewal is enabled. */
  autoRenewal: Scalars['Boolean']['output'];
  /** A date when the subscription ends. */
  endsAt: Scalars['Time']['output'];
};

export type AppTestGroup = {
  __typename?: 'AppTestGroup';
  /** Is this test group currently active. */
  enabled: Scalars['Boolean']['output'];
  /** Test group identifier. */
  id: Scalars['ID']['output'];
  /** Test group platforms. */
  platforms: Array<Platform>;
  /** Test group title. */
  title: Scalars['String']['output'];
  /** URL used for this test group. */
  url: Scalars['String']['output'];
  /** List of users in this test group. */
  users: Array<User>;
};

export type AppTransferRequest = {
  __typename?: 'AppTransferRequest';
  /** Transferred application. */
  app: App;
  /** Transfer initiator. */
  from: User;
  /** Request identifier. You can use it to decline or accept it. */
  id: Scalars['ID']['output'];
  /** Transfer receiver. */
  to: User;
};

export type AppUrl = {
  __typename?: 'AppURL';
  /** Platform. */
  platform: Platform;
  /** URL to be opened. */
  url: Scalars['String']['output'];
};

export type AppUrlExplanation = {
  __typename?: 'AppURLExplanation';
  /** An explanation why this URL exactly was chosen for the user. */
  explanation: AppUrlExplanationExplanation;
  /** Related platform. */
  platform: Platform;
  /** URL used to display the application to user. */
  url?: Maybe<Scalars['String']['output']>;
};

export type AppUrlExplanationExplanation = AppUrlSimpleExplanation | AppUrlTestGroupExplanation;

export type AppUrlSimpleExplanation = {
  __typename?: 'AppURLSimpleExplanation';
  kind: AppUrlSimpleExplanationKind;
};

export enum AppUrlSimpleExplanationKind {
  /** Application is private and the current user has no access to it. */
  AccessNotAllowed = 'ACCESS_NOT_ALLOWED',
  /** Application is public and everybody can open it. */
  AppIsPublic = 'APP_IS_PUBLIC',
  /** Application is private and the current user is its manager. */
  UserIsManager = 'USER_IS_MANAGER'
}

export type AppUrlTestGroupExplanation = {
  __typename?: 'AppURLTestGroupExplanation';
  /** Unique test group identifier. */
  id: Scalars['ID']['output'];
  /** Test group title. */
  title?: Maybe<Scalars['String']['output']>;
};

/** Current user object. */
export type CurrentUser = {
  __typename?: 'CurrentUser';
  /** List of application transfer requests directed to the current user. */
  appTransferRequests: Array<AppTransferRequest>;
  /** Managed applications. */
  apps: Array<UserManagedApp>;
  /** True if the current user can accept app transfers. */
  canAcceptAppTransfers: Scalars['Boolean']['output'];
  /** True if the current user can be invited to manage applications. */
  canBeInvitedToManage: Scalars['Boolean']['output'];
  /** User's Platformer identifier. */
  id: Scalars['ID']['output'];
  /** Limits, related to the current user. */
  limits: UserLimits;
  /** Application management invites sent to the current user. */
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
  platformID: Scalars['ID']['input'];
  /** URL to set. */
  url?: InputMaybe<Scalars['String']['input']>;
};

export type Jwt = {
  __typename?: 'JWT';
  /** Date, when the token expires. */
  expiresAt: Scalars['Time']['output'];
  /** Token value. */
  token: Scalars['String']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  /** Performs authentication using Telegram Mini App init data. Returns a JSON Web Token used in all other resolvers. */
  authenticateTelegram: Jwt;
  /** Creates a new application on behalf of the user. */
  createApp: App;
  /** Invites a user to manage the application. */
  createAppManagementInvite: AppManagementInvite;
  /** Creates a new Telegram invoice to upgrade the application */
  createAppSubTgInvoice: Scalars['String']['output'];
  /** Creates a new application test group. */
  createAppTestGroup: AppTestGroup;
  /** Creates an app transfer request. */
  createAppTransferRequest: AppTransferRequest;
  /** Deletes the app using its identifier. */
  deleteApp: Scalars['Boolean']['output'];
  /** Deletes the application test group. */
  deleteAppTestGroup: Scalars['Boolean']['output'];
  /** Deletes the user from the application managers. */
  removeAppManager: Scalars['Boolean']['output'];
  /** Responds to the application management invite. */
  respondAppManagementInvite: Scalars['Boolean']['output'];
  /** Responds to the application transfer request. */
  respondAppTransferRequest: Scalars['Boolean']['output'];
  /** Revokes previously created application management invite. */
  revokeAppManagementInvite: Scalars['Boolean']['output'];
  /** Revokes the application transfer request. */
  revokeAppTransferRequest: Scalars['Boolean']['output'];
  /** Updates basic application information. */
  updateApp: App;
  /** Updates application management invite. */
  updateAppManagementInvite: AppManagementInvite;
  /** Updates an application manager role. */
  updateAppManagerRole: AppManager;
  /** Sets the application subscription auto renewal state. */
  updateAppSubAutoRenewal?: Maybe<Scalars['Boolean']['output']>;
  /** Updates the application test group. */
  updateAppTestGroup: AppTestGroup;
  /** Updates the current user data. */
  updateCurrentUser: Scalars['Boolean']['output'];
};


export type MutationAuthenticateTelegramArgs = {
  initData: Scalars['String']['input'];
};


export type MutationCreateAppArgs = {
  title: Scalars['String']['input'];
};


export type MutationCreateAppManagementInviteArgs = {
  appID: Scalars['ID']['input'];
  role: AppManagementInviteRole;
  userID: Scalars['ID']['input'];
};


export type MutationCreateAppSubTgInvoiceArgs = {
  appID: Scalars['ID']['input'];
};


export type MutationCreateAppTestGroupArgs = {
  appID: Scalars['ID']['input'];
  enabled?: InputMaybe<Scalars['Boolean']['input']>;
  platformIDs?: InputMaybe<Array<Scalars['ID']['input']>>;
  title?: InputMaybe<Scalars['String']['input']>;
  url: Scalars['String']['input'];
  userIDs?: InputMaybe<Array<Scalars['ID']['input']>>;
};


export type MutationCreateAppTransferRequestArgs = {
  appID: Scalars['ID']['input'];
  toUserID: Scalars['ID']['input'];
};


export type MutationDeleteAppArgs = {
  appID: Scalars['ID']['input'];
};


export type MutationDeleteAppTestGroupArgs = {
  testGroupID: Scalars['ID']['input'];
};


export type MutationRemoveAppManagerArgs = {
  appID: Scalars['ID']['input'];
  userID: Scalars['ID']['input'];
};


export type MutationRespondAppManagementInviteArgs = {
  accept: Scalars['Boolean']['input'];
  inviteID: Scalars['ID']['input'];
};


export type MutationRespondAppTransferRequestArgs = {
  accept: Scalars['Boolean']['input'];
  requestID: Scalars['ID']['input'];
};


export type MutationRevokeAppManagementInviteArgs = {
  inviteID: Scalars['ID']['input'];
};


export type MutationRevokeAppTransferRequestArgs = {
  requestID: Scalars['ID']['input'];
};


export type MutationUpdateAppArgs = {
  appID: Scalars['ID']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  privacy?: InputMaybe<AppPrivacy>;
  secretKey?: InputMaybe<Scalars['Boolean']['input']>;
  telegramBotID?: InputMaybe<Scalars['Int']['input']>;
  telegramProxyLaunchParams?: InputMaybe<Scalars['Boolean']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  urls?: InputMaybe<Array<InputAppUrl>>;
  urlsCacheReset?: InputMaybe<Scalars['Boolean']['input']>;
};


export type MutationUpdateAppManagementInviteArgs = {
  inviteID: Scalars['ID']['input'];
  role: AppManagementInviteRole;
};


export type MutationUpdateAppManagerRoleArgs = {
  appID: Scalars['ID']['input'];
  role: AppManagementInviteRole;
  userID: Scalars['ID']['input'];
};


export type MutationUpdateAppSubAutoRenewalArgs = {
  appID: Scalars['ID']['input'];
  autoRenew: Scalars['Boolean']['input'];
};


export type MutationUpdateAppTestGroupArgs = {
  enabled?: InputMaybe<Scalars['Boolean']['input']>;
  platformIDs?: InputMaybe<Array<Scalars['ID']['input']>>;
  testGroupID: Scalars['ID']['input'];
  title?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
  urlRevision?: InputMaybe<Scalars['Boolean']['input']>;
  userIDs?: InputMaybe<Array<Scalars['ID']['input']>>;
};


export type MutationUpdateCurrentUserArgs = {
  canAcceptAppTransfers?: InputMaybe<Scalars['Boolean']['input']>;
  canBeInvitedToManage?: InputMaybe<Scalars['Boolean']['input']>;
};

export type Platform = {
  __typename?: 'Platform';
  /** Complete platform title including its vendor. */
  completeTitle: Scalars['String']['output'];
  /** Platform identifier. */
  id: Scalars['ID']['output'];
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
  id: Scalars['ID']['output'];
  /** Unique name. */
  name: Scalars['String']['output'];
  /** Localized title. */
  title: Scalars['String']['output'];
};

export type Query = {
  __typename?: 'Query';
  /** Application information. */
  app?: Maybe<App>;
  /** Application subscription purchase price in Telegram Stars. */
  appSubPurchaseTgPrice: Scalars['Int']['output'];
  /**
   * URL to be opened in the Telegram application. This value may be omitted if
   * there is no URL for the platform, specified in the launch parameters.
   */
  appTelegramURL?: Maybe<Scalars['String']['output']>;
  /** Retrieves application test group by its identifier. */
  appTestGroup: AppTestGroup;
  /** Current user information. */
  currentUser: CurrentUser;
  /** List of all supported platforms. */
  platforms: Array<Platform>;
  /** Searches for users. */
  searchUsers: Array<User>;
  /**
   * List of links related to the application and user going to open it. The resolver returns information
   * on which links will be used for which platforms with explanation.
   */
  userAppURLExplanations: Array<AppUrlExplanation>;
};


export type QueryAppArgs = {
  appID: Scalars['ID']['input'];
};


export type QueryAppTelegramUrlArgs = {
  appID: Scalars['ID']['input'];
  launchParams: Scalars['String']['input'];
};


export type QueryAppTestGroupArgs = {
  testGroupID: Scalars['ID']['input'];
};


export type QuerySearchUsersArgs = {
  canReceiveAppTransferReq?: InputMaybe<Scalars['Boolean']['input']>;
  canReceiveManagementInvite?: InputMaybe<Scalars['Boolean']['input']>;
  excludeUserIDs?: InputMaybe<Array<Scalars['ID']['input']>>;
  page: Scalars['Int']['input'];
  text: Scalars['String']['input'];
};


export type QueryUserAppUrlExplanationsArgs = {
  appID: Scalars['ID']['input'];
  userID: Scalars['ID']['input'];
};

export type User = {
  __typename?: 'User';
  /** Platformer user unique identifier. */
  id: Scalars['ID']['output'];
  /** User's profile image. */
  image?: Maybe<Image>;
  /** Display name. */
  name: Scalars['String']['output'];
  /** User's Telegram profile data. */
  telegramData?: Maybe<UserTelegramData>;
};

export type UserLimits = {
  __typename?: 'UserLimits';
  /** Max apps count to own. */
  maxOwnedAppsCount?: Maybe<Scalars['Int']['output']>;
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
