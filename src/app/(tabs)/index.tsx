import { type Href, useRouter } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { WalletCard } from '@/components/wallet-card';
import { Panel } from '@/components/ui/panel';
import { Screen } from '@/components/ui/screen';
import { Txt } from '@/components/ui/text';
import { useAppData } from '@/data/app-data-context';
import { daysBetween, formatDay } from '@/domain/dates';
import { formatMoney } from '@/domain/money';
import { CadenceLabel, Copy, duePhrase } from '@/i18n/copy';
import { Palette, Spacing } from '@/theme/tokens';

export default function TodayScreen() {
  const data = useAppData();
  const router = useRouter();
  const pulse =
    data.unworthy === 0 ? Copy.today.pulseEmpty : data.unworthy === 1 ? Copy.today.pulseOne : Copy.today.pulseMany(data.unworthy);

  return (
    <Screen>
      <Animated.View entering={FadeInDown.duration(420)} style={styles.intro}>
        <Txt variant="label">{Copy.appName}</Txt>
        <Txt variant="hero">{Copy.today.kicker}</Txt>
        <Txt variant="soft">{Copy.today.lead}</Txt>
      </Animated.View>

      {data.reminders.length === 0 ? (
        <Panel tone="sage">
          <Txt variant="body">{Copy.today.quiet}</Txt>
        </Panel>
      ) : (
        data.reminders.map((bill) => {
          const overdue = daysBetween(data.today, bill.nextDue) < 0;
          return (
            <Pressable key={bill.id} onPress={() => router.push(`/cuenta/${bill.id}` as Href)}>
              <Panel tone={overdue ? 'blush' : 'sage'}>
                <Txt variant="label">{duePhrase(data.today, bill.nextDue)}</Txt>
                <Txt variant="heading">{bill.name}</Txt>
                <Txt variant="soft">
                  {formatMoney(bill.amount)} · {formatDay(bill.nextDue)} · {CadenceLabel[bill.cadence]}
                </Txt>
              </Panel>
            </Pressable>
          );
        })
      )}

      <WalletCard
        name={data.wallet.name}
        balance={formatMoney(data.balance)}
        onPress={() => router.push('/tarjeta' as Href)}
      />

      <View style={styles.row}>
        <Panel style={styles.half}>
          <Txt variant="label">{Copy.today.in}</Txt>
          <Txt variant="heading">{formatMoney(data.monthIncome)}</Txt>
        </Panel>
        <Panel style={styles.half}>
          <Txt variant="label">{Copy.today.out}</Txt>
          <Txt variant="heading">{formatMoney(data.monthExpense)}</Txt>
        </Panel>
      </View>

      <Panel tone={data.unworthy > 0 ? 'blush' : 'card'}>
        <Txt variant="body">{pulse}</Txt>
      </Panel>

      <View style={styles.section}>
        <Txt variant="heading">{Copy.today.bills}</Txt>
        <Pressable onPress={() => router.push('/cuenta/nueva' as Href)}>
          <Txt variant="soft" style={styles.link}>
            {Copy.today.addBill}
          </Txt>
        </Pressable>
      </View>

      {data.bills.map((bill) => (
        <Pressable key={bill.id} onPress={() => router.push(`/cuenta/${bill.id}` as Href)}>
          <Panel>
            <Txt variant="body">{bill.name}</Txt>
            <Txt variant="soft">
              {formatMoney(bill.amount)} · {duePhrase(data.today, bill.nextDue)}
            </Txt>
          </Panel>
        </Pressable>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  intro: {
    gap: Spacing.sm,
  },
  row: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  half: {
    flex: 1,
  },
  section: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
  },
  link: {
    color: Palette.blush,
  },
});
