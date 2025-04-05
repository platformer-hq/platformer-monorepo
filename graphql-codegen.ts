import type { CodegenConfig } from '@graphql-codegen/cli';
import type { TypeScriptDocumentsPluginConfig } from '@graphql-codegen/typescript-operations';
import type {
  TypeScriptTypedDocumentNodesConfig,
} from '@graphql-codegen/typed-document-node';
import type { NearOperationFileConfig } from '@graphql-codegen/near-operation-file-preset';

function operationsConfig(
  folder: string,
  baseTypesPath: string,
  apiRawImportPath: string,
): CodegenConfig['generates'][string] {
  return {
    documents: [`${folder}/**/*.gql`],
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
      documentNodeImport: `${apiRawImportPath}#DocumentNode`,
      gqlImport: `${apiRawImportPath}#gql`,
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
    'apps/': operationsConfig('apps/*/src', '~api', 'api'),
    'api/': operationsConfig('packages/api/src', '~../schema.js', '../gql.js'),
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