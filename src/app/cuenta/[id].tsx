import { useLocalSearchParams, useRouter } from 'expo-router';

import { BillForm } from '@/components/bill-form';
import { Screen } from '@/components/ui/screen';
import { Txt } from '@/components/ui/text';
import { useAppData } from '@/data/app-data-context';
import { Copy } from '@/i18n/copy';

export default function EditBillScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const data = useAppData();
  const router = useRouter();
  const bill = data.bills.find((item) => item.id === id);

  if (!bill) {
    return (
      <Screen clearance={32}>
        <Txt variant="body">{Copy.bills.editTitle}</Txt>
      </Screen>
    );
  }

  return (
    <BillForm
      title={Copy.bills.editTitle}
      billId={bill.id}
      initial={{ name: bill.name, amount: bill.amount, cadence: bill.cadence, nextDue: bill.nextDue }}
      onDelete={() => {
        void data.removeBill(bill.id).then(() => router.back());
      }}
    />
  );
}
