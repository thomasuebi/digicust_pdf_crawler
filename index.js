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
  const result = {}
  Object.keys(keywords).forEach(keyword => {
    console.log(keyword)
    switch (keyword.valueFormat) {
      case "number":
        let value = ""
        keyword.aliases.forEach(alias => {
          getNearestNumber(numbers, keyword)
        })
        result[keyword] = value
    }
  })
  console.log(result)
  //   const endValueIndex = getKeywordIndex(lowerCaseContent, "end value")
  //   const endValue = getNearestNumber(numbers, endValueIndex).value
  //   console.log("End value: " + endValue)

  //   for (const match of matches) {
  //     console.log("value: " + match.value)
  //     console.log("index: " + match.index)
  //   }
})

function getNumbers(text) {
  const regexp = /(((\d{1,3})[\.\,]?)+)/gi
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

function getNearestNumber(arr, index) {
  var i = arr.length
  while (arr[--i].index > index);
  return arr[++i]
}
