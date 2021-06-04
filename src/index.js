const { bold, dim, underline, green, cyan, red } = require('colorette')
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

function formatFail (f, hideStack) {
  const title = `${symbols.cross} ${f.name}`
  const divider = Array.from(title, () => '-').join('')
  const err = [
    pad(`  ${red(title)}`),
    pad(`  ${red(divider)}`),
    pad(cyan(`  Operator: ${f.diag.operator}`)),
    pad(cyan(`  Expected: ${f.diag.expected}`)),
    pad(cyan(`  Actual: ${f.diag.actual}`)),
    pad(cyan(`  At: ${f.diag.at}`))
  ]

  if (hideStack) {
    return err.join('\n')
  }

  return err.concat(pad(cyan(`  Stack: ${prettyStack(f.diag.stack)}`))).join('\n')
}

function onTap (args) {
  const startTime = new Date().getTime()
  const tap = new Parser()
  const output = through()
  const stream = duplexer(tap, output)
  let skippedTests = 0
  let lastStr = ''

  output.push('\n')

  tap.on('pass', assert => {
    output.push(pad(`  ${green(symbols.tick)} ${dim(assert.name)}\n`))
  })

  tap.on('fail', assert => {
    output.push(formatFail(assert, args.stack))
  })

  tap.on('skip', assert => {
    output.push(pad(`  ${cyan('-  ' + assert.name)}\n`))
  })

  tap.on('comment', res => {
    const isSkip = /# SKIP/.test(res)

    if (isSkip || isFinalStats(res)) {
      if (isSkip) {
        skippedTests++
      }

      return
    }

    const cleanedStr = res.replace('# ', '')

    if (lastStr !== cleanedStr) {
      output.push(`\n\n${pad(underline(cleanedStr))}\n`)
      lastStr = cleanedStr
    }
  })

  tap.on('complete', results => {
    if (args.summarize) {
      const failCount = results.failures.length
      const [past, plural] = failCount === 1 ? ['was', 'failure'] : ['were', 'failures']
      const finalFailMsg = `${bold(red('Failed Tests:'))} There ${past} ${bold(red(failCount))} ${plural}\n\n`

      output.push('\n' + pad(finalFailMsg))
      results.failures.forEach(f => output.push(formatFail(f, args.stack)))
    }
    output.push('\n' + pad(`Total: ${results.count}\n`))
    output.push(pad(green(`Passed: ${results.pass}\n`)))
    output.push(pad(red(`Failed: ${results.fail}\n`)))
    output.push(pad(cyan(`Skipped: ${skippedTests}\n`)))
    output.push(pad(`Duration: ${new Date().getTime() - startTime}ms\n\n`))
  })

  return stream
}

module.exports = onTap
