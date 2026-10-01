import { useLocalSearchParams, useRouter } from 'expo-router';

import { Screen } from '@/components/ui/screen';
import { Txt } from '@/components/ui/text';
import { WishForm } from '@/components/wish-form';
import { useAppData } from '@/data/app-data-context';
import { Copy } from '@/i18n/copy';

export default function EditWishScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const data = useAppData();
  const router = useRouter();
  const wish = data.wishlist.find((item) => item.id === id);

  if (!wish) {
    return (
      <Screen clearance={32}>
        <Txt variant="body">{Copy.needs.editTitle}</Txt>
      </Screen>
    );
  }

  return (
    <WishForm
      title={Copy.needs.editTitle}
      wishId={wish.id}
      initial={{
        name: wish.name,
        category: wish.category,
        purchaseKind: wish.purchaseKind,
        targetAmount: wish.targetAmount,
      }}
      onDelete={() => {
        void data.removeWish(wish.id).then(() => router.back());
      }}
    />
  );
}
