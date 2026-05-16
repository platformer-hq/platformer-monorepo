<script setup lang="ts">
const props = defineProps<{
  platforms?: { id: number; title: string }[];
  readonly: boolean;
  disabled: boolean;
}>();

const platformIds = defineModel<number[]>({ required: true });

const { t } = useI18n({
  messages: {
    en: {
      title: 'Platforms',
      footer: 'Platforms which the test group is applicable to',
    },
    ru: {
      title: 'Платформы',
      footer: 'Платформы, к которым применима эта тестовая группа',
    },
  },
});

const clickable = computed(() => !props.disabled && !props.readonly);

const hadInitialData = !!props.platforms;

const handlePlatformClick = (platformId: number) => {
  if (platformIds.value.includes(platformId)) {
    platformIds.value = platformIds.value.filter(pId => pId !== platformId);
  } else {
    platformIds.value.push(platformId);
  }
  hapticSelectionChanged();
};
</script>

<template>
  <AutoSection list-bg-color="section-bg" style="margin-top: 16px">
    <template #header>
      <AutoSectionHeader>
        {{ t('title') }}
      </AutoSectionHeader>
    </template>
    <AutoList>
      <UseListItemTransition v-slot="transition">
        <TransitionGroup v-bind="transition" :css="false">
          <AutoListItem
            v-for="(itemOrWidth, idx) in platforms || [210, 180, 190, 150, 160, 200]"
            :key="hadInitialData && typeof itemOrWidth === 'object'
              ? itemOrWidth.id
              : idx"
            :variant="disabled ? 'placeholder' : 'regular'"
            :clickable="typeof itemOrWidth === 'object' && clickable"
            @click="
              typeof itemOrWidth === 'object'
              && clickable
              && handlePlatformClick(itemOrWidth.id)
            "
          >
            <template #bodyLeftLabel>
              <AutoListItemBodyLeftLabel>
                <template v-if="typeof itemOrWidth === 'object'">
                  {{ itemOrWidth.title }}
                </template>
                <TextShimmerBox v-else :width="itemOrWidth"/>
              </AutoListItemBodyLeftLabel>
            </template>
            <template
              v-if="typeof itemOrWidth === 'object' && platformIds.includes(itemOrWidth.id)"
              #bodyRight
            >
              <AutoListItemBodyRight>
                <AutoListItemBodyRightCheckmark/>
              </AutoListItemBodyRight>
            </template>
          </AutoListItem>
        </TransitionGroup>
      </UseListItemTransition>
    </AutoList>
    <template #footer>
      <AutoSectionFooter>
        {{ t('footer') }}
      </AutoSectionFooter>
    </template>
  </AutoSection>
</template>
