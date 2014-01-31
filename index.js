var mocha = require('mocha')
var co = require('co')

function isFunc (v) {
  return typeof v === 'function'
}

// Hijack timeout as it is the first thing that gets called in run().
// Replacing run() directly is probably too fragile.
var old = mocha.Runnable.prototype.timeout
mocha.Runnable.prototype.timeout = function () {
  var fn = this.fn

  // Wrap generator functions with co
  if ('GeneratorFunction' === fn.constructor.name) {
    this.async = true
    this.fn = co(fn)
  }

  // Swap out after first call so we don't wrap multiple times.
  return (this.timeout = old).apply(this, arguments)
}
