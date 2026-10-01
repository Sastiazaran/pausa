/**
 * Comparación de precios de PROFECO.
 *
 * Una fila es un precio levantado en tienda. La app no inventa cifras:
 * si no hay filas, no hay resultado.
 */

export type PriceOffer = {
  product: string;
  presentation: string;
  brand: string;
  price: number;
  surveyedOn: string;
  chain: string;
  state: string;
  municipality: string;
};

export type ChainPrice = {
  chain: string;
  offer: PriceOffer;
  isCheapest: boolean;
};

export type PriceGroup = {
  key: string;
  product: string;
  brand: string;
  presentation: string;
  chains: ChainPrice[];
};

/** Minúsculas y sin acentos, para que “leche” encuentre “Leche”. */
export function foldText(value: string): string {
  return value
    .toLowerCase()
    .replaceAll('á', 'a')
    .replaceAll('é', 'e')
    .replaceAll('í', 'i')
    .replaceAll('ó', 'o')
    .replaceAll('ú', 'u')
    .replaceAll('ü', 'u')
    .replaceAll('ñ', 'n')
    .trim();
}

function isUsable(offer: PriceOffer): boolean {
  return Number.isFinite(offer.price) && offer.price > 0 && offer.chain.trim().length > 0;
}

/** La oferta más barata. Null si ninguna tiene un precio válido. */
export function cheapestOffer(offers: PriceOffer[]): PriceOffer | null {
  const usable = offers.filter(isUsable);
  if (usable.length === 0) {
    return null;
  }
  return usable.reduce((best, offer) => (offer.price < best.price ? offer : best));
}

/**
 * Un precio por cadena: el más bajo que PROFECO anotó.
 * Si dos cadenas empatan, las dos quedan como las más baratas.
 */
export function cheapestByChain(offers: PriceOffer[]): ChainPrice[] {
  const byChain = new Map<string, PriceOffer>();

  for (const offer of offers) {
    if (!isUsable(offer)) {
      continue;
    }
    const current = byChain.get(offer.chain);
    if (!current || offer.price < current.price) {
      byChain.set(offer.chain, offer);
    }
  }

  const sorted = [...byChain.values()].sort((left, right) => left.price - right.price || left.chain.localeCompare(right.chain, 'es'));
  const lowest = sorted[0]?.price;

  return sorted.map((offer) => ({
    chain: offer.chain,
    offer,
    isCheapest: offer.price === lowest,
  }));
}

/** Filtra el recorte por entidad y por texto. Una búsqueda de menos de 2 letras no devuelve nada. */
export function searchOffers(rows: PriceOffer[], state: string, query: string): PriceOffer[] {
  const folded = foldText(query);
  if (folded.length < 2) {
    return [];
  }

  return rows
    .filter((row) => row.state === state && foldText(`${row.product} ${row.brand} ${row.presentation}`).includes(folded))
    .sort((left, right) => {
      const leftRank = foldText(left.product).startsWith(folded) ? 0 : 1;
      const rightRank = foldText(right.product).startsWith(folded) ? 0 : 1;
      return leftRank - rightRank || left.product.localeCompare(right.product, 'es');
    });
}

/** Agrupa el mismo producto (marca y presentación) y ordena sus cadenas por precio. */
export function groupOffers(offers: PriceOffer[]): PriceGroup[] {
  const groups = new Map<string, PriceOffer[]>();

  for (const offer of offers) {
    const key = foldText(`${offer.product}|${offer.brand}|${offer.presentation}`);
    const bucket = groups.get(key);
    if (bucket) {
      bucket.push(offer);
    } else {
      groups.set(key, [offer]);
    }
  }

  return [...groups.entries()].map(([key, bucket]) => ({
    key,
    product: bucket[0].product,
    brand: bucket[0].brand,
    presentation: bucket[0].presentation,
    chains: cheapestByChain(bucket),
  }));
}
