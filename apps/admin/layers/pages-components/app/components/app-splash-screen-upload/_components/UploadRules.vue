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
      'attibutes.subtitle': 'Доступные атрибуты',
      'tags.subtitle': 'Доступные теги',
      'maxSize.subtitle': 'Максимальный размер',
      'xmlns.subtitle': 'Доступные значения xmlns',
    },
    en: {
      title: 'Rules',
      'expand.expand': 'Expand',
      'expand.collapse': 'Collapse',
      'attibutes.subtitle': 'Allowed attributes',
      'tags.subtitle': 'Allowed tags',
      'maxSize.subtitle': 'Max size',
      'xmlns.subtitle': 'Allowed xmlns values',
    },
  },
});
const platform = useTmaPlatform();

const expanded = ref(false);

const toSorted = (arr: string[]) => [...arr].sort();
const toCapitalized = (str: string) => {
  return str.charAt(0)[platform.value.isMappedIos ? 'toLowerCase' : 'toUpperCase']() + str.slice(1);
};
const lines = computed(() => {
  if (!props.data) {
    return;
  }
  const { allowedAttrs, allowedTags, maxSize, xmlns } = props.data;
  return [
    { title: toCapitalized(t('maxSize.subtitle')), value: maxSize + ' B' },
    { title: toCapitalized(t('attibutes.subtitle')), value: toSorted(allowedAttrs).join(', ') },
    { title: toCapitalized(t('tags.subtitle')), value: toSorted(allowedTags).join(', ') },
    { title: toCapitalized(t('xmlns.subtitle')), value: `"${toSorted(xmlns).join('", "')}"` },
  ];
});

const { e } = bem('app-splash-screen-upload-rules');
const itemsTransition = createReversibleTransition({
  animatedProperties({ el, transition }) {
    return reverseTransitionKeyframesIfLeave({
      overflow: ['hidden', 'hidden'],
      height: ['0px', el.clientHeight + 'px'],
      opacity: [0, 1],
    }, transition);
  },
  animationOptions: { duration: 300, easing: 'ease-out' },
});
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

        <Transition v-bind="itemsTransition" :css="false">
          <div v-if="expanded">
            <template v-for="(line, idx) in lines" :key="idx">
              <AutoListItem large>
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
          </div>
        </Transition>
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
