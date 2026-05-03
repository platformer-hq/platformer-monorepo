<script setup lang="ts">
import { popup } from '@tma.js/sdk-vue';
import * as fp from 'fp-ts';

import ButtonLoadingIndicator from '~/components/ButtonLoadingIndicator.vue';

import SubsectionTitle from './_components/SubsectionTitle.vue';
import UploadRules from './_components/UploadRules.vue';
import { useAppSplashScreenUploadPageQueryMeta } from './composables/useAppSplashScreenUploadPageQueryMeta';
import defaultIconUrl from './default-icon.svg';
import { UpdateAppSplashScreenIconDocument } from './operations';

const appId = useQueryAppId();

const { t } = useI18n({
  messages: {
    ru: {
      title: 'Иконка',
      'inputButton.initialFile': 'Выбрать файл',
      'inputButton.anotherFile': 'Выбрать другой файл',
      uploadButton: 'Сохранить изменения',
      footer: 'Выберите SVG-иконку для отображения в лаунчере Платформера.',
      preview: 'Превью',
      'maxSizePopup.message': 'Размер файла превышает допустимый размер в {maxSize}KB.',
    },
    en: {
      title: 'Icon',
      'inputButton.initialFile': 'Select file',
      'inputButton.anotherFile': 'Select another file',
      uploadButton: 'Save changes',
      footer: 'Select an SVG icon to display in the Platformer launcher.',
      preview: 'Preview',
      'maxSizePopup.message': 'File size exceeds the allowed size {maxSize}KB.',
    },
  },
});
const router = useRouter();

//#region Requests.
const { options: queryOptions, setData: setQueryData } = useAppSplashScreenUploadPageQueryMeta();
const apiGqlRequest = useMakeApiGqlRequest();
const { data } = useQuery(() => queryOptions(appId.value));
const { mutate: updateIcon, isLoading: isUpdatingIcon } = useMutation({
  key: [UpdateAppSplashScreenIconDocument],
  mutation(options: { appId: number; svg: string }) {
    return throwifyAnyEither(
      fp.function.pipe(
        apiGqlRequest(UpdateAppSplashScreenIconDocument, {
          appId: options.appId,
          svg: options.svg,
        }),
        fp.taskEither.map(r => ({
          iconUrl: r.updateApp.splashScreenIconUrl,
        })),
      ),
    );
  },
  onSuccess({ iconUrl }) {
    selectedFile.value = undefined;
    setQueryData(appId.value, data => (
      data
        ? { ...data, iconUrl: iconUrl || undefined }
        : data
    ));
    hapticNotificationOccurred('success');
    router.back();
  },
  onError() {
    hapticNotificationOccurred('error');
    // FIXME: error popup
  },
});
//#endregion
const inputRef = useTemplateRef('input');

const selectedFile = ref<{
  url: string;
  file: File;
}>();

const iconUrl = computed(() => (
  selectedFile.value?.url || (
    data.value
      ? data.value.iconUrl || defaultIconUrl
      : undefined
  )
));

const handleInputChange = async (event: Event) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) {
    return;
  }
  if (file.size > maxIconSize * 1024) {
    await popup.show({ message: t('maxSizePopup.message', { maxSize: maxIconSize }) });
  } else {
    selectedFile.value = {
      url: URL.createObjectURL(file),
      file,
    };
  }
  input.value = '';
};
const handleSave = () => {
  const file = selectedFile.value?.file;
  if (!file) {
    return;
  }
  const reader = new FileReader();
  reader.onload = e => {
    const r = e.target?.result;
    if (typeof r === 'string') {
      updateIcon({ appId: appId.value, svg: r });
    }
  };
  reader.readAsText(file);
};
const maxIconSize = 32;
const { e } = bem('app-splash-screen-upload-page');
</script>

