module.exports = {
  totalValue: {
    aliases: ["finalamount", "totalusd", "end value", "total value", "totalvalue"],
    valueFormat: "decimal",
  },
  invoiceNumber: {
    aliases: ['invoice no', 'invoiceno'],
    valueFormat: 'invoiceno',
  },
  weight: {
    aliases: ['actual wgt', 'actwgt', 'weight'],
    valueFormat: "decimal"
  },
  incoterm: {
    aliases: ['termsofdelivery', 'terms of sale(incoterm)', 'incoterms', 'terms of delivery'],
    valueFormat: "incoterm"
  },
  // weightUnit: {
  //   aliases: ["weight unit", "weightunit", "unit"],
  //   valueFormat: "weight"
  // },
  // airwayBill: {
  //   aliases: [
  //     "airwaybill",
  //     "airway bill",
  //     "airway bill no",
  //     "airway bill number"
  //   ],
  //   valueFormat: "number"
  // }
}
