const Extractor = require('../index.js');
const case1 = require('./data/411496211270.js');
const case2 = require('./data/415924285504.js');
const case3 = require('./data/737103956153.js');
const case4 = require('./data/771388637848.js');
const case5 = require('./data/789559645045.js');
const case6 = require('./data/411496234926.js');

describe('extractFields', () => {
    const extractor = new Extractor();

    describe('Invoice Number', () => {
        test('411496211270', () => {
            const result = extractor.extractFields(case1, ['invoiceNumber']);
            expect(result.invoiceNumber).toBe('219244');
        });
        test('415924285504', () => {
            const result = extractor.extractFields(case2, ['invoiceNumber']);
            expect(result.invoiceNumber).toBe('90952120');
        });
        test('771388637848', () => {
            const result = extractor.extractFields(case4, ['invoiceNumber']);
            expect(result.invoiceNumber).toBe('18-7678');
        });
        test('789559645045', () => {
            const result = extractor.extractFields(case5, ['invoiceNumber']);
            expect(result.invoiceNumber).toBe('91470164');
        });
        test('411496234926', () => {
            const result = extractor.extractFields(case6, ['invoiceNumber']);
            expect(result.invoiceNumber).toBe('240504');
        });
    });

    describe('Total Value', () => {
        test('411496211270', () => {
            const result = extractor.extractFields(case1, ['totalValue']);
            expect(result.totalValue).toBe('1549.88');
        });
        test('737103956153', () => {
            const result = extractor.extractFields(case3, ['totalValue']);
            expect(result.totalValue).toBe('3,628.80');
        });
        test('771388637848', () => {
            const result = extractor.extractFields(case4, ['totalValue']);
            expect(result.totalValue).toBe('1.872,00');
        });
        test('789559645045', () => {
            const result = extractor.extractFields(case5, ['totalValue']);
            expect(result.totalValue).toBe('7,639.00');
        });
        test('411496234926', () => {
            const result = extractor.extractFields(case6, ['totalValue']);
            expect(result.totalValue).toBe('1868.35');
        });
    });

    describe('Incoterm', () => {
        test('415924285504', () => {
            const result = extractor.extractFields(case2, ['incoterm']);
            expect(result.incoterm).toBe('EXW');
        });
        test('737103956153', () => {
            const result = extractor.extractFields(case3, ['incoterm']);
            expect(result.incoterm).toBe('FCA');
        });
        test('789559645045', () => {
            const result = extractor.extractFields(case5, ['incoterm']);
            expect(result.incoterm).toBe('CPT');
        });
        test('411496234926', () => {
            const result = extractor.extractFields(case6, ['incoterm']);
            expect(result.incoterm).toBe('EXW');
        });
    });

    describe('Weight', () => {
        test('411496211270', () => {
            const result = extractor.extractFields(case1, ['weight']);
            expect(result.weight).toBe('27.70');
        });
        test('789559645045', () => {
            const result = extractor.extractFields(case5, ['weight']);
            expect(result.weight).toBe('6.70');
        });
        test('411496234926', () => {
            const result = extractor.extractFields(case6, ['weight']);
            expect(result.weight).toBe('4.70');
        });
    });
});