<template>
  <PageRoot colors="secondary-bg">
    <PageContent>
      <PagePaddings>
        <AutoSection list-bg-color="section-bg">
          <template #header>
            <AutoSectionHeader>
              {{ t('title') }}
            </AutoSectionHeader>
          </template>

          <AutoList>
            <AutoListItem variant="accent" clickable @click="inputRef?.click()">
              <template #bodyLeftLabel>
                <AutoListItemBodyLeftLabel>
                  {{ selectedFile ? t('inputButton.anotherFile') : t('inputButton.initialFile') }}
                  <input
                    v-show="false"
                    ref="input"
                    type="file"
                    accept="image/svg+xml"
                    :multiple="false"
                    @change="handleInputChange"
                  >
                </AutoListItemBodyLeftLabel>
              </template>
            </AutoListItem>
            <Transition v-bind="createListItemTransition()" :css="false">
              <AutoListItem v-if="selectedFile" large>
                <template #left>
                  <AutoListItemLeft>
                    <AutoListItemLeftIcon pad-left>
                      <AutoListItemLeftIconElement>
                        <ProgressiveImage
                          v-slot="{isError, isLoaded, onError, onLoad, src, srcset}"
                          :src="selectedFile.url"
                          :width="28"
                          :height="28"
                        >
                          <ProgressiveImageTransition>
                            <ProgressiveImagePlaceholder v-if="isError"/>
                          </ProgressiveImageTransition>
                          <ProgressiveImageElement
                            v-bind="{ src, srcset, onError, show: isLoaded }"
                            fit="contain"
                            @ready="onLoad"
                          />
                        </ProgressiveImage>
                      </AutoListItemLeftIconElement>
                    </AutoListItemLeftIcon>
                  </AutoListItemLeft>
                </template>
                <template #bodyLeftLabel>
                  <AutoListItemBodyLeftLabel>
                    {{ selectedFile.file.name }}
                  </AutoListItemBodyLeftLabel>
                </template>
                <template #bodyLeftSubtitle>
                  <AutoListItemBodyLeftSubtitle>
                    {{ (selectedFile.file.size / 1024).toFixed(1) }} KB
                  </AutoListItemBodyLeftSubtitle>
                </template>
                <template #bodyRight>
                  <AutoListItemBodyRight>
                    <AutoListItemBodyRightClear @click="selectedFile = undefined"/>
                  </AutoListItemBodyRight>
                </template>
              </AutoListItem>
            </Transition>
          </AutoList>

          <template #footer>
            <AutoSectionFooter>
              {{ t('footer') }}
            </AutoSectionFooter>
          </template>
        </AutoSection>

        <UploadRules :data="data?.rules"/>

        <SubsectionTitle>
          {{ t('preview') }}
        </SubsectionTitle>
        <AutoRoundedPanel :class="e('preview')">
          <ProgressiveImage
            v-if="iconUrl"
            v-slot="{isError, isLoaded, onError, onLoad, src, srcset}"
            :src="iconUrl"
            :width="80"
            :height="80"
          >
            <ProgressiveImageTransition>
              <ProgressiveImagePlaceholder v-if="isError"/>
            </ProgressiveImageTransition>
            <ProgressiveImageElement
              v-bind="{ src, srcset, onError, show: isLoaded }"
              fit="contain"
              @ready="onLoad"
            />
          </ProgressiveImage>
        </AutoRoundedPanel>
      </PagePaddings>
    </PageContent>
    <template #bottomBar>
      <BottomBarTransition>
        <BottomBar v-if="selectedFile">
          <BottomBarInner>
            <AutoButton
              :active="!isUpdatingIcon"
              :disabled="isUpdatingIcon"
              :palette="isUpdatingIcon ? 'disabled' : 'filled'"
              full-width
              @click="handleSave"
            >
              <AutoTypography variant="body" weight="medium">
                {{ t('uploadButton') }}
              </AutoTypography>
              <ButtonLoadingIndicator :show="isUpdatingIcon"/>
            </AutoButton>
          </BottomBarInner>
        </BottomBar>
      </BottomBarTransition>
    </template>
  </PageRoot>
</template>

<style lang="scss">
.app-splash-screen-upload-page {
  &__preview {
    background-color: var(--bg-color);
    height: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
