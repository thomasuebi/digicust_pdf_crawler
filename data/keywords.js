module.exports = {
  totalValue: {
    aliases: ["total invoice amount", "finalamount", "totalusd", "end value", "total value", "totalvalue", "total invoice value", "total (eur)", "total usd"],
    valueFormat: "decimal",
  },
  invoiceNumber: {
    aliases: ['invoice no', 'invoiceno', 'invoice'],
    valueFormat: 'invoiceno',
  },
  weight: {
    aliases: ['actual wgt', 'actwgt', 'weight'],
    valueFormat: "decimal"
  },
  incoterm: {
    aliases: ['delivery terms', 'termsofdelivery', 'terms of sale(incoterm)', 'incoterms', 'terms of delivery', 'terms of sale'],
    valueFormat: "incoterm"
  },
  weightUnit: {
    aliases: ["weight unit", "weightunit", "unit"],
    valueFormat: "weight"
  },
  airwayBill: {
    aliases: [
      "airwaybill",
      "airway bill",
      "airway bill no",
      "airway bill number"
    ],
    valueFormat: "number"
  }
}
