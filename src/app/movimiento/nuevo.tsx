import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Face } from '@/components/faces';
import { SheetHeader } from '@/components/sheet-header';
import { Button } from '@/components/ui/button';
import { Chip } from '@/components/ui/chip';
import { Field } from '@/components/ui/field';
import { Screen } from '@/components/ui/screen';
import { Txt } from '@/components/ui/text';
import { useAppData } from '@/data/app-data-context';
import {
  MovementKind,
  SatisfactionLevels,
  type AfterFeeling,
  type ExpenseCategory,
  type PurchaseKind as PurchaseKindValue,
  type SatisfactionLevel,
} from '@/domain/constants';
import { isDayKey, todayKey } from '@/domain/dates';
import { parseAmount } from '@/domain/money';
import {
  AfterFeelingLabel,
  AfterFeelings,
  Copy,
  ExpenseCategories,
  ExpenseCategoryLabel,
  PurchaseKindLabel,
  PurchaseKinds,
  SatisfactionLabel,
} from '@/i18n/copy';
import { Spacing } from '@/theme/tokens';

export default function NewMovementScreen() {
  const data = useAppData();
  const router = useRouter();
  const [step, setStep] = useState<'amount' | 'feeling'>('amount');
  const [kind, setKind] = useState<(typeof MovementKind)[keyof typeof MovementKind]>(MovementKind.Expense);
  const [amountText, setAmountText] = useState('');
  const [category, setCategory] = useState<ExpenseCategory | null>(null);
  const [note, setNote] = useState('');
  const [occurredOn, setOccurredOn] = useState(todayKey());
  const [satisfaction, setSatisfaction] = useState<SatisfactionLevel | null>(null);
  const [worthIt, setWorthIt] = useState<boolean | null>(null);
  const [purchaseKind, setPurchaseKind] = useState<PurchaseKindValue | null>(null);
  const [afterFeeling, setAfterFeeling] = useState<AfterFeeling | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  const amount = parseAmount(amountText);
  const dateOk = isDayKey(occurredOn);
  const expenseReady = kind === MovementKind.Income || category !== null;
  const amountReady = amount !== null && dateOk && expenseReady;
  const feelingReady = satisfaction !== null && worthIt !== null && purchaseKind !== null && afterFeeling !== null;

  async function save(withFeeling: boolean) {
    if (amount === null || !dateOk) {
      return;
    }
    setSaveError(null);
    void Haptics.selectionAsync().catch(() => undefined);
    try {
      await data.saveMovement({
        kind,
        amount,
        category: kind === MovementKind.Expense ? category : null,
        note: note.trim(),
        occurredOn,
        satisfaction: withFeeling ? satisfaction : null,
        worthIt: withFeeling ? worthIt : null,
        purchaseKind: withFeeling ? purchaseKind : null,
        afterFeeling: withFeeling ? afterFeeling : null,
      });
      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace('/');
      }
    } catch (caught) {
      setSaveError(caught instanceof Error ? caught.message : 'No se pudo guardar');
    }
  }

  return (
    <Screen clearance={32}>
      <SheetHeader title={Copy.form.newMovement} />
      <View style={styles.kinds}>
        <Chip
          label={Copy.movements.expense}
          selected={kind === MovementKind.Expense}
          onPress={() => {
            setKind(MovementKind.Expense);
            setStep('amount');
          }}
        />
        <Chip
          label={Copy.movements.income}
          selected={kind === MovementKind.Income}
          onPress={() => {
            setKind(MovementKind.Income);
            setStep('amount');
          }}
        />
      </View>

      {step === 'amount' ? (
        <View style={styles.block}>
          <Field label={Copy.form.amount} value={amountText} onChangeText={setAmountText} keyboardType="decimal-pad" placeholder="0.00" />
          {kind === MovementKind.Expense ? (
            <View style={styles.block}>
              <Txt variant="label">{Copy.form.category}</Txt>
              <View style={styles.kinds}>
                {ExpenseCategories.map((item) => (
                  <Chip key={item} label={ExpenseCategoryLabel[item]} selected={category === item} onPress={() => setCategory(item)} />
                ))}
              </View>
            </View>
          ) : null}
          <Field label={Copy.form.note} value={note} onChangeText={setNote} placeholder={Copy.form.notePlaceholder} />
          <Field label={Copy.form.date} value={occurredOn} onChangeText={setOccurredOn} hint={Copy.form.dateHint} autoCapitalize="none" />
          {kind === MovementKind.Expense ? (
            <Button label={Copy.form.continue} disabled={!amountReady} onPress={() => setStep('feeling')} />
          ) : (
            <Button label={Copy.form.save} disabled={!amountReady} onPress={() => void save(false)} />
          )}
        </View>
      ) : (
        <View style={styles.block}>
          <Txt variant="label">{Copy.form.satisfaction}</Txt>
          <View style={styles.faces}>
            {SatisfactionLevels.map((level) => (
              <Pressable key={level} accessibilityLabel={SatisfactionLabel[level]} onPress={() => setSatisfaction(level)}>
                <Face mood={level} selected={satisfaction === level} />
                <Txt variant="soft" style={styles.faceLabel}>
                  {SatisfactionLabel[level]}
                </Txt>
              </Pressable>
            ))}
          </View>
          <Txt variant="label">{Copy.form.worth}</Txt>
          <View style={styles.kinds}>
            <Chip label={Copy.form.yes} selected={worthIt === true} onPress={() => setWorthIt(true)} />
            <Chip label={Copy.form.no} selected={worthIt === false} onPress={() => setWorthIt(false)} />
          </View>
          <Txt variant="label">{Copy.form.kind}</Txt>
          <View style={styles.kinds}>
            {PurchaseKinds.map((item) => (
              <Chip key={item} label={PurchaseKindLabel[item]} selected={purchaseKind === item} onPress={() => setPurchaseKind(item)} />
            ))}
          </View>
          <Txt variant="label">{Copy.form.after}</Txt>
          <View style={styles.kinds}>
            {AfterFeelings.map((item) => (
              <Chip key={item} label={AfterFeelingLabel[item]} selected={afterFeeling === item} onPress={() => setAfterFeeling(item)} />
            ))}
          </View>
          {!feelingReady ? <Txt variant="soft">{Copy.form.needEmotion}</Txt> : null}
          {saveError ? <Txt variant="soft">{saveError}</Txt> : null}
          <Button label={Copy.form.save} disabled={!feelingReady} onPress={() => void save(true)} />
          <Button label={Copy.form.back} tone="quiet" onPress={() => setStep('amount')} />
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  kinds: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  block: {
    gap: Spacing.lg,
  },
  faces: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  faceLabel: {
    textAlign: 'center',
    marginTop: 4,
  },
});
