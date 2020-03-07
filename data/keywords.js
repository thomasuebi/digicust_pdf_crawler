module.exports = {
  totalValue: {
    aliases: ["total invoice amount", "finalamount", "totalusd", "end value", "total value", "totalvalue", "total invoice value", "total (eur)", "total usd", "sum total", "total"],
    valueFormat: "decimal",
  },
  invoiceNumber: {
    aliases: ['proforma invoice', 'invoice no', 'invoiceno', 'invoice', 'number/date'],
    valueFormat: 'invoiceno',
  },
  weight: {
    aliases: ['actual wgt', 'actwgt', 'weight'],
    valueFormat: "decimal"
  },
  incoterm: {
    aliases: ['secondary condition', 'delivery terms', 'termsofdelivery', 'terms of sale(incoterm)', 'incoterms', 'terms of delivery', 'terms of sale', 'pricing'],
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
