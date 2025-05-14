export const trackerTransactionTypesRoutes = {
  getAll: 'tracker-transaction-types/all/:fundId',
  create: 'tracker-transaction-types',
  update: 'tracker-transaction-types/:id',
  delete: 'tracker-transaction-types/:id',
  // Routes cho trang admin
  adminGetAll: 'admin/tracker-transaction-types',
  adminGetById: 'admin/tracker-transaction-types/:id',
  adminCreate: 'admin/tracker-transaction-types',
  adminUpdate: 'admin/tracker-transaction-types/:id',
  adminDelete: 'admin/tracker-transaction-types/:id'
}
