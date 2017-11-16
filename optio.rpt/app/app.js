// projekt: Optio Reports
// wydawca: My-Poi!
// kontakt: maciej.tokarz@my-poi.pl

angular.module('app', ['app.config', 'ui.bootstrap', 'modal-service', 'smart-table'])

angular.module('app').run(function ($rootScope) {
  $rootScope.companyName = 'Firma XYZ'
  $rootScope.data = {
    holidays: []
  }
})

angular.module('app').controller('MainController', function ($rootScope, $http) {
  var self = this
  self.report = null

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
      .register('./service-worker.js')
      .then(function () { console.log('Service Worker Registered') })
  }

  var dataLoaderController = new DataLoaderController($rootScope, $http)
  dataLoaderController.loadData()

  var urlController = new UrlController()
  urlController.checkUrl($rootScope, self)
})
