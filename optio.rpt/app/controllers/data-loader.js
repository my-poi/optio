var DataLoaderController = function ($rootScope, $http) {
  var self = this

  self.loadData = function () {
    $http.get('test-data/holidays.json')
      .then(function (res) {
        $rootScope.data.holidays = res.data
        angular.forEach($rootScope.data.holidays, function (holiday) {
          holiday.dayOff = new Date(holiday.dayOff)
        })
      })
  }
}
