// Static supermarket layout definition
// Future: could integrate with Bluetooth beacon data or store floor plan API
// for real-time indoor positioning

export const ZONE_ORDER = [
  'Entrance',
  'Produce',
  'Bakery',
  'Dairy',
  'Frozen',
  'Snacks',
  'Beverages',
  'Household',
  'Checkout',
]

export const ZONE_CONFIG = {
  Entrance: {
    label: 'Entrance',
    color: '#a8d5a2',
    lightColor: '#edf7ec',
    icon: '🚪',
    description: 'Store entrance',
  },
  Produce: {
    label: 'Produce',
    color: '#7bc87a',
    lightColor: '#edf7ec',
    icon: '🥦',
    description: 'Fresh fruit and vegetables',
  },
  Bakery: {
    label: 'Bakery',
    color: '#e8b97a',
    lightColor: '#fdf4e7',
    icon: '🍞',
    description: 'Bread, pastries and baked goods',
  },
  Dairy: {
    label: 'Dairy',
    color: '#7ab8e8',
    lightColor: '#e7f2fd',
    icon: '🥛',
    description: 'Milk, cheese, eggs and chilled goods',
  },
  Frozen: {
    label: 'Frozen',
    color: '#9ec5e8',
    lightColor: '#eaf3fb',
    icon: '❄️',
    description: 'Frozen foods',
  },
  Snacks: {
    label: 'Snacks',
    color: '#e8a07a',
    lightColor: '#fdeee7',
    icon: '🍿',
    description: 'Crisps, chocolate and snacks',
  },
  Beverages: {
    label: 'Beverages',
    color: '#c47ae8',
    lightColor: '#f4e7fd',
    icon: '🧃',
    description: 'Drinks, juice and water',
  },
  Household: {
    label: 'Household',
    color: '#e8e07a',
    lightColor: '#fdfce7',
    icon: '🧴',
    description: 'Cleaning, toiletries and household items',
  },
  Checkout: {
    label: 'Checkout',
    color: '#b0b0b0',
    lightColor: '#f5f5f5',
    icon: '🛒',
    description: 'Checkout',
  },
}
