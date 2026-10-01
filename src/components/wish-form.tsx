import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { SheetHeader } from '@/components/sheet-header';
import { Button } from '@/components/ui/button';
import { Chip } from '@/components/ui/chip';
import { Field } from '@/components/ui/field';
import { Screen } from '@/components/ui/screen';
import { Txt } from '@/components/ui/text';
import { useAppData, type WishlistDraft } from '@/data/app-data-context';
import { PurchaseKind } from '@/domain/constants';
import { parseAmount } from '@/domain/money';
import { Copy, PurchaseKindLabel, PurchaseKinds, WishlistCategories, WishlistCategoryLabel } from '@/i18n/copy';
import { Spacing } from '@/theme/tokens';

type WishFormProps = {
  title: string;
  initial?: WishlistDraft;
  wishId?: string;
  onDelete?: () => void;
};

export function WishForm({ title, initial, wishId, onDelete }: WishFormProps) {
  const data = useAppData();
  const router = useRouter();
  const [name, setName] = useState(initial?.name ?? '');
  const [category, setCategory] = useState(initial?.category ?? WishlistCategories[0]);
  const [purchaseKind, setPurchaseKind] = useState(initial?.purchaseKind ?? PurchaseKind.Desire);
  const [amountText, setAmountText] = useState(initial ? String(initial.targetAmount) : '');
  const amount = parseAmount(amountText);
  const ready = name.trim().length > 1 && amount !== null;

  return (
    <Screen clearance={32}>
      <SheetHeader title={title} />
      <Field label={Copy.needs.name} value={name} onChangeText={setName} />
      <View style={styles.block}>
        <Txt variant="label">{Copy.form.category}</Txt>
        <View style={styles.row}>
          {WishlistCategories.map((item) => (
            <Chip key={item} label={WishlistCategoryLabel[item]} selected={category === item} onPress={() => setCategory(item)} />
          ))}
        </View>
      </View>
      <View style={styles.block}>
        <Txt variant="label">{Copy.form.kind}</Txt>
        <View style={styles.row}>
          {PurchaseKinds.map((item) => (
            <Chip key={item} label={PurchaseKindLabel[item]} selected={purchaseKind === item} onPress={() => setPurchaseKind(item)} />
          ))}
        </View>
      </View>
      <Field label={Copy.needs.target} value={amountText} onChangeText={setAmountText} keyboardType="decimal-pad" />
      <Button
        label={Copy.form.save}
        disabled={!ready}
        onPress={() => {
          if (!ready || amount === null) {
            return;
          }
          void data
            .saveWish({ name: name.trim(), category, purchaseKind, targetAmount: amount }, wishId)
            .then(() => router.back());
        }}
      />
      {onDelete ? <Button label={Copy.needs.remove} tone="quiet" onPress={onDelete} /> : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  block: {
    gap: Spacing.sm,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
});
