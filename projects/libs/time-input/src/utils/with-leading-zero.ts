export const withLeadingZero = (value?: string | number | null): string => {
  return `${value || ''}`.padStart(2, '0');
};
