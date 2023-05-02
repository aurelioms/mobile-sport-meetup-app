export const parseToDate = (value: unknown) => {
  if (typeof value === 'string' || value instanceof Date) return new Date(value)

  return undefined
}
