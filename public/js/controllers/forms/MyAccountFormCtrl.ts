'use strict';
import * as angular from 'angular';

angular
    .module('citizenos')
    .controller('MyAccountFormCtrl', ['$scope', '$log', '$stateParams', '$document', '$window', 'ngDialog', 'sNotification', 'sAuth', 'sUser', 'sUpload', function ($scope, $log, $stateParams, $document, $window, ngDialog, sNotification, sAuth, sUser, sUpload) {
        $log.debug('MyAccountFormCtrl');

        $scope.app.tabSelected = 'profile';
        $scope.form = {
            name: null,
            email: null,
            password: null,
            newPassword: null,
            company: null,
            imageUrl: null,
            passwordConfirm: null,
            preferences: {
                showInSearch: false
            }
        };

        $scope.imageFile = null;
        angular.extend($scope.form, sAuth.user);

        $scope.doUpdateProfile = function () {
            $scope.errors = null;

            var success = function (res) {
                // E-mail address was changed!
                var emailChanged = sAuth.user.email !== $scope.form.email;
                angular.extend(sAuth.user, res.data.data);
                ngDialog.closeAll(); // Close all dialogs, including the one open now...
                if (emailChanged) {
                    sNotification.addInfo('MSG_INFO_CHECK_EMAIL_TO_VERIFY_YOUR_NEW_EMAIL_ADDRESS');
                }
            };

            var error = function (res) {
                $scope.errors = res.data.errors;
            };

            if ($scope.form.newPassword) {
                if ($scope.form.newPassword !== $scope.form.passwordConfirm) {
                    $scope.errors = {
                        newPassword: 'MSG_ERROR_PASSWORD_MISMATCH'
                    };
                    return;
                }
            }

            if ($scope.imageFile) {
                sUpload
                    .uploadUserImage($scope.imageFile)
                    .then(function (response) {
                        $scope.form.imageUrl = response.data.link;
                        sAuth.user.imageUrl = response.data.link;
                        ngDialog.closeAll(); // Close all dialogs, including the one open now...
                    }, error);

            } else {
                sUser
                    .update($scope.form.name, $scope.form.email, $scope.form.password, $scope.form.company, $scope.form.imageUrl, $scope.form.preferences, null, null, $scope.form.newPassword)
                    .then(success, error);
            }
        };

        $scope.uploadImage = function () {
            $document[0].getElementById('profileImage').click();
        };

        $scope.switchImage = function (files) {
            $scope.imageFile = files[0];
            var reader = new FileReader();
            reader.onload = (function () {
                return function (e) {
                    $scope.$apply(function () {
                        $scope.form.imageUrl = e.target.result;
                    });
                };
            })();
            reader.readAsDataURL(files[0]);
        };

        $scope.deleteProfileImage = function () {
            sUser
                .update($scope.form.name, $scope.form.email, $scope.form.password, $scope.form.company, '')
                .then(
                    function (res) {
                        angular.extend(sAuth.user, res.data.data);
                        $scope.form.imageUrl = '';
                    },
                    function (res) {
                        $scope.errors = res.data.errors;
                    }
                );
        };

        $scope.selectTab = function (tab) {
            $scope.tabSelected = tab;
        }

        $scope.doDeleteAccount = function () {
            var data = angular.extend({}, $stateParams);
            ngDialog.openConfirm({
                template: '/views/modals/user_delete_confirm.html',
                data: data,
                scope: $scope, // Pass on $scope so that I can access AppCtrl,
                closeByEscape: false,
                closeByNavigation: false
            })
            .then(
                function () {
                    sUser
                        .deleteUser()
                        .then(function () {
                            return sAuth
                                .logout();
                        })
                        .then(function () {
                            $window.location.href = '/';
                        });
                }
            );
        }

    }]);
