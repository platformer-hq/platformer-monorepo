import type { CodegenConfig } from '@graphql-codegen/cli';

const scalars = {
  Time: 'string',
  ID: 'number',
};

export default {
  overwrite: true,
  schema: 'https://mini-apps.store/api/gql',
  generates: {
    '.': {
      documents: ['./apps/admin/**/*.gql'],
      preset: 'near-operation-file-preset',
      presetConfig: {
        extension: '.ts',
        baseTypesPath: '~@workspace/api/schema',
      },
      plugins: [
        'typescript-operations',
        'typed-document-node',
        { add: { content: '/* eslint-disable */' } },
      ],
      config: {
        scalars,
        useTypeImports: true,
        declarationKind: 'interface',
      },
    },
    './packages/api/src/schema.ts': {
      plugins: [
        'typescript',
        { add: { content: '/* eslint-disable */' } },
      ],
      config: {
        scalars,
      },
    },
  },
  watch: true,
} satisfies CodegenConfig;
