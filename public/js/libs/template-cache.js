/** AUTOGENERATED BY GULP templatecache TASK **/ 

angular
    .module('citizenos')
    .run(['$log', '$http', '$templateCache', function ($log, $http, $templateCache) {
        var templates = [
            '/views/about.html',
            '/views/faq.html',
            '/views/groups.html',
            '/views/help.html',
            '/views/home.html',
            '/views/mygroups.html',
            '/views/mytopics.html',
            '/views/no_topics.html',
            '/views/topics.html',
            '/views/default/nav.html',
            '/views/default/nav_mobile.html',
            '/views/default/search.html',
            '/views/layouts/main.html',
            '/views/lightboxes/id_signing.html',
            '/views/modals/login.html',
            '/views/modals/login_esteid.html',
            '/views/modals/password_forgot.html',
            '/views/modals/password_reset.html',
            '/views/modals/sign_up.html',
        ];
        var i = 0;
        if (templates.length) {
            downloadToCache();
        }
        function downloadToCache() {
            var template = templates[i];
            $http
                .get(template, {
                    ignoreLoadingBar: true
                })
                .then(
                    function (response) {
                        $templateCache.put(response.config.url, response.data);
                        $log.debug('cached page', response.config.url);

                        if (++i < templates.length) {
                            downloadToCache();
                        }
                    },
                    function (err) {
                        $log.error('error', err);
                        if (++i < templates.length) {
                            downloadToCache();
                        }
                    }
                );
        }
    }]);