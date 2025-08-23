<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { ExclamationMarkTriangleFill28 } from 'vue-ui';

import List from '@/ui/adapters/List';
import ListItem from '@/ui/adapters/ListItem';
import ListItemBodyInput from '@/ui/adapters/ListItemBodyInput';
import Callout from '@/ui/components/Callout/Callout.vue';
import CalloutParagraph from '@/ui/components/Callout/CalloutParagraph.vue';

const value = defineModel<string>({ required: true });
defineProps<{ class?: string; disabled: boolean }>();

const { t } = useI18n({
  messages: {
    en: {
      title: 'URL',
      footer: 'Link that will be opened whenever test group users visit the application. It must either have {0} or {1} protocol.',
      placeholder: 'required',
      httpWarningTitle: 'HTTP links limitations',
      httpWarningMessage: 'Non-secured HTTP links (starting with the {0} protocol) work with a limited number of clients. Use them only during development.',
    },
    ru: {
      title: 'Ссылка',
      footer: 'Ссылка, которая будет использована для показа пользователям из тестовой группы. Она должна иметь {0} или {1} протокол.',
      placeholder: 'обязательно',
      httpWarningTitle: 'Ограничения HTTP-ссылок',
      httpWarningMessage: 'Небезопасные HTTP-ссылки (начинающиеся с {0} протокола) работают в ограниченном количестве клиентов. Используйте их только для разработки.',
    },
  },
});

const onElementEnter = (el: Element, done: () => void) => {
  return el
    .animate({
      opacity: [0, 0, 1],
      height: ['0px', `${el.clientHeight}px`],
      transform: ['translateY(-16px)', 'translateY(0)'],
      paddingBottom: ['0', '8px'],
    }, { duration: 300, easing: 'ease-out' })
    .finished
    .then(done);
};
const onElementLeave = (el: Element, done: () => void) => {
  return el
    .animate({
      opacity: [1, 0, 0],
      height: [`${el.clientHeight}px`, '0px'],
      transform: ['translateY(0)', 'translateY(-16px)'],
      paddingBottom: ['8px', '0'],
    }, { duration: 300, easing: 'ease-out' })
    .finished
    .then(done);
};
</script>

<template>
  <List
    :title="t('title')"
    :class="$props.class"
  >
    <ListItem>
      <template #bodyInput>
        <ListItemBodyInput
          v-model:value="value"
          :disabled="disabled"
          :placeholder="t('placeholder')"
          :clear="!disabled"
        />
      </template>
    </ListItem>
    <template #footer>
      <i18n-t keypath="footer">
        <b>HTTP</b>
        <b>HTTPS</b>
      </i18n-t>
    </template>
  </List>
  <Transition
    :css="false"
    @enter="onElementEnter"
    @leave="onElementLeave"
  >
    <section
      v-if="value.startsWith('http:')"
      style="padding-bottom: 8px"
    >
      <Callout
        :icon="ExclamationMarkTriangleFill28"
        :title="t('httpWarningTitle')"
        variant="warning"
      >
        <CalloutParagraph>
          <i18n-t keypath="httpWarningMessage">
            <i>http://</i>
          </i18n-t>
        </CalloutParagraph>
      </Callout>
    </section>
  </Transition>
</template>
