import type { CodegenConfig } from '@graphql-codegen/cli';
import type { TypeScriptDocumentsPluginConfig } from '@graphql-codegen/typescript-operations';
import type {
  TypeScriptTypedDocumentNodesConfig,
} from '@graphql-codegen/typed-document-node';
import type { NearOperationFileConfig } from '@graphql-codegen/near-operation-file-preset';
import { DocumentMode } from '@graphql-codegen/visitor-plugin-common';

// @ts-expect-error We are not using any tsconfig for it.
import config from './graphql.config.json';

const scalars = {
  Time: 'string',
  ID: 'number',
};

export default {
  overwrite: true,
  schema: config.schema,
  generates: {
    'apps/': {
      documents: [`apps/*/src/**/*.gql`],
      preset: 'near-operation-file-preset',
      presetConfig: { extension: '.ts', baseTypesPath: '~api' } satisfies NearOperationFileConfig,
      plugins: [
        'typescript-operations',
        'typed-document-node',
      ],
      config: {
        useTypeImports: true,
        declarationKind: 'interface',
        strictScalars: true,
        // Because no DocumentMode exported from library, generate
        // "gql`...` as unknown as DocumentNode<query, variables>" to prevent manual addition
        // of generics useGqlQuery / useGqlMutation.
        documentMode: DocumentMode.graphQLTag,
        // Remove `Document` suffix.
        documentVariableSuffix: '',
        documentNodeImport: 'api#DocumentNode',
        gqlImport: 'api#gql',
        scalars,
      } satisfies TypeScriptDocumentsPluginConfig & TypeScriptTypedDocumentNodesConfig,
    },
    'packages/api/src/schema.ts': {
      config: { scalars, onlyOperationTypes: true },
      plugins: ['typescript'],
    },
  },
} satisfies CodegenConfig;