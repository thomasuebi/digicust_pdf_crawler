const fs = require("fs")
const pdf = require("pdf-parse")
const keywords = require("./data/keywords")

const REGEX_INCOTERM = /(EXW|CIF|FCA|FOB|CFR|CIF|CIP|CPT|DAP|DAT|DDP|FAS)/g;
const REGEX_INVOICENO = /\d+(-?\d+)*/g;
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

// const FILE = './data/pdf/411496211270_sw_sw.pdf'
// const FILE = './data/pdf/415924285504_sw.pdf'
// const FILE = './data/pdf/737103956153_sw.pdf'
// const FILE = './data/pdf/771388637848_sw.pdf'
// const FILE = './data/pdf/789559645045_ocr.pdf'

const FIELDS = [
  'totalValue',
  'invoiceNumber',
  'weight',
  'incoterm',
];

function processPDF(path, fields = FIELDS) {
  let dataBuffer = fs.readFileSync(path)

  return pdf(dataBuffer, options).then(data => extractFields(data.text, fields));
}

function extractFields(text, fields) {
  fs.writeFileSync("tmp/output.txt", text);

  const result = {};
  
  const lowerCaseContent = text.toLowerCase();
  const content = lowerCaseContent.replace(/—/g, '-');
  
  const numbers = getNumbers(content)
  const decimals = getDecimals(content)
  const incoterms = getMatches(text, REGEX_INCOTERM, 1);
  const invoiceNo = getMatches(content, REGEX_INVOICENO, 0);
  // const weightUnits = getMatches(content, )

  for (let field of fields) {
  //for (let [key, keyword] of Object.entries(keywords)) {
    const keyword = keywords[field];

    let value = ""
    switch (keyword.valueFormat) {
      case "number":
        keyword.aliases.some(alias => {
          const aliasIndex = getKeywordIndex(lowerCaseContent, alias);
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
        result[field] = keyword.aliases.reduce((result, alias) => {
          const aliasIndex = getKeywordIndex(lowerCaseContent, alias);

          // console.log('index (', alias, ')', aliasIndex);

          if (aliasIndex !== -1) {
            const newValue = getNearestValue(invoiceNo, aliasIndex);

            if (newValue) return newValue.value;
          }
          
          return result;
        }, "");
        break;

      case "incoterm":
        // prevent crash if no incoterms found
        if (incoterms.length === 0) {
          result[field] = '';
          break;
        }

        result[field] = keyword.aliases.reduce((result, alias) => {
          const aliasIndex = getKeywordIndex(lowerCaseContent, alias);
          // console.log('index (', alias, ')', aliasIndex);

          if (aliasIndex !== -1) {
            const newValue = getNearestValue(incoterms, aliasIndex);

            if (newValue) return newValue.value;
          }
          
          return result;
        }, "");
        break;

      case "weight":
        keyword.aliases.some(alias => {
          const newValue = getNearestValue(
            getArrayItems(lowerCaseContent, ["kg", "kilogram", "pound", "lb"]),
            getKeywordIndex(lowerCaseContent, alias)
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
          const aliasIndex = getKeywordIndex(lowerCaseContent, alias);
          const newValue = getNearestValue(decimals, aliasIndex);

          // console.log('index (', alias, ')', aliasIndex);
          
          if (aliasIndex !== -1 && newValue) {
            // console.log('------\n', newValue, alias, '\n------');
            // Todo: parse float (detect number format en vs de)
            value = newValue.value;
            return true
          }
        })
        result[field] = value
        break
    }
  }
  // fs.writeFileSync("tmp/output.json", JSON.stringify(result))
  // console.log(result)
  
  return result;
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

module.exports = {
  processPDF, 
  extractFields,
};
