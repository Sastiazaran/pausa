/**
 * Papel, tinta y un solo acento.
 *
 * La interfaz es una libreta de dinero en casa: cálida, quieta, sin tablero
 * de finanzas ni metáfora de hábitos.
 */

export const Palette = {
  paper: '#F6F1EA',
  paperDeep: '#EFE4D6',
  ink: '#2A2420',
  inkSoft: '#6F655E',
  blush: '#C45C6A',
  blushSoft: '#F3D5D8',
  sage: '#6E8B74',
  sageSoft: '#E3EBE4',
  line: '#E4D9CC',
  card: '#FFFCF8',
  cardInk: '#2A2420',
  onInk: '#F6F1EA',
  onInkSoft: '#D9CFC4',
} as const;

export const BackgroundGradient = ['#F6F1EA', '#F3E7DC', '#EFE4D6'] as const;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const Radius = {
  sm: 10,
  md: 16,
  lg: 22,
  xl: 28,
} as const;

export const FontFamily = {
  display: 'Fraunces_700Bold',
  displayMedium: 'Fraunces_500Medium',
  body: 'Nunito_400Regular',
  bodySemi: 'Nunito_600SemiBold',
  bodyBold: 'Nunito_700Bold',
} as const;

export const FontSize = {
  micro: 12,
  small: 14,
  body: 16,
  lead: 18,
  heading: 22,
  title: 28,
  hero: 36,
} as const;
