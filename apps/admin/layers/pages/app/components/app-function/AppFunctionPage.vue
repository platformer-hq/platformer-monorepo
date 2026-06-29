<script setup lang="ts">
import { popup } from '@tma.js/sdk-vue';
import { ApiGraphQLResponseError } from '@workspace/api';
import { parse, type Program } from 'acorn';
import * as fp from 'fp-ts';
import { useForm } from 'vee-validate';

import ActionsSection from './_sections/ActionsSection.vue';
import CodeSection from './_sections/CodeSection.vue';
import EnabledSection from './_sections/EnabledSection.vue';
import ErrorSection from './_sections/ErrorSection.vue';
import NameSection from './_sections/NameSection.vue';
import {
  CreateAppFunctionDocument, DeleteAppFunctionDocument, UpdateAppFunctionDocument,
} from './operations';

const props = defineProps<{
  appId: number;
  fnId?: number;
}>();

const { t } = useI18n({
  messages: {
    en: {
      'bottomButton.create': 'Create',
      'bottomButton.update': 'Update',
      'nameErrors.invalidFormat': 'Function name has incorrect format.',
      'nameErrors.tooLong.knownLen': [
        'Function name is too long. Maximum allowed length is {count} symbol.',
        'Function name is too long. Maximum allowed length is {count} symbols.',
      ].join(' | '),
      'nameErrors.tooLong.unknownLen': 'Function name is too long.',
      'codeErrors.tooLong.knownLen': [
        'Function code is too long. Maximum allowed length is {count} symbol.',
        'Function code is too long. Maximum allowed length is {count} symbols.',
      ].join(' | '),
      'codeErrors.tooLong.unknownLen': 'Function code is too long.',
      'codeErrors.syntax': 'Function code has syntax errors.',
      'codeErrors.tooManyParams': 'Function accepts too many arguments. The handle function should not accept more than 1 argument.',
      'codeErrors.noDefaultExport': 'Default export is missing.',
      'codeErrors.defaultExportNotFn': 'Default export should be a function.',
      'commonErrors.nameDuplicate': 'Function with this name already exists.',
    },
    ru: {
      'bottomButton.create': 'Создать',
      'bottomButton.update': 'Обновить',
      'nameErrors.invalidFormat': 'Наименование функции имеет некорректный формат.',
      'nameErrors.tooLong.knownLen': [
        'Наименование функции слишком длинное. Максимальная допустимая длина - {count} символов.',
        'Наименование функции слишком длинное. Максимальная допустимая длина - {count} символ.',
        'Наименование функции слишком длинное. Максимальная допустимая длина - {count} символа.',
        'Наименование функции слишком длинное. Максимальная допустимая длина - {count} символов.',
      ].join(' | '),
      'nameErrors.tooLong.unknownLen': 'Наименование функции слишком длинное.',
      'codeErrors.tooLong.knownLen': [
        'Код функции слишком длинный. Максимальная допустимая длина - {count} символов.',
        'Код функции слишком длинный. Максимальная допустимая длина - {count} символ.',
        'Код функции слишком длинный. Максимальная допустимая длина - {count} символа.',
        'Код функции слишком длинный. Максимальная допустимая длина - {count} символов.',
      ].join(' | '),
      'codeErrors.tooLong.unknownLen': 'Код функции слишком длинный.',
      'codeErrors.syntax': 'Код функции содержит синтаксические ошибки',
      'codeErrors.tooManyParams': 'Код функции принимает слишком много аргументов. Функция handle не должна получать более 1 аргумента.',
      'codeErrors.noDefaultExport': 'Отсутствует экспорт по умолчанию.',
      'codeErrors.defaultExportNotFn': 'Экспорт по умолчанию должен быть функцией.',
      'commonErrors.nameDuplicate': 'Функция с этим наименованием уже существует.',
    },
  },
});
const isPageEntered = useIsCurrentPageEntered();
const router = useRouter();

