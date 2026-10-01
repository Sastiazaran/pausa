import { WishForm } from '@/components/wish-form';
import { Copy } from '@/i18n/copy';

export default function NewWishScreen() {
  return <WishForm title={Copy.needs.newTitle} />;
}
