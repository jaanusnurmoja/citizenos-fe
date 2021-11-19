'use strict';

angular
    .module('citizenos')
    .controller('TopicInviteCtrl', ['$scope', '$state', '$stateParams', '$log', '$location', 'ngDialog', 'sSearch', 'sLocation', 'sNotification', 'sAuth', 'Topic', 'TopicInviteUser', 'TopicMemberUser', 'TopicMemberGroup', 'TopicJoin', function ($scope, $state, $stateParams, $log, $location, ngDialog, sSearch, sLocation, sNotification, sAuth, Topic, TopicInviteUser, TopicMemberUser, TopicMemberGroup, TopicJoin) {
        $log.debug('TopicInviteCtrl', $state, $stateParams);

        $scope.memberGroups = ['groups', 'users'];
        $scope.inviteMessageMaxLength = 1000;
        $scope.tabSelected = $stateParams.tab || 'invite';

        var EMAIL_SEPARATOR_REGEXP = /[;,\s]/ig;

        $scope.topicList = {
            searchFilter: '',
            searchOrderBy: {
                property: 'title'
            }
        };

        var maxUsers = 50;
        var itemsPerPage = 10;
        var init = function () {
            $scope.form = {
                topic: null,
                description: null,
                join: {
                    level: null,
                    token: null
                },
                joinUrl: null
            };
            $scope.form.topic = angular.copy($scope.topic);
            $scope.form.description = angular.element($scope.topic.description).text().replace($scope.topic.title, '');

            $scope.form.join = $scope.form.topic.join;
            $scope.generateJoinUrl();

            $scope.membersPage = 1;
            $scope.groupLevel = TopicMemberGroup.LEVELS.read;
            $scope.members = [];
            $scope.invalid = [];

            $scope.TopicMemberUser = TopicMemberUser;
            $scope.TopicMemberGroup = TopicMemberGroup;

            $scope.searchString = null;
            $scope.searchResults = {};

            $scope.errors = null;
        };

        $scope.search = function (str) {
            console.log('search', str);

            $scope.searchString = str; // TODO: Hackish - Typeahead has term="searchString" but somehow the 2 way binding does not work there, investigate when time
            if (str && str.length >= 2) {
                if (str.match(EMAIL_SEPARATOR_REGEXP)) {
                    $scope.searchResults.users = [];
                    $scope.searchResults.groups = [];
                    $scope.searchResults.emails = [];
                    $scope.searchResults.combined = [str];
                } else {
                    var include = ['my.group', 'public.user'];
                    sSearch
                        .search(str, {include: include})
                        .then(function (response) {
                            $scope.searchResults.users = [];
                            $scope.searchResults.groups = [];
                            $scope.searchResults.emails = [];
                            $scope.searchResults.combined = [];
                            if (response.data.data.results.public.users.rows.length) {
                                response.data.data.results.public.users.rows.forEach(function (user) {
                                    $scope.searchResults.users.push(user);
                                });
                            } else if (validator.isEmail(str)) {
                                $scope.searchResults.emails.push($scope.searchString);
                            }
                            if (response.data.data.results.my.groups.rows.length) {
                                response.data.data.results.my.groups.rows.forEach(function (group) {
                                    $scope.searchResults.groups.push(group);
                                });
                            }
                            $scope.searchResults.combined = $scope.searchResults.users.concat($scope.searchResults.groups).concat($scope.searchResults.emails);
                        });
                }
            } else {
                $scope.searchResults.users = [];
                $scope.searchResults.emails = [];
                $scope.searchResults.groups = [];
                $scope.searchResults.combined = [];
            }
        };

        $scope.itemsExist = function (type) {
            var exists = false;
            var i = ($scope.membersPage * itemsPerPage) - itemsPerPage;
            for (i; i < $scope.members.length && i < ($scope.membersPage * itemsPerPage); i++) {
                if (type === 'groups') {
                    if ($scope.members[i].groupId) {
                        exists = true;
                        break;
                    }
                } else if (!$scope.members[i].groupId) {
                    exists = true;
                    break;
                }

            }

            return exists;
        };

        $scope.isInGroup = function (item, group) {
            if (group === 'groups') {
                return !!item.groupId;
            } else {
                return !item.groupId;
            }
        };

        $scope.updateGroupLevel = function (level) {
            $scope.groupLevel = level;
            $scope.members.forEach(function (item) {
                item.level = $scope.groupLevel;
            });
        };

        $scope.removeAllMembers = function () {
            $scope.members = [];
        };

        $scope.loadPage = function (pageNr) {
            $scope.membersPage = pageNr;
        };
        $scope.totalPages = function (items) {
            return Math.ceil(items.length / itemsPerPage);
        };

        $scope.isOnPage = function (index, page) {
            var endIndex = page * itemsPerPage;
            return (index >= (endIndex - itemsPerPage) && index < endIndex);
        };

        var orderMembers = function () {
            var compare = function (a, b) {
                var property = 'name';
                return (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
            };
            var groups = $scope.members.filter(function (member) {
                return !!member.groupId;
            }).sort(compare);
            var users = $scope.members.filter(function (member) {
                return !member.groupId;
            }).sort(compare);

            $scope.members = groups.concat(users);
        };

        $scope.addTopicMember = function (member) {
            if ($scope.members.length >= maxUsers) {
                sNotification.addError('MSG_ERROR_INVITE_MEMBER_COUNT_OVER_LIMIT');
                return;
            }
            if (!member || (typeof member === 'string' && (validator.isEmail(member) || member.match(EMAIL_SEPARATOR_REGEXP)))) {
                $log.debug('go to addTopicMemberUser');
                return $scope.addTopicMemberUser();
            }
            if (member.hasOwnProperty('company')) {
                return $scope.addTopicMemberUser(member);
            } else {
                return $scope.addTopicMemberGroup(member);
            }
        };

        $scope.addTopicMemberGroup = function (group) {
            $scope.searchString = null;
            $scope.searchResults.users = [];
            $scope.searchResults.groups = [];
            $scope.searchResults.emails = [];
            $scope.searchResults.combined = [];

            if (!group || !group.id || !group.name) {
                return false;
            }
            var member = _.find($scope.members, function (o) {
                return o.id === group.id;
            });

            if (!member) {
                var memberClone = angular.copy(group);
                memberClone.groupId = group.id;
                memberClone.level = $scope.groupLevel;

                $scope.members.push(memberClone);
                orderMembers();
            }
        };

        $scope.addCorrectedEmail = function (email, key) {
            if (validator.isEmail(email.trim())) {
                if (!_.find($scope.members, ['userId', email])) {
                    $scope.addTopicMemberUser({
                        userId: email,
                        name: email,
                        level: $scope.groupLevel
                    });
                }
                $scope.invalid.splice(key, 1);
            }
        };

        $scope.removeInvalidEmail = function (key) {
            $scope.invalid.splice(key, 1);
        };

        $scope.addTopicMemberUser = function (member) {
            if (member) {
                if (_.find($scope.members, {userId: member.id})) {
                    // Ignore duplicates
                    $scope.searchString = null;
                    $scope.searchResults.users = [];
                    $scope.searchResults.groups = [];
                    $scope.searchResults.emails = [];
                    $scope.searchResults.combined = [];
                    return;
                } else {
                    var memberClone = angular.copy(member);
                    memberClone.userId = member.id;
                    memberClone.level = $scope.groupLevel;

                    $scope.members.push(memberClone);
                    orderMembers();
                    $scope.searchResults.groups = [];
                    $scope.searchResults.users = [];
                    $scope.searchResults.emails = [];
                    $scope.searchResults.combined = [];
                }
            } else {
                if (!$scope.searchString) return;

                // Assume e-mail was entered.
                var emails = $scope.searchString.replace(EMAIL_SEPARATOR_REGEXP, ',').split(',');

                var filtered = _.filter(emails, function (email) {
                    return validator.isEmail(email.trim())
                });

                var invalid = _.filter(emails, function (email) {
                    return !validator.isEmail(email.trim()) && email.trim().length > 0;
                });

                if (!filtered.length && !invalid.length) {
                    $log.debug('Ignoring member, as it does not look like e-mail', $scope.searchString);
                    return;
                }

                _.sortedUniq(filtered.sort()).forEach(function (email) {
                    email = email.trim();
                    if ($scope.members.length >= maxUsers) {
                        sNotification.addError('MSG_ERROR_INVITE_MEMBER_COUNT_OVER_LIMIT');
                        return;
                    }
                    if (!_.find($scope.members, ['userId', email])) {
                        $scope.members.push({
                            userId: email,
                            name: email,
                            level: $scope.groupLevel
                        });
                        orderMembers();
                    }
                });

                if (invalid && invalid.length) {
                    invalid.forEach(function (item) {
                        if ($scope.invalid.indexOf(item) === -1) {
                            $scope.invalid.push(item);
                        }
                    });
                }

                $scope.searchResults.groups = [];
                $scope.searchResults.users = [];
                $scope.searchResults.emails = [];
                $scope.searchResults.combined = [];
                $scope.searchString = null;
            }
        };

        $scope.removeTopicMemberUser = function (member) {
            $scope.members.splice($scope.members.indexOf(member), 1);
        };

        $scope.updateTopicMemberUserLevel = function (member, level) {
            $scope.members[$scope.members.indexOf(member)].level = level;
        };

        $scope.removeTopicMemberGroup = function (group) {
            $scope.members.splice($scope.members.indexOf(group), 1);
        };

        $scope.updateTopicMemberGroupLevel = function (group, level) {
            $scope.members[$scope.members.indexOf(group)].level = level;
        };

        $scope.selectTab = function (tab) {
            $scope.tabSelected = tab;
            $location.search({tab: tab});
        };

        $scope.doSaveTopic = function () {
            $scope.errors = null;

            if ($scope.form.topic.endsAt && $scope.topic.endsAt === $scope.form.topic.endsAt) { //Remove endsAt field so that topics with endsAt value set could be updated if endsAt is not changed
                delete $scope.form.topic.endsAt;
            }

            $scope.form.topic
                .$update()
                .then(function (data) {
                    var savePromises = [];
                    // Users
                    var topicMemberUsersToSave = [];
                    $scope.members.forEach(function (member) {
                        if (member.groupId) {
                            var member = {
                                id: member.id,
                                topicId: $scope.topic.id,
                                level: member.level
                            };
                            var topicMemberGroup = new TopicMemberGroup(member);
                            savePromises.push(
                                topicMemberGroup.$save()
                            )
                        } else {
                            topicMemberUsersToSave.push({
                                userId: member.userId,
                                inviteMessage: $scope.form.inviteMessage,
                                level: member.level
                            })
                        }
                    });

                    if (topicMemberUsersToSave.length) {
                        savePromises.push(
                            TopicInviteUser.save({topicId: $scope.topic.id}, topicMemberUsersToSave)
                        );
                    }

                    return Promise.all(savePromises)
                })
                .then(
                    function () {
                        $state.go($state.current.parent, {topicId: $scope.topic.id}, {reload: true});
                    },
                    function (errorResponse) {
                        if (errorResponse.data && errorResponse.data.errors) {
                            $scope.errors = errorResponse.data.errors;
                        }
                    }
                );
        };

        $scope.generateTokenJoin = function () {
            ngDialog
                .openConfirm({
                    template: '/views/modals/topic_join_link_generate_confirm.html',
                })
                .then(function () {
                    var topicJoin = new TopicJoin({
                        topicId: $scope.topic.id,
                        userId: sAuth.user.id,
                        level: $scope.form.join.level
                    });

                    topicJoin.$save()
                        .then(function (res) {
                            $scope.topic.join = res;
                            $scope.form.join.token = res.token;
                            $scope.form.join.level = res.level;
                            $scope.generateJoinUrl();
                        });
                }, angular.noop);
        };

        $scope.doUpdateJoinToken = function (level) {
            var topicJoin = new TopicJoin({
                topicId: $scope.topic.id,
                userId: sAuth.user.id,
                level: level,
                token: $scope.form.join.token
            });

            topicJoin.$update()
                .then(function (res) {
                    $scope.form.join.level = level;
                });
        };

        $scope.copyInviteLink = function () {
            var urlInputElement = document.getElementById('url_invite_topic_input');
            urlInputElement.focus();
            urlInputElement.select();
            urlInputElement.setSelectionRange(0, 99999);
            document.execCommand('copy');
        };

        $scope.generateJoinUrl = function () {
            if ($scope.topic.join.token && $scope.topic.canUpdate()) {
                $scope.form.urlJoin = sLocation.getAbsoluteUrl('/topics/join/' + $scope.topic.join.token);
            }
        };

        init();
    }]);
