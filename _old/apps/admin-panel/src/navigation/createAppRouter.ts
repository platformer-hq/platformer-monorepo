import { createRouter, createWebHashHistory } from 'vue-router';

import AppGeneralView from '@/views/AppGeneralView/AppGeneralView.vue';
import AppManagersView from '@/views/AppManagersView/AppManagersView.vue';
import AppSubscriptionView from '@/views/AppSubscriptionView/AppSubscriptionView.vue';
import AppsView from '@/views/AppsView/AppsView.vue';
import AppTestGroupCreateView from '@/views/AppTestGroupCreateView/AppTestGroupCreateView.vue';
import AppTestGroupsView from '@/views/AppTestGroupsView/AppTestGroupsView.vue';
import AppTestGroupView from '@/views/AppTestGroupView/AppTestGroupView.vue';
import AppTgIntegrationView from '@/views/AppTgIntegrationView/AppTgIntegrationView.vue';
import AppTgLauncherView from '@/views/AppTgLauncherView/AppTgLauncherView.vue';
import AppTgView from '@/views/AppTgView/AppTgView.vue';
import AppTransferView from '@/views/AppTransferView/AppTransferView.vue';
import AppUrlsView from '@/views/AppUrlsView/AppUrlsView.vue';
import AppUrlViewerView from '@/views/AppUrlViewerView/AppUrlViewerView.vue';
import AppView from '@/views/AppView/AppView.vue';
import CreateAppView from '@/views/CreateAppView/CreateAppView.vue';
import HomeView from '@/views/HomeView/HomeView.vue';
import InvitesView from '@/views/InvitesView/InvitesView.vue';
import PrivacyView from '@/views/PrivacyView/PrivacyView.vue';
import ProfileView from '@/views/ProfileView/ProfileView.vue';
import TransfersView from '@/views/TransfersView/TransfersView.vue';

export function createAppRouter() {
  return createRouter({
    history: createWebHashHistory('/'),
    routes: [
      { path: '/', component: HomeView },
      { path: '/profile', component: ProfileView },
      { path: '/privacy', component: PrivacyView },
      { path: '/apps', component: AppsView },
      { path: '/apps/create', component: CreateAppView },
      { path: '/apps/:appID', component: AppView },
      { path: '/apps/:appID/general', component: AppGeneralView },
      { path: '/apps/:appID/managers', component: AppManagersView },
      { path: '/apps/:appID/urls', component: AppUrlsView },
      { path: '/apps/:appID/transfer', component: AppTransferView },
      { path: '/apps/:appID/test-groups', component: AppTestGroupsView },
      { path: '/apps/:appID/test-groups/create', component: AppTestGroupCreateView },
      { path: '/apps/:appID/test-groups/:testGroupId', component: AppTestGroupView },
      { path: '/apps/:appID/url-viewer', component: AppUrlViewerView },
      { path: '/apps/:appID/premium', component: AppSubscriptionView },
      { path: '/apps/:appID/telegram', component: AppTgView },
      { path: '/apps/:appID/telegram/launcher', component: AppTgLauncherView },
      { path: '/apps/:appID/telegram/integration', component: AppTgIntegrationView },
      { path: '/invites', component: InvitesView },
      { path: '/transfers', component: TransfersView },
      { path: '/:pathMatch(.*)*', redirect: { path: '/', replace: true } },
    ],
  });
}
