<script setup lang="ts">
import {
  isThemeParamsDark,
  onMainButtonClick,
  openInvoice,
  setMainButtonParams,
  useSignal,
} from '@telegram-apps/sdk-vue';
import { computed, onWatcherCleanup, watchEffect } from 'vue';
import { useI18n } from 'vue-i18n';
import { bem, PremiumLogo28 } from 'vue-ui';

import { useAppIDFromParams } from '@/navigation/useAppIDFromParams';
import { useMutationFn } from '@/queries/useMutationFn';
import List from '@/ui/adapters/List';
import ListItem from '@/ui/adapters/ListItem';
import ListItemBodyLeftLabel from '@/ui/adapters/ListItemBodyLeftLabel';
import ListItemBodyLeftSubtitle from '@/ui/adapters/ListItemBodyLeftSubtitle';
import ListItemLeftIcon from '@/ui/adapters/ListItemLeftIcon';
import Text from '@/ui/adapters/Text.vue';
import Page from '@/ui/components/Page.vue';
import PageLoading from '@/ui/components/PageLoading.vue';
import PagePaddings from '@/ui/components/PagePaddings.vue';
import AppNotFoundView from '@/views/AppNotFoundView/AppNotFoundView.vue';
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';

import image from './img.png';
import image2x from './img@2x.png';
import {
  CreateSubInvoiceLink,
  UpdateAppSubAutoRenewal,
  type UpdateAppSubAutoRenewalMutation,
  type UpdateAppSubAutoRenewalMutationVariables,
} from './operations';
import {
  setAppSubscriptionViewQueryData,
  useAppSubscriptionViewQueryOptions,
} from './query-options';

const [, e] = bem('app-subscription-view');
const { t } = useI18n({
  messages: {
    en: {
      titlePurchased: 'Premium is active',
      subtitle: 'Unlock new features with Platformer Premium only for <b>{price}</b>',
      subtitlePurchased: 'Your application has an active premium susbcription. Its special functionality is now available to you',
      limitsTitle: 'Enhanced limits',
      free: 'Free',
      premium: 'Premium',
      testGroups: 'Test Groups',
      testGroupUsers: 'Test Group Users',
      managers: 'Managers',
      featuresTitle: 'Additional features',
      customizationTitle: 'Launcher Customization',
      customizationSubtitle: 'Ability to remove Platformer branding and set your own icon',
      uniqueFnTitle: 'Unique Functionality',
      uniqueFnSubtitle: 'Access to new exciting feature only for Premium applications',
      purchase: 'Purchase',
      purchasing: 'Purchasing',
      cancelAutoRenewal: 'Cancel autorenewal',
      cancelAutoRenewalFooter: 'If you cancel the subscription, it will expire at {date}',
      enableAutoRenewal: 'Enable autorenewal',
      enableAutoRenewalFooter: 'After renewal is enabled, your subscription will be prolonged automatically',
    },
    ru: {
      titlePurchased: 'Подписка активна',
      subtitle: 'Откройте новые возможности с Platformer Premium всего за <b>{price}</b>',
      subtitlePurchased: 'Ваше приложение имеет активную премиум-подписку. Теперь её функционал доступен Вам',
      limitsTitle: 'Расширенные лимиты',
      free: 'Бесплатно',
      premium: 'Премиум',
      testGroups: 'Тестовые группы',
      testGroupUsers: 'Пользователи в тестовых группах',
      managers: 'Менеджеры',
      featuresTitle: 'Дополнительные возможности',
      customizationTitle: 'Кастомизация лаунчера',
      customizationSubtitle: 'Возможность убрать брендинг Платформера и указать свою иконку',
      uniqueFnTitle: 'Уникальный функционал',
      uniqueFnSubtitle: 'Доступ к новым возможностям только для Premium-приложений',
      purchase: 'Приобрести',
      purchasing: 'Приобретаем',
      cancelAutoRenewal: 'Отменить автопродление',
      cancelAutoRenewalFooter: 'Если вы отмените подписку, срок её действия истечёт {date}',
      enableAutoRenewal: 'Включить автопродление',
      enableAutoRenewalFooter: 'После того, как автопродление будет включены, Ваша подписка будет обновлена автоматически',
    },
  },
});
const price = 250;
const isDark = useSignal(isThemeParamsDark);

