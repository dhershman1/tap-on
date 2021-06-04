/* Modules */
const { dim, underline, green, cyan, red } = require('colorette')
const through = require('through2')
const duplexer = require('duplexer3')
const Parser = require('tap-parser')
const symbols = require('figures')

function isFinalStats (str) {
  // Longhand:
  // /^(tests|pass|fail|skip|failed):?\s\d\s?(of)?\s\d?\s(tests)?/
  return /^#\s(tests|pass|fail|skip|failed):?\s{1,}\d/.test(str)
}

function pad (str) {
  return `  ${str}`
}

function prettyStack (rawError) {
  return rawError.split('\n').map(pad).join('\n') + '\n'
}

function onTap (args) {
  const startTime = new Date().getTime()
  const tap = new Parser()
  const output = through()
  const stream = duplexer(tap, output)
  let lastStr = ''

  output.push('\n')

  /* Parser Event listening */

  tap.on('pass', assert => {
    output.push(pad(`  ${green(symbols.tick)} ${dim(assert.name)}\n`))
  })

  tap.on('fail', assert => {
    const title = `${symbols.cross} ${assert.name}`
    const divider = Array.from(title, () => '-').join('')

    output.push(pad(`  ${red(title)}\n`))
    output.push(pad(`  ${red(divider)}\n`))
    output.push(pad(cyan(`  Operator: ${assert.diag.operator}\n`)))
    output.push(pad(cyan(`  Expected: ${assert.diag.expected}\n`)))
    output.push(pad(cyan(`  Actual: ${assert.diag.actual}\n`)))
    output.push(pad(cyan(`  At: ${assert.diag.at}\n`)))
    if (!args.stack) {
      output.push(pad(cyan(`  Stack: ${prettyStack(assert.diag.stack)}\n`)))
    }
  })

  tap.on('skip', assert => {
    output.push(pad(`  ${cyan('-  ' + assert.name)}\n`))
  })

  tap.on('comment', res => {
    if (/SKIP/.test(res) || isFinalStats(res)) {
      return
    }

    const cleanedStr = res.replace('# ', '')

    if (lastStr !== cleanedStr) {
      output.push(`\n${pad(underline(cleanedStr))}\n`)
      lastStr = cleanedStr
    }
  })

  tap.on('complete', results => {
    output.push('\n' + pad(`Total: ${results.count}\n`))
    output.push(pad(green(`Passed: ${results.pass}\n`)))
    output.push(pad(red(`Failed: ${results.fail}\n`)))
    output.push(pad(`Duration: ${new Date().getTime() - startTime}ms\n\n`))
  })

  return stream
}

module.exports = onTap
