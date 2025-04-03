import type { CodegenConfig } from '@graphql-codegen/cli';
import type { TypeScriptDocumentsPluginConfig } from '@graphql-codegen/typescript-operations';
import type {
  TypeScriptTypedDocumentNodesConfig,
} from '@graphql-codegen/typed-document-node';
import type { NearOperationFileConfig } from '@graphql-codegen/near-operation-file-preset';

function operationsConfig(
  folder: string,
  baseTypesPath: string,
  gqlImport: string,
): CodegenConfig['generates'][string] {
  return {
    documents: [
      `${folder}/**/*.gql`,
      // Prevent pnpm symlinks. Currently telegram-launcher requires package "api" and find
      // path like "apps/telegram-launcher/node_modules/api/src/operations/Authenticate.gql"
      // We need to apply the "Authenticate.gql" logic from "packages/**/*.gql"
      // instead of "apps/**/*.gql"
      '!**/node_modules/**/*.gql',
    ],
    preset: 'near-operation-file-preset',
    presetConfig: { extension: '.ts', baseTypesPath } satisfies NearOperationFileConfig,
    plugins: [
      'typescript-operations',
      'typed-document-node',
    ],
    config: {
      useTypeImports: true,
      declarationKind: 'interface',
      strictScalars: true,
      // Because no DocumentMode exported from library
      // Generate "gql`` as unknown as DocumentNode<query, variables>" to
      // prevent manual addition of generics useGqlQuery / useGqlMutation
      documentMode: 'graphQLTag' as TypeScriptTypedDocumentNodesConfig['documentMode'],
      // Prevent `Document` suffix
      documentVariableSuffix: '',
      gqlImport,
      scalars: {
        Date: 'string',
      },
    } satisfies TypeScriptDocumentsPluginConfig & TypeScriptTypedDocumentNodesConfig,
  };
}

export default {
  overwrite: true,
  schema: 'https://mini-apps.store/gql',
  generates: {
    'apps/': operationsConfig('apps', '~api', 'api#gql'),
    'packages/': operationsConfig('packages', '~../schema.js', '../gql.js#gql'),
    'packages/api/src/schema.ts': {
      config: {
        scalars: {
          Date: 'string',
        },
      },
      plugins: ['typescript'],
    },
  },
} satisfies CodegenConfig;