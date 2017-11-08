angular
    .module('citizenos')
    .factory('cosHttpApiUnauthorizedInterceptor', ['$log', '$q', '$window', 'sLocation', function ($log, $q, $window, sLocation) {
        $log.debug('citizenos.factory.cosHttpApiUnauthorizedInterceptor');

        var API_REQUEST_REGEX = /\/api\/(?!auth\/status).*/i;

        return {
            'response': function (response) {
                return response;
            },
            'responseError': function (response) {
                if (response.config.url.match(API_REQUEST_REGEX) && response.status === 401) {
                    $window.location = sLocation.getAbsoluteUrl('/account/login') + '?redirectSuccess=' + $window.location.pathname + '?' + $window.location.search;
                    return;
                }

                return $q.reject(response);
            }
        };

    }]);
