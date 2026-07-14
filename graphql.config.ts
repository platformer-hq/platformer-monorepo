import type { CodegenConfig } from '@graphql-codegen/cli';
import dotenv from 'dotenv';
import * as v from 'valibot';

const scalars = {
  Time: 'string',
  ID: 'number',
};

dotenv.config();

const env = v.parse(
  v.looseObject({
    SCHEMA_INTROSPECTION_URL: v.optional(
      v.pipe(v.string(), v.nonEmpty()),
      'https://mini-apps.store/api/gql',
    ),
  }),
  process.env,
);

export default {
  overwrite: true,
  schema: env.SCHEMA_INTROSPECTION_URL,
  generates: {
    '.': {
      documents: ['./apps/admin/**/*.gql', './apps/launcher/**/*.gql'],
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
        printFieldsOnNewLines: true,
        flattenGeneratedTypes: true,
        flattenGeneratedTypesIncludeFragments: true,
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
