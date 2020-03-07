const Extractor = require('../index.js');
const case1 = require('./data/411496211270.js');
const case2 = require('./data/415924285504.js');
const case3 = require('./data/737103956153.js');
const case4 = require('./data/771388637848.js');
const case5 = require('./data/789559645045.js');
const case6 = require('./data/411496234926.js');
const case7 = require('./data/415163116459.js');
const case8 = require('./data/485013103425.js');
const case9 = require('./data/495833578885.js');
const case10 = require('./data/495833578966.js');
const case11 = require('./data/643693071164.js');
const case12 = require('./data/674077925534.js');
const case13 = require('./data/775348620627.js');
const case14 = require('./data/775366524401.js');
const case15 = require('./data/775366615568.js');

describe('extractFields', () => {
    const extractor = new Extractor();

    const result1 = extractor.extractFields(case1);
    const result2 = extractor.extractFields(case2);
    const result3 = extractor.extractFields(case3);
    const result4 = extractor.extractFields(case4);
    const result5 = extractor.extractFields(case5);
    const result6 = extractor.extractFields(case6);
    const result7 = extractor.extractFields(case7);
    const result8 = extractor.extractFields(case8);
    const result9 = extractor.extractFields(case9);
    const result10 = extractor.extractFields(case10);
    const result11 = extractor.extractFields(case11);
    const result12 = extractor.extractFields(case12);
    const result13 = extractor.extractFields(case13);
    const result14 = extractor.extractFields(case14);
    const result15 = extractor.extractFields(case15);

    describe('Invoice Number', () => {
        test('411496211270', () => {
            expect(result1.invoiceNumber).toBe('219244');
        });
        test('415924285504', () => {
            expect(result2.invoiceNumber).toBe('90952120');
        });
        test('771388637848', () => {
            expect(result4.invoiceNumber).toBe('18-7678');
        });
        test('789559645045', () => {
            expect(result5.invoiceNumber).toBe('91470164');
        });
        test('411496234926', () => {
            expect(result6.invoiceNumber).toBe('240504');
        });
        test('485013103425', () => {
            expect(result8.invoiceNumber).toBe('2019102581');
        });
        test('495833578966', () => {
            expect(result10.invoiceNumber).toBe('159245/1');
        });
        test('643693071164', () => {
            expect(result11.invoiceNumber).toBe('91634888');
        });
        test('674077925534', () => {
            expect(result12.invoiceNumber).toBe('20190060');
        });
        test('775348620627', () => {
            expect(result13.invoiceNumber).toBe('19110712');
        });
    });

    describe('Total Value', () => {
        test('411496211270', () => {
            expect(result1.totalValue).toBe('1549.88');
        });
        test('737103956153', () => {
            expect(result3.totalValue).toBe('3,628.80');
        });
        test('771388637848', () => {
            expect(result4.totalValue).toBe('1.872,00');
        });
        test('789559645045', () => {
            expect(result5.totalValue).toBe('7,639.00');
        });
        test('411496234926', () => {
            expect(result6.totalValue).toBe('1868.35');
        });
        test('415163116459', () => {
            expect(result7.totalValue).toBe('1690.00');
        });
        test('485013103425', () => {
            expect(result8.totalValue).toBe('1.590,00');
        });
        test('495833578885', () => {
            expect(result9.totalValue).toBe('48,000.00');
        });
        test('495833578966', () => {
            expect(result10.totalValue).toBe('5,347.50');
        });
        test('643693071164', () => {
            expect(result11.totalValue).toBe('8,600.00');
        });
        test('674077925534', () => {
            expect(result12.totalValue).toBe('4,310');
        });
        test('775366524401', () => {
            expect(result14.totalValue).toBe('2,754.00');
        });
        test('775366615568', () => {
            expect(result15.totalValue).toBe('3.774,36');
        });
    });

    describe('Incoterm', () => {
        test('415924285504', () => {
            expect(result2.incoterm).toBe('EXW');
        });
        test('737103956153', () => {
            expect(result3.incoterm).toBe('FCA');
        });
        test('789559645045', () => {
            expect(result5.incoterm).toBe('CPT');
        });
        test('411496234926', () => {
            expect(result6.incoterm).toBe('EXW');
        });
        test('415163116459', () => {
            expect(result7.incoterm).toBe('DAP');
        });
        test('485013103425', () => {
            expect(result8.incoterm).toBe('DAP');
        });
        test('495833578885', () => {
            expect(result9.incoterm).toBe('FCA');
        });
        test('495833578966', () => {
            expect(result10.incoterm).toBe('FCA');
        });
        test('643693071164', () => {
            expect(result11.incoterm).toBe('FCA');
        });
        test('674077925534', () => {
            expect(result12.incoterm).toBe('EXW');
        });
        test('775348620627', () => {
            expect(result13.incoterm).toBe('EXW');
        });
        test('775366524401', () => {
            expect(result14.incoterm).toBe('EXW');
        });
        test('775366615568', () => {
            expect(result15.incoterm).toBe('FCA');
        });
    });

    describe('Weight', () => {
        test('411496211270', () => {
            expect(result1.weight).toBe('27.70');
        });
        test('789559645045', () => {
            expect(result5.weight).toBe('6.70');
        });
        test('411496234926', () => {
            expect(result6.weight).toBe('4.70');
        });
        test('415163116459', () => {
            expect(result7.weight).toBe('0.8');
        });
        test('485013103425', () => {
            expect(result8.weight).toBe('36,00');
        });
        test('643693071164', () => {
            expect(result11.weight).toBe('12.300');
        });
        test('775366524401', () => {
            expect(result14.weight).toBe('9.50');
        });
    });
});

