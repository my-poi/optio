angular.module('app').controller('TimeSheetController', function ($rootScope, $scope, $http) {
  var self = this
  self.title = ''
  self.pagesData = []
  self.daysData = []

  // http://localhost:8001/?nazwa=lista-obecnosci&id=3&rok=2017&miesiac=4

  $scope.$watch('timeSheetParams', function (params) {
    setPrintSize('portrait')
    prepareTimeSheetDays(params)
    loadTimeSheetData(params)
  })

  function prepareTimeSheetDays (params) {
    var year = params.year
    var month = params.month - 1
    var daysInMonth = moment({year: year, month: month}).daysInMonth()

    for (var day = 1; day <= daysInMonth; day++) {
      var currentDay = new Date(year, month, day)
      var isFree = getIsFreeDay(currentDay)
      var timeSheetDay = new TimeSheetDay(day, isFree)
      self.daysData.push(timeSheetDay)
    }
  }

  function getIsFreeDay (currentDay) {
    var dayOfWeek = currentDay.getDay()
    if (dayOfWeek === 0 || dayOfWeek === 6) return true
    var currentTime = currentDay.getTime()
    var isHoliday = $rootScope.data.holidays.some(function (holiday) {
      return holiday.dayOff.getTime() === currentTime
    })
    if (isHoliday) return true
    return false
  }

  function loadTimeSheetData (params) {
    $http.get('test-data/time-sheet.json')
      .then(function (res) {
        var result = res.data[0]
        self.title = String.format('{0}/{1} - {2} {3}',
          $rootScope.companyName,
          result.title,
          monthNames[params.month - 1].toLowerCase(),
          params.year)
        var employees = result.employees
        var employeesLength = employees.length - 1
        var pages = Math.ceil(employeesLength / 10)

        for (var page = 1; page <= pages; page++) {
          var startIndex = page * 10 - 10
          var endIndex = startIndex + 10
          var pageEmployees = employees.slice(startIndex, endIndex)
          var timeSheetPage = new TimeSheetPage(page, pageEmployees)
          self.pagesData.push(timeSheetPage)
        }
      })
  }
})
