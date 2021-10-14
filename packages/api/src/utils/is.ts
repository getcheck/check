export const isString = (value: unknown): value is string | string => {
  return typeof value === 'string' || value instanceof String
}
