import type { CodegenConfig } from '@graphql-codegen/cli';
import type { TypeScriptDocumentsPluginConfig } from '@graphql-codegen/typescript-operations';
import type {
  TypeScriptTypedDocumentNodesConfig,
} from '@graphql-codegen/typed-document-node';
import type { NearOperationFileConfig } from '@graphql-codegen/near-operation-file-preset';
import { DocumentMode } from '@graphql-codegen/visitor-plugin-common';

const scalars = {
  Date: 'string',
};

export default {
  overwrite: true,
  schema: 'https://mini-apps.store/gql',
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
        // Generate "gql`...` as unknown as DocumentNode<query, variables>" to prevent manual
        // addition of generics useGqlQuery / useGqlMutation.
        documentMode: DocumentMode.graphQLTag,
        // Remove `Document` suffix.
        documentVariableSuffix: '',
        documentNodeImport: 'api#DocumentNode',
        gqlImport: 'api#gql',
        scalars,
      } satisfies TypeScriptDocumentsPluginConfig & TypeScriptTypedDocumentNodesConfig,
    },
    'packages/api/src/schema.ts': {
      // Schema used only for common types
      // Patches prevent generating unconfigured params
      config: {
        scalars,
        onlyOperationTypes: true,
      },
      plugins: ['typescript'],
    },
  },
} satisfies CodegenConfig;
