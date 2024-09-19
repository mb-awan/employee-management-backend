export const transformInvoice = (invoice: any) => {
  const invoiceObject = invoice.toObject(); // Convert Mongoose document to plain object
  const { _id, ...rest } = invoiceObject; // Destructure to remove _id
  return {
    ...rest,
    id: _id, // Rename _id to id
  };
};

export const transformInvoicesArray = (invoices: any[]) => {
  return invoices.map(transformInvoice);
};