//#region Requests.
const {
  options: pageQueryOptions,
  setData: setAppFunctionPageQueryData,
  getData: getAppFunctionPageQueryData,
} = useAppFunctionPageQueryMeta();
const { setData: setAppFunctionsPageQueryData } = useAppFunctionsPageQueryMeta();
const { data, isLoading: isLoadingPageData, isPending: isPendingPageData } = useQuery(() => {
  return pageQueryOptions({ appId: props.appId, fnId: props.fnId });
});
const { mutate: deleteFunction, isLoading: isDeletingFunction } = useFpMutation({
  key: [DeleteAppFunctionDocument],
  mutation(options: { funcId: number }, { apiGqlRequest }) {
    return apiGqlRequest(DeleteAppFunctionDocument, { funcId: options.funcId });
  },
  onSuccess(_, { funcId }) {
    hapticNotificationOccurred('success');
    setAppFunctionsPageQueryData(props.appId, prev => (
      prev
        ? { ...prev, functions: prev.functions.filter(t => t.id !== funcId) }
        : prev
    ));
    router.back();
  },
  onError() {
    hapticNotificationOccurred('error');
  },
});
const { mutate: updateFunction, isLoading: isUpdatingFunction } = useFpMutation({
  key: [UpdateAppFunctionDocument],
  mutation(options: {
    funcId: number;
    name: string;
    enabled: boolean;
    code: string;
  }, { apiGqlRequest }) {
    return fp.function.pipe(
      apiGqlRequest(UpdateAppFunctionDocument, {
        enabled: options.enabled,
        funcId: options.funcId,
        code: options.code,
        name: options.name,
      }),
      fp.taskEither.map(r => r.updateAppFunction),
    );
  },
  onSuccess({ enabled, id, code, name }) {
    hapticNotificationOccurred('success');

    // Update  functions page data.
    setAppFunctionsPageQueryData(props.appId, prev => (
      prev
        ? {
          ...prev,
          functions: prev.functions.map(t => (
            t.id === id
              ? { ...t, enabled, code, name }
              : t
          )),
        }
        : prev
    ));

    // Update existing  function page data.
    setAppFunctionPageQueryData({ appId: props.appId, fnId: id }, prev => (
      prev
        ? { ...prev, function: { id, enabled, code, name } }
        : prev
    ));
  },
  onError() {
    hapticNotificationOccurred('error');
  },
});
const { mutate: createFunction, isLoading: isCreatingFunction } = useFpMutation({
  key: [CreateAppFunctionDocument],
  mutation(options: {
    appId: number;
    name: string;
    enabled: boolean;
    code: string;
  }, { apiGqlRequest }: MutationEnhancedContext) {
    return fp.function.pipe(
      apiGqlRequest(CreateAppFunctionDocument, {
        appId: options.appId,
        code: options.code,
        enabled: options.enabled,
        name: options.name,
      }),
      fp.taskEither.map(r => r.createAppFunction),
    );
  },
  onSuccess({ enabled, id, code, name }, { appId }) {
    hapticNotificationOccurred('success');

    // Update  functions page data.
    setAppFunctionsPageQueryData(appId, prev => (
      prev
        ? {
          ...prev,
          functions: [...prev.functions, { enabled, id, name, code }],
        }
        : prev
    ));

    // Update created  function page data.
    const createModeData = getAppFunctionPageQueryData({ appId });
    if (createModeData) {
      setAppFunctionPageQueryData({ appId, fnId: id }, {
        ...createModeData,
        function: { enabled, id, code, name },
      });
    }
    router.back();
  },
  async onError(error) {
    if (ApiGraphQLResponseError.is(error)) {
      const { maxCodeLength, maxNameLength } = data.value?.limits || {};
      const errors = {
        ERR_APP_FUNCTION_CODE_SYNTAX_ERROR: t('codeErrors.syntax'),
        ERR_APP_FUNCTION_CODE_TOO_LONG: maxCodeLength
          ? t('codeErrors.tooLong.knownLen', { count: maxCodeLength })
          : t('codeErrors.tooLong.unknownLen'),
        ERR_APP_FUNCTION_CODE_PARAMS_TOO_MANY: t('codeErrors.tooManyParams'),
        ERR_APP_FUNCTION_NAME_TOO_LONG: maxNameLength
          ? t('nameErrors.tooLong.knownLen', { count: maxNameLength })
          : t('nameErrors.tooLong.unknownLen'),
        ERR_APP_FUNCTION_NAME_INVALID: t('nameErrors.invalidFormat'),
        ERR_APP_FUNCTION_NAME_DUPLICATE: t('commonErrors.nameDuplicate'),
        ERR_APP_FUNCTION_CODE_EXPORT_NOT_FN: t('codeErrors.defaultExportNotFn'),
        ERR_APP_FUNCTION_CODE_EXPORT_MISSING: t('codeErrors.noDefaultExport'),
      };
      for (const [code, message] of Object.entries(errors)) {
        if (error.hasErrorWithCode(code)) {
          await popup.show({ message });
          break;
        }
      }
    }
    hapticNotificationOccurred('error');
  },
});
const isSendingMutationRequest = computed(() => (
  isUpdatingFunction.value
  || isCreatingFunction.value
  || isDeletingFunction.value
));
const isSendingAnyRequest = computed(() => (
  isLoadingPageData.value || isSendingMutationRequest.value
));
// const isSendingAnyRequest = computed(() => true);
//#endregion

