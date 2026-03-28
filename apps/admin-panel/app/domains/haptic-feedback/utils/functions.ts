import {
  hapticFeedback,
  type NotificationHapticFeedbackType,
  type ImpactHapticFeedbackStyle,
} from '@tma.js/sdk-vue';

export function hapticImpactOccurred(style: ImpactHapticFeedbackStyle) {
  hapticFeedback.impactOccurred.ifAvailable(style);
}

export function hapticNotificationOccurred(type: NotificationHapticFeedbackType) {
  hapticFeedback.notificationOccurred.ifAvailable(type);
}

export function hapticSelectionChanged() {
  hapticFeedback.selectionChanged.ifAvailable();
}
