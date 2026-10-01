import { type Href, useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Field } from '@/components/ui/field';
import { Panel } from '@/components/ui/panel';
import { Screen } from '@/components/ui/screen';
import { Txt } from '@/components/ui/text';
import { useAppData } from '@/data/app-data-context';
import { parseAmount, formatMoney } from '@/domain/money';
import { Copy, PurchaseKindLabel, WishlistCategoryLabel } from '@/i18n/copy';
import { Palette, Spacing } from '@/theme/tokens';

export default function NeedsScreen() {
  const data = useAppData();
  const router = useRouter();
  const [draft, setDraft] = useState(String(data.monthlyBudget));

  const rows = data.pour.lines
    .map((line) => ({ line, item: data.wishlist.find((wish) => wish.id === line.id) }))
    .filter((row): row is { line: (typeof data.pour.lines)[number]; item: NonNullable<(typeof row)['item']> } => Boolean(row.item));

  function commitBudget() {
    const amount = parseAmount(draft) ?? (draft.trim() === '0' ? 0 : null);
    if (amount === null) {
      return;
    }
    void data.setMonthlyBudget(amount);
  }

  return (
    <Screen>
      <View style={styles.intro}>
        <Txt variant="title">{Copy.needs.title}</Txt>
        <Txt variant="soft">{Copy.needs.lead}</Txt>
      </View>
      <Field
        label={Copy.needs.budget}
        value={draft}
        onChangeText={setDraft}
        onEndEditing={commitBudget}
        keyboardType="decimal-pad"
      />
      <View style={styles.row}>
        <Panel style={styles.half} tone="blush">
          <Txt variant="label">{Copy.needs.reserved}</Txt>
          <Txt variant="heading">{formatMoney(data.pour.reserve)}</Txt>
        </Panel>
        <Panel style={styles.half} tone="sage">
          <Txt variant="label">{Copy.needs.free}</Txt>
          <Txt variant="heading">{formatMoney(data.pour.free)}</Txt>
        </Panel>
      </View>
      <Button label={Copy.needs.add} tone="quiet" onPress={() => router.push('/lista/nueva' as Href)} />
      {rows.length === 0 ? (
        <Panel>
          <Txt variant="body">{Copy.needs.empty}</Txt>
        </Panel>
      ) : (
        rows.map(({ line, item }) => {
          const ratio = item.targetAmount === 0 ? 0 : Math.min(1, line.allocated / item.targetAmount);
          const state = line.waiting ? Copy.needs.waiting : line.partial ? Copy.needs.partial : Copy.needs.funded;
          return (
            <Pressable key={item.id} onPress={() => router.push(`/lista/${item.id}` as Href)}>
              <Panel>
                <Txt variant="label">{WishlistCategoryLabel[item.category]}</Txt>
                <Txt variant="heading">{item.name}</Txt>
                <Txt variant="soft">
                  {PurchaseKindLabel[item.purchaseKind]} · {formatMoney(line.allocated)} de {formatMoney(item.targetAmount)}
                </Txt>
                <View style={styles.track}>
                  <View style={[styles.fill, { width: `${ratio * 100}%` }]} />
                </View>
                <Txt variant="soft">{state}</Txt>
              </Panel>
            </Pressable>
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
    gap: Spacing.md,
  },
  half: {
    flex: 1,
  },
  track: {
    height: 8,
    borderRadius: 8,
    backgroundColor: Palette.paperDeep,
    overflow: 'hidden',
  },
  fill: {
    height: 8,
    backgroundColor: Palette.sage,
  },
});
