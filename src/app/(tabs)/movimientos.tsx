import { type Href, useRouter } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { Face } from '@/components/faces';
import { Button } from '@/components/ui/button';
import { Panel } from '@/components/ui/panel';
import { Screen } from '@/components/ui/screen';
import { Txt } from '@/components/ui/text';
import { useAppData } from '@/data/app-data-context';
import { MovementKind, type SatisfactionLevel } from '@/domain/constants';
import { formatDay } from '@/domain/dates';
import { formatMoney } from '@/domain/money';
import { AfterFeelingLabel, Copy, ExpenseCategoryLabel, PurchaseKindLabel } from '@/i18n/copy';
import { Palette, Spacing } from '@/theme/tokens';

export default function MovementsScreen() {
  const data = useAppData();
  const router = useRouter();

  return (
    <Screen>
      <View style={styles.intro}>
        <Txt variant="title">{Copy.movements.title}</Txt>
        <Txt variant="soft">{Copy.movements.lead}</Txt>
      </View>
      <Button label={Copy.movements.add} onPress={() => router.push('/movimiento/nuevo' as Href)} />
      {data.movements.length === 0 ? (
        <Panel>
          <Txt variant="body">{Copy.movements.empty}</Txt>
        </Panel>
      ) : (
        data.movements.map((movement) => {
          const incoming = movement.kind === MovementKind.Income;
          return (
            <Panel key={movement.id}>
              <View style={styles.row}>
                {movement.satisfaction ? <Face mood={movement.satisfaction as SatisfactionLevel} size={40} /> : null}
                <View style={styles.copy}>
                  <Txt variant="body">{incoming ? Copy.movements.income : ExpenseCategoryLabel[movement.category ?? 'comida']}</Txt>
                  <Txt variant="soft">{formatDay(movement.occurredOn)}{movement.note ? ` · ${movement.note}` : ''}</Txt>
                  {!incoming && movement.purchaseKind ? (
                    <Txt variant="soft">
                      {PurchaseKindLabel[movement.purchaseKind]}
                      {movement.worthIt === false ? ' · no valió la pena' : movement.worthIt ? ' · valió la pena' : ''}
                      {movement.afterFeeling ? ` · ${AfterFeelingLabel[movement.afterFeeling]}` : ''}
                    </Txt>
                  ) : null}
                </View>
                <Txt variant="heading" style={{ color: incoming ? Palette.sage : Palette.blush }}>
                  {incoming ? '+' : '−'}
                  {formatMoney(movement.amount)}
                </Txt>
              </View>
              <Pressable accessibilityRole="button" onPress={() => data.removeMovement(movement.id)}>
                <Txt variant="soft">{Copy.movements.remove}</Txt>
              </Pressable>
            </Panel>
          );
        })
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  intro: {
    gap: Spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  copy: {
    flex: 1,
    gap: 2,
  },
});
