import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

import { reminderInstant } from '@/domain/bills';
import { formatMoney } from '@/domain/money';
import type { Bill } from '@/domain/types';

try {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });
} catch {
  // The web preview has no notification runtime. The in-app card still works.
}

/**
 * Programa el aviso del día anterior. Devuelve null si ella no da permiso,
 * si la fecha ya pasó, o si la plataforma no puede avisar.
 */
export async function scheduleBillReminder(bill: Pick<Bill, 'name' | 'amount' | 'nextDue'>): Promise<string | null> {
  if (Platform.OS === 'web') {
    return null;
  }

  const when = reminderInstant(bill.nextDue);
  if (!when) {
    return null;
  }

  try {
    const current = await Notifications.getPermissionsAsync();
    const allowed = current.granted || current.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL;
    if (!allowed) {
      const asked = await Notifications.requestPermissionsAsync();
      if (!asked.granted) {
        return null;
      }
    }

    return await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Mañana toca pagarlo',
        body: `${bill.name} · ${formatMoney(bill.amount)}`,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: when,
      },
    });
  } catch {
    return null;
  }
}

export async function cancelReminder(notificationId: string | null): Promise<void> {
  if (!notificationId || Platform.OS === 'web') {
    return;
  }
  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  } catch {
    // The scheduled alert may already have fired.
  }
}
