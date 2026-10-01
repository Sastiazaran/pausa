import { groupOffers, searchOffers, type PriceGroup, type PriceOffer } from '@/domain/prices';

import slice from './profeco-slice.json';

/**
 * Recorte real de Quién es Quién en los Precios, julio 2026.
 *
 * El teléfono consulta el archivo abierto cuando hay red. Si esa consulta
 * falla, se busca en este recorte y se dice que no se pudo actualizar.
 * No se rellenan precios a mano.
 */

type SliceFile = {
  source: string;
  license: string;
  dataset: string;
  period: string;
  fetchedOn: string;
  rows: PriceOffer[];
};

const file = slice as SliceFile;

export const ProfecoMeta = {
  source: file.source,
  license: file.license,
  dataset: file.dataset,
  period: file.period,
  fetchedOn: file.fetchedOn,
};

const PackageUrl = 'https://www.datos.gob.mx/api/3/action/package_show?id=programa_quien_es_quien_precios_2026';
const SearchUrl = 'https://www.datos.gob.mx/api/3/action/datastore_search';
const SupermarketGiro = 'Supermercado / Tienda de Autoservicio';

type PackageResource = {
  id: string;
  format?: string;
  datastore_active?: boolean;
  metadata_modified?: string;
};

export function localPriceGroups(state: string, query: string): PriceGroup[] {
  return groupOffers(searchOffers(file.rows, state, query));
}

export function sliceHasState(state: string): boolean {
  return file.rows.some((row) => row.state === state);
}

/**
 * Consulta el archivo más reciente publicado en datos.gob.mx.
 * Lanza si el archivo no responde, para que la pantalla lo diga.
 */
export async function fetchProfecoGroups(state: string, query: string): Promise<PriceGroup[]> {
  const packageResponse = await fetch(PackageUrl);
  if (!packageResponse.ok) {
    throw new Error('profeco-package');
  }

  const packageBody = (await packageResponse.json()) as {
    success?: boolean;
    result?: { resources?: PackageResource[] };
  };
  const resources = (packageBody.result?.resources ?? []).filter(
    (resource) => resource.datastore_active && resource.format === 'CSV',
  );
  const latest = [...resources].sort((left, right) =>
    (right.metadata_modified ?? '').localeCompare(left.metadata_modified ?? ''),
  )[0];
  if (!packageBody.success || !latest) {
    throw new Error('profeco-empty');
  }

  const params = new URLSearchParams({
    resource_id: latest.id,
    q: query,
    filters: JSON.stringify({ estado: state, giro: SupermarketGiro }),
    limit: '80',
  });
  const response = await fetch(`${SearchUrl}?${params.toString()}`);
  if (!response.ok) {
    throw new Error('profeco-search');
  }

  const body = (await response.json()) as {
    success?: boolean;
    result?: { records?: Record<string, string>[] };
  };
  if (!body.success) {
    throw new Error('profeco-search');
  }

  const offers: PriceOffer[] = [];
  for (const record of body.result?.records ?? []) {
    const price = Number(record.precio);
    if (!Number.isFinite(price) || price <= 0 || !(record.cadena_comercial ?? '').trim()) {
      continue;
    }
    offers.push({
      product: record.producto ?? '',
      presentation: record.presentacion ?? '',
      brand: record.marca ?? '',
      price,
      surveyedOn: (record.fecha_registro ?? '').slice(0, 10),
      chain: record.cadena_comercial ?? '',
      state: record.estado ?? state,
      municipality: record.municipio ?? '',
    });
  }

  return groupOffers(searchOffers(offers, state, query));
}
