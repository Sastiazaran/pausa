import { cheapestByChain, cheapestOffer, groupOffers, searchOffers, type PriceOffer } from '../prices';

function offer(partial: Partial<PriceOffer> & Pick<PriceOffer, 'chain' | 'price'>): PriceOffer {
  return {
    product: 'Leche',
    presentation: '1 L',
    brand: 'Alpura',
    surveyedOn: '2026-07-01',
    state: 'Ciudad de México',
    municipality: 'Coyoacán',
    ...partial,
  };
}

describe('precio más bajo', () => {
  it('debería elegir la cadena más barata e ignorar un precio vacío', () => {
    const cheapest = cheapestOffer([
      offer({ chain: 'Chedraui', price: 28 }),
      offer({ chain: 'Wal-mart', price: 0 }),
      offer({ chain: 'Fresko la Comer', price: 24 }),
    ]);

    expect(cheapest?.chain).toBe('Fresko la Comer');
  });

  it('debería devolver null cuando no hay precios válidos', () => {
    expect(cheapestOffer([offer({ chain: 'Chedraui', price: 0 })])).toBeNull();
  });

  it('debería marcar el empate como el más barato en las dos cadenas', () => {
    const chains = cheapestByChain([
      offer({ chain: 'Chedraui', price: 20 }),
      offer({ chain: 'Soriana', price: 20 }),
      offer({ chain: 'Wal-mart', price: 26 }),
    ]);

    expect(chains.filter((row) => row.isCheapest).map((row) => row.chain).sort()).toEqual(['Chedraui', 'Soriana']);
  });

  it('debería quedarse con el menor precio de la misma cadena', () => {
    const chains = cheapestByChain([
      offer({ chain: 'Chedraui', price: 30, municipality: 'Centro' }),
      offer({ chain: 'Chedraui', price: 22, municipality: 'Del Valle' }),
    ]);

    expect(chains).toHaveLength(1);
    expect(chains[0].offer.price).toBe(22);
  });
});

describe('búsqueda', () => {
  const rows = [
    offer({ product: 'Leche', chain: 'Chedraui', price: 24 }),
    offer({ product: 'Leche condensada', chain: 'Soriana', price: 30, brand: 'La Lechera' }),
    offer({ product: 'Arroz', chain: 'Wal-mart', price: 32, state: 'Jalisco' }),
  ];

  it('debería encontrar por texto sin acentos y solo en esa entidad', () => {
    const found = searchOffers(rows, 'Ciudad de México', 'leche');

    expect(found.map((row) => row.product)).toEqual(['Leche', 'Leche condensada']);
  });

  it('debería no buscar con una sola letra', () => {
    expect(searchOffers(rows, 'Ciudad de México', 'l')).toEqual([]);
  });

  it('debería agrupar marca y presentación', () => {
    const groups = groupOffers([
      offer({ chain: 'Chedraui', price: 24 }),
      offer({ chain: 'Wal-mart', price: 27 }),
      offer({ product: 'Arroz', brand: 'Verde Valle', presentation: '1 kg', chain: 'Soriana', price: 32 }),
    ]);

    expect(groups).toHaveLength(2);
    expect(groups[0].chains[0].isCheapest).toBe(true);
  });
});
