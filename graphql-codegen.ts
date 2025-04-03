import type { CodegenConfig } from '@graphql-codegen/cli';
import type { TypeScriptDocumentsPluginConfig } from '@graphql-codegen/typescript-operations';
import type {
  TypeScriptDocumentNodesRawPluginConfig,
} from '@graphql-codegen/typescript-document-nodes';
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
      'typescript-document-nodes',
    ],
    config: {
      useTypeImports: true,
      declarationKind: 'interface',
      strictScalars: true,
      gqlImport,
      scalars: {
        Date: 'string',
      },
    } satisfies TypeScriptDocumentsPluginConfig & TypeScriptDocumentNodesRawPluginConfig,
  };
}

export default {
  overwrite: true,
  schema: 'https://mini-apps.store/gql',
  generates: {
    'src/': operationsConfig('apps', '~api', 'api'),
    'src2/': operationsConfig('packages', '~../schema.js', '../gql.js'),
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