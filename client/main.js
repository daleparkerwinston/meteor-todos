import angular from 'angular';
import angularMeteor from 'angular-meteor';
import todoList from '../imports/components/todoList/todoList';
import '../imports/startup/accounts-config';

angular.module('simple-todo', [
    angularMeteor,
    todoList.name,
    'accounts.ui'
]);