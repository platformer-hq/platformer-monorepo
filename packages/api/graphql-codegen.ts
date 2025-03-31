import type { CodegenConfig } from '@graphql-codegen/cli';
import type { TypeScriptDocumentsPluginConfig } from '@graphql-codegen/typescript-operations';
import type {
  TypeScriptDocumentNodesRawPluginConfig,
} from '@graphql-codegen/typescript-document-nodes';
import type { NearOperationFileConfig } from '@graphql-codegen/near-operation-file-preset';

export default {
  overwrite: true,
  schema: 'https://mini-apps.store/gql',
  generates: {
    'src/': {
      documents: 'src/**/*.gql',
      preset: 'near-operation-file-preset',
      presetConfig: {
        extension: '.ts',
        baseTypesPath: '~../schema.js',
      } satisfies NearOperationFileConfig,
      plugins: [
        'typescript-operations',
        'typescript-document-nodes',
      ],
      config: {
        useTypeImports: true,
        declarationKind: 'interface',
        strictScalars: true,
        gqlImport: '../gql.js',
        scalars: {
          Date: 'string',
        },
      } satisfies TypeScriptDocumentsPluginConfig & TypeScriptDocumentNodesRawPluginConfig,
    },
    'src/schema.ts': {
      config: {
        scalars: {
          Date: 'string',
        },
      },
      plugins: ['typescript'],
    },
  },
} satisfies CodegenConfig;