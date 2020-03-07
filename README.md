# Digicust PDF Extractor

## Usage
```{js}
const Extractor = require('./index.js');

const extractor = new Extractor();

// all fields
extractor.processPDF('path').then(result => {
    // result.totalValue
    // result.invoiceNumber
    // result.weight
    // result.incoterm
});

// specific fields
extractor.processPDF('path', ['totalValue', 'weight']).then(result => {
    // ...
});
```

