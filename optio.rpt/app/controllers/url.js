var UrlController = function () {
  var self = this

  // http://localhost:8001/?nazwa=karta-czasu-pracy&rok=2017&miesiac=4

  self.checkUrl = function ($rootScope, main) {
    var url = new URL(window.location.href)
    var name = url.searchParams.get('nazwa')
    var year = parseInt(url.searchParams.get('rok'))
    var month = parseInt(url.searchParams.get('miesiac'))
    var id = parseInt(url.searchParams.get('id'))

    if (name === 'grafik') {
      $rootScope.scheduleParams = {year: year, month: month}
      $rootScope.$broadcast('scheduleParams')
      main.report = 'schedule'
    }

    if (name === 'karta-czasu-pracy') {
      main.report = 'timeCard'
    }

    if (name === 'lista-obecnosci') {
      $rootScope.timeSheetParams = {year: year, month: month, timeSheetId: id}
      $rootScope.$broadcast('timeSheetParams')
      main.report = 'timeSheet'
    }
  }
}
