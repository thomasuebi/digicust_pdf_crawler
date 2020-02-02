const fs = require("fs")
const pdf = require("pdf-parse")
const keywords = require("./data/keywords")

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

let dataBuffer = fs.readFileSync("sample.pdf")

pdf(dataBuffer, options).then(function(data) {
  const lowerCaseContent = data.text.toLowerCase()
  console.log(data.text)
  const numbers = getNumbers(lowerCaseContent)
  const decimals = getDecimals(lowerCaseContent)
  const result = {}
  for (let [key, keyword] of Object.entries(keywords)) {
    let value = ""
    switch (keyword.valueFormat) {
      case "number":
        keyword.aliases.some(alias => {
          const newValue = getNearestValue(
            numbers,
            getKeywordIndex(lowerCaseContent, alias)
          )
          if (newValue) {
            value = newValue.value
            return true
          }
        })
        result[key] = value
        break
      case "incoterm":
        const regexp = /(EXW|CIF|FCA|FOB|CFR|CIF|CIP|CPT|DAP|DAT|DDP|FAS)/g
        const matches = getMatches(data.text, regexp, 1)
        result[key] = matches[0].value
        break
      //   case "weight":
      //     keyword.aliases.some(alias => {
      //       const newValue = getNearestValue(
      //         getArrayItems(lowerCaseContent, ["kg", "kilogram", "pound", "lb"]),
      //         getKeywordIndex(lowerCaseContent, alias)
      //       )
      //       if (newValue) {
      //         value = newValue.value
      //         return true
      //       }
      //     })
      //     result[key] = value
      case "decimal":
        keyword.aliases.some(alias => {
          const newValue = getNearestValue(
            decimals,
            getKeywordIndex(lowerCaseContent, alias)
          )
          if (newValue) {
            value = newValue.value
            return true
          }
        })
        result[key] = value
        break
    }
  }
  fs.writeFileSync("tmp/output.json", JSON.stringify(result))
  console.log(result)
})

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
  return text.indexOf(keyword)
}

function getMatches(string, regex, index) {
  index || (index = 1) // default to the first capturing group
  var matches = []
  var match
  while ((match = regex.exec(string))) {
    matches.push({ value: match[index], index: match.index })
  }
  return matches
}

function getNearestValue(arr, index) {
  var i = arr.length
  while (arr[--i].index > index && i > 0);
  return arr[++i]
}
