/* Modules */
const { underline } = require('colorette')
const through = require('through2')
const duplexer = require('duplexer3')
const Parser = require('tap-parser')

function pad (str) {
  return `  ${str}`
}

function onTap (args) {
  const startTime = new Date().getTime()
  const tap = new Parser()
  const output = through()
  const stream = duplexer(tap, output)
  const bundles = []
  let stats = { runningTsts: [], title: '' }
  let currCmt = ''

  output.push('\n')

  /* Parser Event listening */

  tap.on('plan', a => {
    console.log('PLAN', a)
  })

  // Event for each assert inside the current Test
  tap.on('assert', res => {
    console.log('ASSERT', res)
    output.push(`\n${pad(underline(currCmt || res.name))}\n\n`)
    stats.runningTsts.push(res)
  })

  tap.on('comment', res => {
    console.log('COMMENT', res)
    // if (!titleCmts.old && titleCmts.curr) {
    //   titleCmts.old = titleCmts.curr
    //   titleCmts.curr = res
    // }

    if (!stats.title && !stats.runningTsts.length) {
      stats.title = res
    } else {
      bundles.push(stats)
      stats = { runningTsts: [], title: res }
    }

    if (args.usingTape) {
      currCmt = res
    }
  })

  tap.on('complete', output => {
    console.log('COMPLETE', output)
    console.log(bundles.filter(({ runningTsts }) => runningTsts.length))
  })

  return stream
}

module.exports = onTap