const appId = useAppIDFromParams();
const client = useQueryClient();
const {
  data: viewData,
  isPending: isViewDataLoading,
  refetch: refetchViewData,
} = useQuery(useAppSubscriptionViewQueryOptions(appId));
const createSubInvoiceLinkFn = useMutationFn(CreateSubInvoiceLink);
const {
  mutate: purchaseSubscription,
  isPending: isPurchasingSubscription,
} = useMutation({
  mutationKey: ['create-app-sub-invoice', appId],
  async mutationFn() {
    const response = await createSubInvoiceLinkFn({ appId });
    const status = await openInvoice(response.createAppSubTgInvoice, 'url');
    if (status === 'paid') {
      void refetchViewData();
    }
  },
});
const {
  mutate: updateSubAutorenewal,
  isPending: isUpdatingSubAutorenewal,
} = useMutation<
  UpdateAppSubAutoRenewalMutation,
  unknown,
  UpdateAppSubAutoRenewalMutationVariables
>({
  mutationKey: ['update-app-sub-invoice-autorenewal', appId],
  mutationFn: useMutationFn(UpdateAppSubAutoRenewal),
  onSuccess(_, vars) {
    setAppSubscriptionViewQueryData([vars.appId], client, prev => {
      if (prev?.app?.subscription) {
        prev.app.subscription.autoRenewal = vars.autoRenew;
        return prev;
      }
    });
  },
});
const isMutating = computed(() => isPurchasingSubscription.value || isUpdatingSubAutorenewal.value);

const { locale } = useI18n();
const activeSub = computed(() => {
  const sub = viewData.value?.subscription;
  if (!sub || Date.now() > new Date(sub.endsAt).getTime()) {
    return;
  }
  const date = new Date(sub.endsAt);
  return {
    autoRenewal: sub.autoRenewal,
    date: date.toLocaleDateString(locale.value, { day: '2-digit', month: 'long' }),
  };
});

watchEffect(() => {
  if (!viewData.value || activeSub.value) {
    return setMainButtonParams({ isVisible: false });
  }
  setMainButtonParams({
    isVisible: true,
    text: t(isPurchasingSubscription.value ? 'purchasing' : 'purchase'),
    isEnabled: !isPurchasingSubscription.value,
    isLoaderVisible: isPurchasingSubscription.value,
    hasShineEffect: !isPurchasingSubscription.value,
  });
  onWatcherCleanup(onMainButtonClick(purchaseSubscription));
});
</script>

