import { useRouter } from 'expo-router';
import { useState } from 'react';

import { SheetHeader } from '@/components/sheet-header';
import { Button } from '@/components/ui/button';
import { Field } from '@/components/ui/field';
import { Screen } from '@/components/ui/screen';
import { useAppData } from '@/data/app-data-context';
import { parseAmount } from '@/domain/money';
import { Copy } from '@/i18n/copy';

export default function WalletScreen() {
  const data = useAppData();
  const router = useRouter();
  const [name, setName] = useState(data.wallet.name);
  const [starting, setStarting] = useState(data.wallet.startingBalance === 0 ? '' : String(data.wallet.startingBalance));
  const amount = starting.trim() === '' || starting.trim() === '0' ? 0 : parseAmount(starting);
  const ready = name.trim().length > 0 && amount !== null;

  return (
    <Screen clearance={32}>
      <SheetHeader title={Copy.wallet.edit} />
      <Field label={Copy.wallet.name} value={name} onChangeText={setName} />
      <Field
        label={Copy.wallet.starting}
        hint={Copy.wallet.startingHint}
        value={starting}
        onChangeText={setStarting}
        keyboardType="decimal-pad"
        placeholder="0"
      />
      <Button
        label={Copy.form.save}
        disabled={!ready}
        onPress={() => {
          if (!ready || amount === null) {
            return;
          }
          void data.setWallet(name.trim(), amount).then(() => router.back());
        }}
      />
    </Screen>
  );
}
