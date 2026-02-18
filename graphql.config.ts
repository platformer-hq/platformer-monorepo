import type { CodegenConfig } from '@graphql-codegen/cli';

const scalars = {
  JSON: 'Record<string, unknown>',
};

export default {
  overwrite: true,
  schema: 'https://mini-apps.store/api/gql',
  generates: {
    '.': {
      documents: ['./layers/admin-panel/app/**/*.gql'],
      preset: 'near-operation-file-preset',
      presetConfig: {
        extension: '.ts',
        baseTypesPath: '~#layers/api/schema',
        scalars,
      },
      plugins: [
        'typescript-operations',
        'typed-document-node',
        { add: { content: '/* eslint-disable */' } },
      ],
      config: {
        useTypeImports: true,
        declarationKind: 'interface',
      },
    },
    './layers/api/schema.ts': {
      config: {
        scalars,
      },
      plugins: [
        'typescript',
        { add: { content: '/* eslint-disable */' } },
      ],
    },
  },
  watch: true,
} satisfies CodegenConfig;
