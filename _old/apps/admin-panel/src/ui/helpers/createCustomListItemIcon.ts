import { h, type Component } from 'vue';

import CustomListItemIcon, { type CustomListItemIconProps } from '@/ui/components/CustomListItemIcon.vue';

export function createCustomListItemIcon(
  icon: CustomListItemIconProps['icon'],
  iconSize: number,
  background: string,
): Component<{ class?: string }> {
  return props => h(CustomListItemIcon, { ...props, background, icon, iconSize });
}
