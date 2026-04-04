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
      documents: ['./apps/admin-panel/app/**/*.gql'],
      preset: 'near-operation-file-preset',
      presetConfig: {
        extension: '.ts',
        baseTypesPath: '~@platformer/api/schema',
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
    './nuxt-layers/api/schema.ts': {
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
