const fs = require("fs")
const pdf = require("pdf-parse")
const keywords = require("./data/keywords")

const REGEX_INCOTERM = /(EXW|CIF|FCA|FOB|CFR|CIF|CIP|CPT|DAP|DAT|DDP|FAS)/gi;
const REGEX_INVOICENO = /\d+((-|\/)?\d+)*/g;
const REGEX_WEIGHTUNITS = /kg/g;

let options = {
  pagerender: function(pageData) {
    let render_options = {
      normalizeWhitespace: false,
      disableCombineTextItems: false
    }

    return pageData.getTextContent(render_options).then(function(textContent) {
      let lastY,
        text = ""
      for (let item of textContent.items) {
        const difY = lastY - item.transform[5]
        if (difY < 1 || difY > -1 || !lastY) {
          text += item.str
        } else {
          text += "\n" + item.str
        }
        lastY = item.transform[5]
      }
      return text
    })
  }
}

const FIELDS = [
  'totalValue',
  'invoiceNumber',
  'weight',
  'incoterm',
];

class Extractor {
  constructor(verbose = false) {
    this.verbose = verbose;
  }

  log(...args) {
    if (this.verbose) console.log(...args);
  }
  
  extractFields(text, fields = FIELDS) {
    // console.log(text);
  
    const result = {};
    
    const content = text.toLowerCase()
                        .replace(/—/g, '-')
                        .replace(/\s+/g, ' ');

    const numbers = getNumbers(content)
    const decimals = getDecimals(content)
    const incoterms = getMatches(content, REGEX_INCOTERM, 1);
    const invoiceNo = getMatches(content, REGEX_INVOICENO, 0);
    // const weightUnits = getMatches(content, )
  
    for (let field of fields) {
      const keyword = keywords[field];
  
      let value = ""
      switch (keyword.valueFormat) {
        case "number":
          keyword.aliases.some(alias => {
            const aliasIndex = getKeywordIndex(content, alias);
            const newValue = getNearestValue(numbers, aliasIndex);
  
            // console.log('index (', alias, ')', aliasIndex);
  
            if (aliasIndex !== -1 && newValue) {
              value = newValue.value;
              return true
            }
          })
          result[field] = value
          break
  
        case 'invoiceno':
          // create dictionary with alias and value and decide which one to choose
          const candidates = keyword.aliases.reduce((arr, alias) => {
            const aliasIndex = getKeywordIndex(content, alias);
  
            if (aliasIndex !== -1) {
              const value = getNearestValue(invoiceNo, aliasIndex);

              if (value) return [...arr, { alias, value: value.value }];
            }
            return arr;
          }, []);

          this.log(candidates);

          result[field] = candidates[0] && candidates[0].value;

          break;
  
        case "incoterm":
          // prevent crash if no incoterms found
          if (incoterms.length === 0) {
            result[field] = '';
            break;
          }
  
          keyword.aliases.some((alias) => {
            const aliasIndex = getKeywordIndex(content, alias);
            
            this.log('index (', alias, ')', aliasIndex);
  
            if (aliasIndex !== -1) {
              const newValue = getNearestValue(incoterms, aliasIndex);
  
              if (newValue) {
                value = newValue.value;
                return true;
              }
            }
          });

          result[field] = value.toUpperCase();
          break;
  
        case "weight":
          keyword.aliases.some(alias => {
            const newValue = getNearestValue(
              getArrayItems(content, ["kg", "kilogram", "pound", "lb"]),
              getKeywordIndex(content, alias)
            )
            if (newValue) {
              value = newValue.value
              return true
            }
          })
          result[field] = value
          break;
  
        case "decimal":
          keyword.aliases.some(alias => {
            const aliasIndex = getKeywordIndex(content, alias);
  
            this.log('index (', alias, ')', aliasIndex);
            
            if (aliasIndex !== -1) {
              const newValue = getNearestValue(decimals, aliasIndex);

              // console.log('------\n', newValue, alias, '\n------');
              // Todo: parse float (detect number format en vs de)
              if (newValue) {
                value = newValue.value;
                return true;
              }
            }
          });
          result[field] = value;
          break;
      }
    }
    // fs.writeFileSync("tmp/output.json", JSON.stringify(result))
    this.log(result)
    
    return result;
  }

  processPDF(path, fields = FIELDS) {
    const dataBuffer = fs.readFileSync(path)
  
    return pdf(dataBuffer, options).then(data => this.extractFields(data.text, fields));
  }
}

function pdf2text(path, outputPath = './tmp/output.txt') {
  const dataBuffer = fs.readFileSync(path)

  return pdf(dataBuffer, options).then(data => fs.writeFileSync(outputPath, data.text));
}

function getNumbers(text) {
  const regexp = /(([0-9]{2})+[0-9]*)/gi
  const matches = getMatches(text, regexp, 1)
  return matches.sort((a, b) =>
    a.index > b.index ? 1 : b.index > a.index ? -1 : 0
  )
}

function getDecimals(text) {
  const regexp = /(((\d{1,3})[\.\,]?)+)/gi
  const matches = getMatches(text, regexp, 1)
  return matches.sort((a, b) =>
    a.index > b.index ? 1 : b.index > a.index ? -1 : 0
  )
}

function getArrayItems(text, array) {
  const regexp = new RegExp("(" + array.join("|") + ")", "gi")
  const matches = getMatches(text, regexp, 1)
  return matches.sort((a, b) =>
    a.index > b.index ? 1 : b.index > a.index ? -1 : 0
  )
}

function getKeywordIndex(text, keyword) {
  return text.indexOf(keyword);
}

function getMatches(string, regex, index = 1) {
  // index || (index = 1) // default to the first capturing group
  var matches = [];
  var match;
  while ((match = regex.exec(string))) {
    matches.push({ value: match[index], index: match.index })
  }
  return matches
}

function getNearestValue(arr, index) {
  let i = 0;
  const arrLength = arr.length;
  while (arr[i].index < index) {
    if (arrLength === i + 1) return undefined;
    i++;
  }
  return arr[i];
}

module.exports = Extractor;

const FILE = './data/pdf/495833578885_sw_ocr.pdf';

// const FILE = './data/pdf/485013103425_sw_ocr.pdf';
// const FILE = './data/pdf/415163116459_sw_ocr.pdf';
// const FILE = './data/pdf/411496234926_sw_ocr.pdf';
// const FILE = './data/pdf/411496211270_sw_sw.pdf'
// const FILE = './data/pdf/415924285504_sw.pdf'
// const FILE = './data/pdf/737103956153_sw.pdf'
// const FILE = './data/pdf/771388637848_sw.pdf'
// const FILE = './data/pdf/789559645045_ocr.pdf'

// pdf2text(FILE);

const e = new Extractor(true);
// e.processPDF(FILE);
e.processPDF(FILE, ['invoiceNumber']);
