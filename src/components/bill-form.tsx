import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { SheetHeader } from '@/components/sheet-header';
import { Button } from '@/components/ui/button';
import { Chip } from '@/components/ui/chip';
import { Field } from '@/components/ui/field';
import { Screen } from '@/components/ui/screen';
import { Txt } from '@/components/ui/text';
import { useAppData, type BillDraft } from '@/data/app-data-context';
import { BillCadence } from '@/domain/constants';
import { isDayKey, shiftDayKey, todayKey } from '@/domain/dates';
import { parseAmount } from '@/domain/money';
import { CadenceLabel, Cadences, Copy } from '@/i18n/copy';
import { Spacing } from '@/theme/tokens';

type BillFormProps = {
  title: string;
  initial?: BillDraft;
  onDelete?: () => void;
  billId?: string;
};

export function BillForm({ title, initial, onDelete, billId }: BillFormProps) {
  const data = useAppData();
  const router = useRouter();
  const [name, setName] = useState(initial?.name ?? '');
  const [amountText, setAmountText] = useState(initial ? String(initial.amount) : '');
  const [cadence, setCadence] = useState(initial?.cadence ?? BillCadence.Monthly);
  const [nextDue, setNextDue] = useState(initial?.nextDue ?? shiftDayKey(todayKey(), 7));
  const amount = parseAmount(amountText);
  const ready = name.trim().length > 1 && amount !== null && isDayKey(nextDue);

  return (
    <Screen clearance={32}>
      <SheetHeader title={title} />
      <Field label={Copy.bills.name} value={name} onChangeText={setName} />
      <Field label={Copy.bills.amount} value={amountText} onChangeText={setAmountText} keyboardType="decimal-pad" />
      <View style={styles.block}>
        <Txt variant="label">{Copy.bills.cadence}</Txt>
        <View style={styles.row}>
          {Cadences.map((item) => (
            <Chip key={item} label={CadenceLabel[item]} selected={cadence === item} onPress={() => setCadence(item)} />
          ))}
        </View>
      </View>
      <Field label={Copy.bills.next} value={nextDue} onChangeText={setNextDue} hint={Copy.form.dateHint} autoCapitalize="none" />
      <Txt variant="soft">{Copy.bills.savedQuiet}</Txt>
      <Button
        label={Copy.form.save}
        disabled={!ready}
        onPress={() => {
          if (!ready || amount === null) {
            return;
          }
          void data.saveBill({ name: name.trim(), amount, cadence, nextDue }, billId).then(() => router.back());
        }}
      />
      {onDelete ? <Button label={Copy.bills.remove} tone="quiet" onPress={onDelete} /> : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  block: {
    gap: Spacing.sm,
  },
  row: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
});
