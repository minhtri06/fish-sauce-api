const APP_FULL_PATH = process.cwd()
const PUBLIC_FULL_PATH = APP_FULL_PATH + '/public'
const IMAGES_FULL_PATH = PUBLIC_FULL_PATH + '/images'

module.exports = Object.freeze({
  PAYMENT_METHODS: {
    COD: 'cod',
    MOMO: 'momo',
    BANK_TRANSFER: 'bank-transfer',
  },

  INVOICE_STATUSES: {
    WAITING_FOR_CONFIRMATION: 'waiting-for-confirmation',
    CONFIRMED: 'confirmed',
    CANCELED: 'canceled',
  },

  MODEL_NAMES: {
    CATEGORY: 'Category',
    COMMUNE: 'Commune',
    DISTRICT: 'District',
    INVOICE: 'Invoice',
    PRODUCT: 'Product',
    PROVINCE: 'Province',
    TAG: 'Tag',
    TOKEN: 'Token',
    USER: 'User',
  },

  PRODUCT_STATUSES: {
    ACTIVE: 'active',
    INACTIVE: 'inactive',
  },

  TOKEN_TYPES: {
    REFRESH_TOKEN: 'refresh-token',
    ACCESS_TOKEN: 'access-token',
  },

  APP_FULL_PATH,
  PUBLIC_FULL_PATH,
  IMAGES_FULL_PATH,
})
