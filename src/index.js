/* Modules */
const Parser = require('tap-parser')

function onTap (args) {
  const tap = new Parser()

  /* Parser Event listening */

  tap.on('plan', a => {
    console.log('PLAN', a)
  })

  // Event for each assert inside the current Test
  tap.on('assert', res => {
    console.log('ASSERT', res)
  })

  tap.on('comment', res => {
    console.log('COMMENT', res)
  })

  tap.on('complete', output => {
    console.log('COMPLETE', output)
  })

  return tap
}

module.exports = onTap