const {
  defineField,
  handleSubmit: createSubmitHandler,
  resetForm,
  errors,
  validate: validateForm,
} = useForm({
  initialValues: {
    enabled: false,
    name: '',
    code: `export default async function(ctx) {
  // Function code goes here.
}`,
  },
  validateOnMount: true,
  validationSchema: {
    name(value: string) {
      if (!data.value) {
        return true;
      }
      const { maxNameLength } = data.value.limits;
      if (maxNameLength && value.length > maxNameLength) {
        return t('nameErrors.tooLong.knownLen', { count: maxNameLength });
      }
      return value.match(/^[a-z][a-z0-9_]*$/i) ? true : t('nameErrors.invalidFormat');
    },
    code(value: string) {
      if (!data.value) {
        return true;
      }
      const { maxCodeLength } = data.value.limits;
      if (maxCodeLength && code.value.length > maxCodeLength) {
        return t('codeErrors.tooLong.knownLen', { count: maxCodeLength });
      }
      let ast: Program;
      try {
        ast = parse(value, { ecmaVersion: 8, sourceType: 'module' });
      } catch {
        return t('codeErrors.syntax');
      }
      for (const statement of ast.body) {
        if (statement.type !== 'ExportDefaultDeclaration') {
          continue;
        }
        const { declaration } = statement;
        if (declaration.type !== 'FunctionDeclaration' && declaration.type !== 'ArrowFunctionExpression') {
          return t('codeErrors.defaultExportNotFn');
        }
        if (declaration.params.length > 1) {
          return t('codeErrors.tooManyParams');
        }
        return true;
      }
      return t('codeErrors.noDefaultExport');
    },
  },
});
const [name] = defineField('name');
const [enabled] = defineField('enabled');
const [code] = defineField('code');

const isReadonlyMode = computed(() => (
  !!data.value?.currentUserRole && !isEditorRole(data.value.currentUserRole)
));
// const isReadonlyMode = computed(() => true);
const firstError = computed(() => Object.values(errors.value)[0]);
const hasError = computed(() => !!firstError.value);
const isUpdateMode = computed(() => typeof props.fnId === 'number');
const showBottomBar = computed(() => {
  if (!isPageEntered.value || !data.value || isReadonlyMode.value) {
    return false;
  }
  if (!data.value.function) {
    return true;
  }
  const prev = data.value.function;
  return enabled.value !== prev.enabled
    || name.value !== prev.name
    || code.value !== prev.code;
});

const handleDelete = () => {
  if (props.fnId) {
    deleteFunction({ funcId: props.fnId });
  }
};
const handleSubmit = createSubmitHandler(({ code, enabled, name }) => {
  const shared = { enabled, code, name };
  if (props.fnId) {
    updateFunction({ ...shared, funcId: props.fnId });
  } else {
    createFunction({ ...shared, appId: props.appId });
  }
});

const stopWatchingData = watch(() => data.value?.function, func => {
  if (func) {
    resetForm({
      values: {
        code: func.code,
        enabled: func.enabled,
        name: func.name,
      },
    });
    validateForm();
    nextTick(() => stopWatchingData());
  }
}, { immediate: true, deep: true });
</script>

<template>
  <PageRoot colors="secondary-bg">
    <form @submit="handleSubmit">
      <PageContent>
        <PagePaddings :bottom="false">
          <EnabledSection v-model="enabled" :disabled="isSendingAnyRequest || isReadonlyMode"/>
          <NameSection
            v-model.trim="name"
            :shimmer-enabled="isUpdateMode"
            :readonly="isReadonlyMode"
            :refreshing="isLoadingPageData"
            :disabled="isSendingAnyRequest"
            :max-length="data?.limits.maxNameLength"
          />
        </PagePaddings>
      </PageContent>
      <PagePaddings :top="false">
        <CodeSection
          v-model.trim="code"
          :initial-loading="isPendingPageData"
          :readonly="isReadonlyMode"
          :refreshing="isLoadingPageData"
          :disabled="isSendingAnyRequest"
          :error="errors.code"
        />
        <ErrorSection :error="firstError"/>
        <ActionsSection
          v-if="!isReadonlyMode && isUpdateMode"
          :disabled="isLoadingPageData || isSendingAnyRequest"
          @delete="handleDelete"
        />
      </PagePaddings>
    </form>
    <template #footer>
      <BottomBarTransition>
        <BottomBar v-if="showBottomBar">
          <PageContent>
            <BottomBarInner>
              <AutoButton
                :palette="!hasError && !isSendingAnyRequest ? 'filled' : 'disabled'"
                :active="!hasError && !isSendingAnyRequest"
                :disabled="hasError || isSendingAnyRequest"
                full-width
                glass
                @click="handleSubmit()"
              >
                <AutoTypography variant="body" weight="medium">
                  {{ isUpdateMode
                      ? t('bottomButton.update')
                      : t('bottomButton.create') }}
                </AutoTypography>
                <ButtonLoadingIndicator :show="isSendingMutationRequest"/>
              </AutoButton>
            </BottomBarInner>
          </PageContent>
        </BottomBar>
      </BottomBarTransition>
    </template>
  </PageRoot>
</template>
