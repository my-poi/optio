function CustomError (errorCode) {
  this.name = 'CustomError'
  this.errorCode = errorCode || ''
  var error = new Error(this.errorCode)
  error.name = this.name
  this.stack = error.stack
}
CustomError.prototype = Object.create(Error.prototype)

String.format = function (format) {
  var args = Array.prototype.slice.call(arguments, 1)
  return format.replace(/{(\d+)}/g, function (match, number) {
    return typeof args[number] !== 'undefined'
      ? args[number]
      : match
  })
}

Number.prototype.pad = function (size) {
  var s = String(this)
  while (s.length < (size || 2)) { s = '0' + s }
  return s
}

// eslint-disable-next-line
Array.prototype.clear = function () {
  while (this.length) {
    this.pop()
  }
}

// eslint-disable-next-line
Array.prototype.contains = function (obj) {
  var i = this.length
  while (i--) {
    if (this[i] === obj) return true
  }
  return false
}

function isNullOrWhiteSpace (input) {
  return !input || !input.trim()
}

function IsEmail (email) {
  var pattern = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-?\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/
  if (!email) return false
  if (email.length > 254) return false
  if (!pattern.test(email)) return false
  var parts = email.split('@')
  if (parts[0].length > 64) return false
  var domainParts = parts[1].split('.')
  if (domainParts.some(function (part) { return part.length > 63 })) return false
  return true
}

function ShowError (e) {
  if (e.data.errorCode) throw new CustomError(e.data.errorCode)
  else throw new Error(e.data)
}

if (!Array.prototype.includes) {
  Array.prototype.includes = function (searchElement /*, fromIndex */) {
    'use strict'
    var O = Object(this)
    var len = parseInt(O.length) || 0
    if (len === 0) {
      return false
    }
    var n = parseInt(arguments[1]) || 0
    var k
    if (n >= 0) {
      k = n
    } else {
      k = len + n
      if (k < 0) { k = 0 }
    }
    var currentElement
    while (k < len) {
      currentElement = O[k]
      if (searchElement === currentElement || (searchElement !== searchElement && currentElement !== currentElement)) { // NaN !== NaN
        return true
      }
      k++
    }
    return false
  }
}

var weekDays = ['Niedziela', 'Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota']
var monthNames = ['Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec', 'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień']

function getDayOfWeek (date) {
  var dayOfWeek = date.getDay()
  return weekDays[dayOfWeek]
}

function setPrintSize (size) {
  var css = '@page { size: ' + size + '; }'
  var head = document.head || document.getElementsByTagName('head')[0]
  var style = document.createElement('style')
  style.type = 'text/css'
  style.media = 'print'
  style.appendChild(document.createTextNode(css))
  head.appendChild(style)
}