<template>
  <Page preserve-main-button>
    <PagePaddings>
      <PageLoading v-if="!viewData && isViewDataLoading" />
      <AppNotFoundView v-else-if="!viewData" />
      <template v-else>
        <img
          :class="e('image')"
          :src="image"
          width="96"
          height="96"
          :srcset="`${image} 1x, ${image2x} 2x`"
        >
        <Text
          is="p"
          variant="title2"
          align="center"
          weight="semibold"
        >
          {{ activeSub ? t('titlePurchased') : 'Platformer Premium' }}
        </Text>
        <Text
          is="p"
          :class="e('subtitle')"
          align="center"
          variant="callout"
        >
          <span v-if="activeSub">{{ t('subtitlePurchased') }}</span>
          <template v-else>
            <span v-html="t('subtitle', { price })" />
            <PremiumLogo28
              :class="e('subtitle-icon')"
              size="16"
            />
          </template>
        </Text>
        <List
          :class="e('limits')"
          :title="t('limitsTitle')"
        >
          <div :class="e('limits-inner')">
            <div
              v-for="item in [
                { title: t('testGroups'), free: 1, premium: 20 },
                { title: t('testGroupUsers'), free: 3, premium: 100 },
                { title: t('managers'), free: 3, premium: 20 },
              ]"
              :key="item.title"
              :class="e('limit')"
            >
              <Text
                is="p"
                :class="e('limit-title')"
                variant="body"
              >
                {{ item.title }}
              </Text>
              <Text
                is="p"
                :class="e('limit-values')"
                variant="callout"
              >
                <span :class="e('limit-value', 'left')">
                  <span>{{ t('free') }}</span>
                  <span>{{ item.free }}</span>
                </span>
                <span :class="e('limit-value', 'right', !isDark && 'right-light')">
                  <span>{{ t('premium') }}</span>
                  <span>{{ item.premium }}</span>
                </span>
              </Text>
            </div>
          </div>
        </List>
        <List
          :class="e('features')"
          :title="t('featuresTitle')"
        >
          <ListItem large>
            <template #leftIcon>
              <ListItemLeftIcon>
                <svg
                  :class="e('feature-icon')"
                  width="28"
                  height="28"
                  viewBox="0 0 28 28"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M14.1885 2.4947C14.7114 1.04337 16.6649 0.477121 17.8472 1.61822L21.7124 5.34868C22.4355 6.04656 22.6974 7.09278 22.3676 8.04777L21.961 9.22507C21.9496 9.25793 21.9537 9.2711 21.9556 9.27692L21.9556 9.27717C21.9593 9.28898 21.9709 9.31193 21.9991 9.33557C22.0273 9.35915 22.0611 9.37391 22.0932 9.37861C22.1205 9.3826 22.1563 9.38116 22.2047 9.35778C23.0162 8.96619 23.9989 9.11495 24.652 9.74528L23.965 10.4571L24.6521 9.74528L25.0799 10.1582C26.2608 11.298 26.2608 13.1609 25.0799 14.3007L18.554 20.599C18.771 21.3164 18.5881 22.1257 18.0053 22.6881L16.7935 23.8577C15.7409 24.8736 14.0484 24.8736 12.9958 23.8577L12.2916 23.1781C11.9567 22.8548 11.2233 22.8801 10.8357 23.4135C10.0333 24.5173 8.94389 25.6805 7.6614 26.2547C7.0019 26.55 6.26226 26.702 5.48355 26.5771C4.7011 26.4515 3.96731 26.0604 3.30077 25.4171C2.63552 24.775 2.21971 24.0574 2.08549 23.2783C1.95165 22.5013 2.11575 21.7673 2.42624 21.1213C3.02699 19.8715 4.23688 18.8194 5.37429 18.0493C5.93241 17.6714 5.91683 17.0256 5.62069 16.7398L4.9166 16.0602C3.84427 15.0253 3.84427 13.3323 4.9166 12.2973L6.12847 11.1277C6.70981 10.5667 7.53738 10.3988 8.26605 10.6242L10.9759 8.00877C12.4247 6.61055 13.524 4.33902 14.1885 2.4947ZM9.85586 11.8396L17.3183 19.0418L23.7059 12.877C24.0807 12.5152 24.0807 11.9437 23.7059 11.5819L23.278 11.1689C23.2296 11.1222 23.1406 11.1031 23.0646 11.1397C21.447 11.9203 19.4455 10.4474 20.0908 8.57916L20.4974 7.40186C20.5713 7.18804 20.518 6.94564 20.3384 6.77235L16.4732 3.04189C16.4371 3.00706 16.3669 2.97447 16.254 3.00291C16.1369 3.0324 16.0718 3.10477 16.05 3.16536C15.355 5.09436 14.1305 7.71395 12.35 9.43244L9.85586 11.8396ZM7.62339 12.5059C7.57174 12.5059 7.53029 12.5246 7.50249 12.5514L6.29062 13.721C6.02436 13.978 6.02436 14.3796 6.29062 14.6366L6.99471 15.3161C8.37465 16.6479 7.86591 18.7518 6.48354 19.6877C5.43475 20.3978 4.57988 21.208 4.2095 21.9785C4.03444 22.3427 3.9864 22.6583 4.03535 22.9424C4.08392 23.2244 4.24584 23.5794 4.67479 23.9934C5.10245 24.4062 5.48 24.5726 5.79702 24.6235C6.11777 24.675 6.46572 24.6222 6.85287 24.4489C7.6637 24.0858 8.50392 23.2562 9.23519 22.2502C10.2088 20.9107 12.3245 20.46 13.6656 21.7544L14.3698 22.434C14.6558 22.71 15.1335 22.71 15.4195 22.434L16.6313 21.2645C16.6574 21.2393 16.6637 21.2157 16.6637 21.1965C16.6637 21.1773 16.6574 21.1537 16.6313 21.1285L7.74429 12.5514C7.71649 12.5246 7.67503 12.5059 7.62339 12.5059Z"
                    fill="currentcolor"
                  />
                </svg>
              </ListItemLeftIcon>
            </template>
            <template #bodyLeftLabel>
              <ListItemBodyLeftLabel>{{ t('customizationTitle') }}</ListItemBodyLeftLabel>
            </template>
            <template #bodyLeftSubtitle>
              <ListItemBodyLeftSubtitle multiline>
                {{ t('customizationSubtitle') }}
              </ListItemBodyLeftSubtitle>
            </template>
          </ListItem>

          <ListItem large>
            <template #leftIcon>
              <ListItemLeftIcon>
                <svg
                  :class="e('feature-icon')"
                  width="28"
                  height="28"
                  viewBox="0 0 28 28"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M22.795 5.83196C22.3907 5.17275 21.6652 4.82512 20.9375 4.91371C20.7664 4.93454 20.4724 5.04782 19.8999 5.4548C19.3414 5.85185 18.6353 6.43915 17.6406 7.26765L16.4789 8.23524V16.5191L17.8558 17.4896C18.8256 18.173 19.5101 18.6546 20.0502 18.9758C20.5996 19.3025 20.8814 19.388 21.0517 19.3982C21.7562 19.4401 22.4384 19.0783 22.8157 18.4351C22.9113 18.2721 23.0028 17.9722 23.0515 17.3196C23.0994 16.6772 23.1 15.8218 23.1 14.6135V9.9786C23.1 8.66293 23.0994 7.72676 23.0477 7.02811C22.9948 6.31343 22.8948 5.99467 22.795 5.83196ZM14.6789 16.0859V8.71357H8.25658C7.58281 8.71357 7.12384 8.71408 6.76691 8.73913C6.41857 8.76358 6.23491 8.80818 6.10452 8.86373C5.63364 9.06435 5.25172 9.45277 5.05084 9.95159C4.99338 10.0943 4.94907 10.2916 4.92501 10.6543C4.90044 11.0247 4.89998 11.4998 4.89998 12.1918V13.7378C4.89998 14.0624 4.90083 14.1674 4.90778 14.2479C4.99346 15.2399 5.7516 15.9944 6.6685 16.0782C6.74264 16.0849 6.8407 16.0859 7.15788 16.0859H14.6789ZM15.2532 6.91357L16.5194 5.85891C17.4764 5.06177 18.2354 4.4296 18.857 3.98771C19.4713 3.55102 20.0763 3.20527 20.7199 3.12691C22.1648 2.95101 23.5663 3.64686 24.3294 4.89076C24.6673 5.44172 24.7862 6.13039 24.8428 6.89532C24.9 7.66843 24.9 8.6715 24.9 9.93989V14.6518C24.9 15.8132 24.9 16.7361 24.8465 17.4535C24.7932 18.1686 24.6807 18.8134 24.3683 19.3459C23.6576 20.5575 22.3427 21.2783 20.9447 21.195C20.3265 21.1582 19.7354 20.8828 19.1302 20.5229C18.5228 20.1618 17.7813 19.6392 16.8514 18.9838L15.2936 17.8859H14.9V21.3561C14.9 23.2893 13.3699 24.9 11.4295 24.9C10.7733 24.9 10.117 24.7118 9.55571 24.3307C8.30866 23.4842 7.40319 22.7153 6.87461 21.5313C6.44227 20.5629 6.29922 19.3942 6.26612 17.8411C4.5617 17.5732 3.26505 16.1463 3.11446 14.4028C3.09991 14.2344 3.09994 14.0449 3.09998 13.7804C3.09998 13.7664 3.09998 13.7522 3.09998 13.7378L3.09998 12.1614C3.09998 11.5072 3.09997 10.9722 3.12896 10.5352C3.1589 10.0838 3.2226 9.6729 3.38115 9.27919C3.75629 8.34764 4.47924 7.59963 5.399 7.20776C5.79011 7.04113 6.19775 6.97465 6.6409 6.94355C7.06832 6.91355 7.59069 6.91356 8.22478 6.91357L15.2532 6.91357ZM8.06808 17.8859C8.10397 19.3237 8.2377 20.1691 8.51825 20.7975C8.83259 21.5016 9.37876 22.0351 10.5666 22.8414C10.815 23.01 11.1155 23.1 11.4295 23.1C12.3283 23.1 13.1 22.3433 13.1 21.3561V17.8859H8.06808Z"
                    fill="currentcolor"
                  />
                </svg>
              </ListItemLeftIcon>
            </template>
            <template #bodyLeftLabel>
              <ListItemBodyLeftLabel>{{ t('uniqueFnTitle') }}</ListItemBodyLeftLabel>
            </template>
            <template #bodyLeftSubtitle>
              <ListItemBodyLeftSubtitle multiline>
                {{ t('uniqueFnSubtitle') }}
              </ListItemBodyLeftSubtitle>
            </template>
          </ListItem>
        </List>
        <List
          v-if="activeSub"
          :class="e('actions')"
          :footer="activeSub.autoRenewal
            ? t('cancelAutoRenewalFooter', { date: activeSub.date })
            : t('enableAutoRenewalFooter')"
        >
          <ListItem
            :variant="isMutating
              ? 'placeholder'
              : activeSub.autoRenewal
                ? 'destructive'
                : 'accent'"
            :clickable="!isMutating"
            @click="
              !isMutating && updateSubAutorenewal({ appId, autoRenew: !activeSub.autoRenewal })
            "
          >
            <template #bodyLeftLabel>
              <ListItemBodyLeftLabel>
                {{ t(activeSub.autoRenewal ? 'cancelAutoRenewal' : 'enableAutoRenewal') }}
              </ListItemBodyLeftLabel>
            </template>
          </ListItem>
        </List>
      </template>
    </PagePaddings>
  </page>
</template>

<style lang="scss">
.app-subscription-view {
  &__image {
    display: block;
    margin: 0 auto 20px;
  }

  &__subtitle {
    color: var(--theme-subtitle-text-color);
    margin-top: 4px;

    &-icon {
      vertical-align: baseline;
      margin: 0 0 -2px 1px;
    }
  }

  &__limits {
    margin-top: 20px;

    &-inner {
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding: 16px;
    }
  }

  &__limit {
    &-title {
      margin-bottom: 8px;
    }

    &-values {
      border-radius: 8px;
      overflow: hidden;
      display: flex;
    }

    &-value {
      padding: 8px 12px;
      flex: 1 0 50%;
      display: flex;
      justify-content: space-between;

      &--left {
        background-color: var(--theme-section-separator-color);
      }

      &--right {
        background-color: #007AFF;
        // TODO: Temp disabled due to some custom themes in Telegram.
        // background-color: var(--theme-accent-text-color);

        &-light {
          color: white;
        }
      }
    }
  }

  &__features {
    margin-top: 28px;
  }

  &__feature-icon {
    color: var(--theme-accent-text-color);
  }

  &__actions {
    margin-top: 8px;
  }
}
</style>
