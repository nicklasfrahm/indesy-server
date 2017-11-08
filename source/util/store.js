const data = {}

function Store(storeId) {
  this.storeId = storeId

  if (!data[this.storeId]) data[storeId] = {}

  this.get = function(property) {
    return data[this.storeId][property]
  }

  this.set = function(property, value) {
    data[this.storeId][property] = value
    return this
  }

  return this
}

module.exports = exports = Store
