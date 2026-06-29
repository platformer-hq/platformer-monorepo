<script setup lang="ts">
import {
  autocompletion, completionKeymap, closeBrackets, closeBracketsKeymap,
} from '@codemirror/autocomplete';
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands';
import { javascript } from '@codemirror/lang-javascript';
import { indentOnInput, bracketMatching } from '@codemirror/language';
import { lintKeymap } from '@codemirror/lint';
import { EditorState } from '@codemirror/state';
import {
  keymap, highlightSpecialChars, drawSelection, highlightActiveLine,
  rectangularSelection, crosshairCursor,
  lineNumbers, highlightActiveLineGutter, EditorView,
} from '@codemirror/view';
import { vsCodeDark } from '@fsegurai/codemirror-theme-vscode-dark';
import { vsCodeLight } from '@fsegurai/codemirror-theme-vscode-light';

import { Translation } from '#i18n';

const props = defineProps<{
  readonly: boolean;
  initialLoading: boolean;
  refreshing: boolean;
  disabled: boolean;
  error?: string;
}>();

const model = defineModel<string>({ required: true });

const codeEditorRef = useTemplateRef('code-editor');
const isDark = useIsDark();
useI18n({
  messages: {
    en: {
      footer: 'Function code. Platformer will invoke the default-exported function, passing the parameter specified before execution.',
    },
    ru: {
      footer: 'Код функции. Платформер вызовет функцию, экспортированную по умолчанию, передав ей параметр, указанный перед выполнением.',
    },
  },
});

const editorView = ref<EditorView>();

const isEditorDisabled = computed(() => {
  return props.readonly || props.initialLoading || props.disabled || props.refreshing;
});

watch([codeEditorRef, isDark, isEditorDisabled], ([element, dark, disabled]) => {
  if (element) {
    editorView.value = new EditorView({
      doc: model.value,
      extensions: [
        lineNumbers(),
        highlightActiveLineGutter(),
        highlightSpecialChars(),
        history(),
        drawSelection(),
        EditorState.allowMultipleSelections.of(true),
        indentOnInput(),
        bracketMatching(),
        closeBrackets(),
        autocompletion(),
        rectangularSelection(),
        crosshairCursor(),
        highlightActiveLine(),
        keymap.of([
          ...closeBracketsKeymap,
          ...defaultKeymap,
          ...historyKeymap,
          ...completionKeymap,
          ...lintKeymap,
        ]),
        javascript(),
        EditorView.theme({
          '&': {
            color: 'var(--text-color)',
            backgroundColor: 'var(--section-bg-color)',
            fontSize: '15px',
          },
          '.cm-gutters': {
            backgroundColor: 'var(--section-bg-color)',
            color: 'var(--text-color)',
          },
          '.cm-cursorLayer': disabled ? { animation: 'none !important' } : {},
        }),
        EditorState.readOnly.of(disabled),
        EditorView.updateListener.of(update => {
          if (update.docChanged) {
            model.value = update.state.doc.toString();
          }
        }),
        dark ? vsCodeDark : vsCodeLight,
      ],
      parent: element,
    });

    onWatcherCleanup(() => {
      editorView.value?.destroy();
    });
  }
}, { immediate: true });

const { b, e } = bem('app-function-page-code-section');
</script>

<template>
  <Transition :name="e('transition')">
    <section v-if="!initialLoading" :class="b()">
      <AutoRoundedPanel :class="e('panel')">
        <div ref="code-editor"/>
      </AutoRoundedPanel>
      <AutoSectionFooter>
        <Translation keypath="footer">
          <AutoTypography :style="{display: 'inline'}" weight="bold">
            handle
          </AutoTypography>
        </Translation>
      </AutoSectionFooter>
    </section>
  </Transition>
</template>

<style lang="scss">
.app-function-page-code-section {
  margin: 16px auto 0;
  max-width: 700px;

  &__panel {
    overflow: hidden;
  }

  &__transition {
    &-enter-active, &-leave-active {
      transition: 300ms ease-out;
    }

    &-enter-from, &-leave-to {
      margin-top: 8px;
      opacity: 0;
      transform: scale(0.95);
    }

    &-enter-to, &-leave-from {
      margin-top: 16px;
      opacity: 1;
      transform: scale(1);
    }
  }
}
</style>
