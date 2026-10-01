import { BillForm } from '@/components/bill-form';
import { Copy } from '@/i18n/copy';

export default function NewBillScreen() {
  return <BillForm title={Copy.bills.newTitle} />;
}
