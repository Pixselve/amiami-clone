export const intlEUR = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' })
export const intlJPY = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'JPY' })

export function jpyToEur(jpy: number): number {
  return jpy * 0.0077
}
