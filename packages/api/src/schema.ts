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

export enum AppManagementInviteRole {
  /** Provides the application write access. */
  Admin = 'ADMIN',
  /** Provides the application read access. */
  Member = 'MEMBER'
}

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

export type InputAppUrl = {
  /** Platform identifier. */
  platformID: Scalars['Int']['input'];
  /** URL to set. */
  url: Scalars['String']['input'];
};
