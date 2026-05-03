<script setup lang="ts">
import { IconChevronDown24 } from '@tma.js/vue-kit';

import SubsectionTitle from './SubsectionTitle.vue';

const props = defineProps<{
  data?: {
    allowedAttrs: string[];
    allowedTags: string[];
    maxSize: number;
    xmlns: string[];
  };
}>();

const { t } = useI18n({
  messages: {
    ru: {
      title: 'Требования',
      'expand.expand': 'Развернуть',
      'expand.collapse': 'Свернуть',
      'attibutes.subtitle': 'Атрибуты',
      'tags.subtitle': 'Теги',
      'maxSize.subtitle': 'Максимальный размер',
      'xmlns.subtitle': 'Значения xmlns',
    },
    en: {
      title: 'Rules',
      'expand.expand': 'Expand',
      'expand.collapse': 'Collapse',
      'attibutes.subtitle': 'Attributes',
      'tags.subtitle': 'Tags',
      'maxSize.subtitle': 'Max size',
      'xmlns.subtitle': 'Xmlns values',
    },
  },
});

const expanded = ref(false);

const toSorted = (arr: string[]) => {
  return [...arr].sort();
};
const lines = computed(() => {
  if (!props.data) {
    return;
  }
  const { allowedAttrs: attributes, allowedTags: tags, maxSize, xmlns } = props.data;
  return [
    { title: t('attibutes.subtitle'), value: toSorted(attributes).join(', ') },
    { title: t('tags.subtitle'), value: toSorted(tags).join(', ') },
    { title: t('maxSize.subtitle'), value: maxSize + ' B' },
    { title: t('xmlns.subtitle'), value: `"${toSorted(xmlns).join('", "')}"` },
  ];
});

const { e } = bem('app-splash-screen-upload-rules');
</script>

<template>
  <section>
    <SubsectionTitle>
      {{ t('title') }}
    </SubsectionTitle>
    <AutoSection list-bg-color="section-bg">
      <AutoList>
        <AutoListItem variant="accent" clickable @click="expanded = !expanded">
          <template #bodyLeftLabel>
            <AutoListItemBodyLeftLabel>
              {{ t(expanded ? 'expand.collapse' : 'expand.expand') }}
            </AutoListItemBodyLeftLabel>
          </template>
          <template #bodyRight>
            <AutoListItemBodyRight>
              <IconChevronDown24 :class="e('expand-icon', {expanded})" :size="18"/>
            </AutoListItemBodyRight>
          </template>
        </AutoListItem>

        <TransitionGroup v-bind="createListItemTransition()" :css="false">
          <template v-for="(line, idx) in lines" :key="idx">
            <AutoListItem v-if="expanded" large>
              <template #bodyLeft>
                <AutoListItemBodyLeft reversed>
                  <template #label>
                    <AutoListItemBodyLeftLabel>
                      {{ line.value }}
                    </AutoListItemBodyLeftLabel>
                  </template>
                  <template #subtitle>
                    <AutoListItemBodyLeftSubtitle>
                      {{ line.title }}
                    </AutoListItemBodyLeftSubtitle>
                  </template>
                </AutoListItemBodyLeft>
              </template>
            </AutoListItem>
          </template>
        </TransitionGroup>
      </AutoList>
    </AutoSection>
  </section>
</template>

<style lang="scss">
.app-splash-screen-upload-page-upload-rules {
  &__expand-icon {
    transition: transform 300ms linear;

    &--expanded {
      transform: rotate(180deg);
    }
  }
}
</style>
