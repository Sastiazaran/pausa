import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Chip } from '@/components/ui/chip';
import { Field } from '@/components/ui/field';
import { Panel } from '@/components/ui/panel';
import { Screen } from '@/components/ui/screen';
import { Txt } from '@/components/ui/text';
import { useAppData } from '@/data/app-data-context';
import { fetchProfecoGroups, localPriceGroups, ProfecoMeta, sliceHasState } from '@/data/profeco';
import { PriceSuggestions, ProfecoStates, Unbranded } from '@/domain/constants';
import { formatDay } from '@/domain/dates';
import { foldText, type PriceGroup } from '@/domain/prices';
import { formatMoney, parseAmount } from '@/domain/money';
import { Copy } from '@/i18n/copy';
import { Palette, Spacing } from '@/theme/tokens';

const VisibleGroups = 8;

function brandLabel(brand: string): string | null {
  if (!brand || brand === Unbranded) {
    return null;
  }
  return brand;
}

export default function PricesScreen() {
  const data = useAppData();
  const [query, setQuery] = useState('Leche');
  const [live, setLive] = useState<PriceGroup[] | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'live' | 'failed'>('idle');

  const local = useMemo(() => localPriceGroups(data.city, query), [data.city, query]);
  const groups = (status === 'live' && live ? live : local).slice(0, VisibleGroups);
  const hidden = (status === 'live' && live ? live.length : local.length) > VisibleGroups;
  const notes = data.priceNotes.filter(
    (note) => note.state === data.city && (query.trim().length < 2 || foldText(note.productName).includes(foldText(query))),
  );

  async function refresh() {
    if (query.trim().length < 2) {
      return;
    }
    setStatus('loading');
    try {
      const next = await fetchProfecoGroups(data.city, query);
      setLive(next);
      setStatus('live');
    } catch {
      setLive(null);
      setStatus('failed');
    }
  }

  function chooseState(state: string) {
    setLive(null);
    setStatus('idle');
    void data.setCity(state);
  }

  return (
    <Screen>
      <View style={styles.intro}>
        <Txt variant="title">{Copy.prices.title}</Txt>
        <Txt variant="soft">{Copy.prices.lead}</Txt>
        <Txt variant="soft">
          {ProfecoMeta.source}, {ProfecoMeta.period}.
        </Txt>
      </View>

      <Txt variant="label">{Copy.prices.state}</Txt>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
        {ProfecoStates.map((state) => (
          <Chip key={state} label={state} selected={state === data.city} onPress={() => chooseState(state)} />
        ))}
      </ScrollView>

      <Field label={Copy.prices.search} value={query} onChangeText={setQuery} placeholder={Copy.prices.searchPlaceholder} />
      <View style={styles.chipsWrap}>
        {PriceSuggestions.map((suggestion) => (
          <Chip key={suggestion} label={suggestion} selected={query === suggestion} onPress={() => setQuery(suggestion)} />
        ))}
      </View>

      <Button
        label={status === 'loading' ? Copy.prices.refreshing : Copy.prices.refresh}
        tone="quiet"
        disabled={status === 'loading'}
        onPress={() => {
          void refresh();
        }}
      />

      {status === 'failed' ? (
        <Panel tone="blush">
          <Txt variant="body">{Copy.prices.unavailable}</Txt>
        </Panel>
      ) : null}
      {status === 'live' ? (
        <Panel tone="sage">
          <Txt variant="body">{Copy.prices.refreshed}</Txt>
        </Panel>
      ) : null}
      {status !== 'live' && !sliceHasState(data.city) ? (
        <Panel>
          <Txt variant="body">{Copy.prices.missingState}</Txt>
        </Panel>
      ) : null}
      {groups.length === 0 && query.trim().length >= 2 && (sliceHasState(data.city) || status === 'live') ? (
        <Panel>
          <Txt variant="body">{Copy.prices.empty}</Txt>
        </Panel>
      ) : null}

      {groups.map((group) => {
        const brand = brandLabel(group.brand);
        return (
          <Panel key={group.key}>
            <Txt variant="heading">{group.product}</Txt>
            <Txt variant="soft">
              {[brand, group.presentation].filter(Boolean).join(' · ')}
            </Txt>
            {group.chains.map((row) => (
              <View key={row.chain} style={styles.chain}>
                <View style={styles.chainCopy}>
                  <Txt variant="body">{row.chain}</Txt>
                  <Txt variant="soft">
                    {row.offer.municipality} · {formatDay(row.offer.surveyedOn)}
                  </Txt>
                </View>
                <View style={styles.priceCol}>
                  <Txt variant="heading">{formatMoney(row.offer.price)}</Txt>
                  {row.isCheapest ? <Txt variant="label" style={styles.cheap}>{Copy.prices.cheapest}</Txt> : null}
                </View>
              </View>
            ))}
          </Panel>
        );
      })}
      {hidden ? <Txt variant="soft">{Copy.prices.more}</Txt> : null}

      <Txt variant="heading">{Copy.prices.mine}</Txt>
      <Txt variant="soft">{Copy.prices.mineLead}</Txt>
      <OwnPriceForm />
      {notes.length === 0 ? (
        <Txt variant="soft">{Copy.prices.noNotes}</Txt>
      ) : (
        notes.map((note) => (
          <Panel key={note.id}>
            <Txt variant="body">
              {note.productName} · {note.chain}
            </Txt>
            <Txt variant="soft">
              {formatMoney(note.price)} · {formatDay(note.notedOn)}
            </Txt>
            <Pressable onPress={() => data.removePriceNote(note.id)}>
              <Txt variant="soft">{Copy.prices.removeNote}</Txt>
            </Pressable>
          </Panel>
        ))
      )}
    </Screen>
  );
}

function OwnPriceForm() {
  const data = useAppData();
  const [product, setProduct] = useState('');
  const [chain, setChain] = useState('');
  const [price, setPrice] = useState('');
  const amount = parseAmount(price);
  const ready = product.trim().length > 1 && chain.trim().length > 1 && amount !== null;

  return (
    <View style={styles.form}>
      <Field label={Copy.prices.product} value={product} onChangeText={setProduct} />
      <Field label={Copy.prices.chain} value={chain} onChangeText={setChain} />
      <Field label={Copy.bills.amount} value={price} onChangeText={setPrice} keyboardType="decimal-pad" />
      <Button
        label={Copy.prices.saveNote}
        disabled={!ready}
        onPress={() => {
          if (!ready || amount === null) {
            return;
          }
          void data.savePriceNote(product.trim(), chain.trim(), amount);
          setProduct('');
          setChain('');
          setPrice('');
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  intro: {
    gap: Spacing.sm,
  },
  chips: {
    gap: Spacing.sm,
    paddingRight: Spacing.xl,
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  chain: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.md,
    paddingTop: Spacing.sm,
  },
  chainCopy: {
    flex: 1,
    gap: 2,
  },
  priceCol: {
    alignItems: 'flex-end',
  },
  cheap: {
    color: Palette.sage,
  },
  form: {
    gap: Spacing.md,
  },
});
