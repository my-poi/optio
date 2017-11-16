angular.module('app').factory('$exceptionHandler',
  function ($injector) {
    return function (exception) {
      var modalService = $injector.get('modalService')
      var $translate = $injector.get('$translate')

      modalService.showModal({
        templateUrl: 'views/error.html',
        controller: function (close) {
          var self = this

          if (exception) {
            if (exception.errorCode) {
              // $translate([exception.errorCode]).then(function (translations) {
              //   self.message = translations[exception.errorCode]
              // })
            } else if (exception.message) self.message = exception.message
            else self.message = exception.substring(0, 100)
          } else {
            // $translate(['0000']).then(function (translations) {
            //   self.message = translations['0000']
            // })
          }

          self.close = function () {
            $('.modal-backdrop').remove()
            close()
          }
        },
        controllerAs: 'error'
      }).then(function (modal) {
        modal.element.modal()
      })
    }
  }
)
