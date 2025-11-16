// Central definition of filter groups for the sheet UI.
// Keeps CatalogPage lean and makes options easy to tweak.

export const filterGroups = [
  {
    key: 'brand',
    label: 'Brand',
    options: [
      { id: 'apple', label: 'Apple' },
      { id: 'samsung', label: 'Samsung' },
      { id: 'xiaomi', label: 'Xiaomi' },
      { id: 'other', label: 'Other' },
    ],
  },
  {
    key: 'price',
    label: 'Price',
    options: [
      { id: '0-100', label: '€0 – €100' },
      { id: '100-300', label: '€100 – €300' },
      { id: '300+', label: '€300+' },
    ],
  },
  {
    key: 'rating',
    label: 'Rating',
    options: [
      { id: '4+', label: '4.0★ +' },
      { id: '4.5+', label: '4.5★ +' },
    ],
  },
];
