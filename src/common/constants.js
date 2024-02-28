module.exports = Object.freeze({
  PAYMENT_METHODS: {
    COD: 'cod',
    MOMO: 'momo',
  },

  INVOICE_STATUSES: {
    WAITING_FOR_PAYMENT: 'waiting-for-payment',
    WAITING_FOR_DELIVERY: 'waiting-for-delivery',
    DELIVERED: 'delivered',
    CANCEL: 'cancel',
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
})
