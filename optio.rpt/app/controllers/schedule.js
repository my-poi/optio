angular.module('app').controller('ScheduleController', function ($rootScope, $scope, $http) {
  var self = this
  self.title = ''
  self.headerData = []
  self.scheduleData = []

  // http://localhost:8001/?nazwa=grafik&id=1&rok=2017&miesiac=4

  $scope.$watch('scheduleParams', function (params) {
    setPrintSize('landscape')
    self.loadScheduleData(params)
  })

  self.loadScheduleData = function (params) {
    $http.get('test-data/schedule-big.json')
      .then(function (res) {
        self.title = String.format('{0}/{1} - grafik na {2} {3}',
          $rootScope.companyName,
          res.data[0].companyNodePath,
          monthNames[params.month - 1].toLowerCase(),
          params.year)
        self.scheduleData = $.grep(res.data[0].schedules, function (schedule) {
          return schedule.year === params.year && schedule.month === params.month
        })
        self.headerData = self.scheduleData[0]
      })
  }
})
