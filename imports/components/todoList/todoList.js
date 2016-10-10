import angular from "angular";
import angularMeteor from "angular-meteor";
import {TasksCollection} from "../../api/tasks.js";
import {Meteor} from 'meteor/meteor';
import "./todoList.html";

class TodoListCtrl {
    constructor($scope) {
        $scope.viewModel(this);

        this.subscribe('tasks');

        this.hideCompleted = false;

        this.helpers({
            tasks() {
                const selector = {};

                // If hide completed is checked, filter tasks
                if (this.getReactively('hideCompleted')) {
                    selector.checked = {
                        $ne: true
                    };
                }

                return TasksCollection.find(selector, {
                    sort: {
                        createdAt: -1
                    }
                });
            },
            incompleteCount() {
                return TasksCollection.find({checked: {$ne: true}}).count();
            },
            currentUser() {
                return Meteor.user();
            }
        })
    }

    addTask(newTask) {
        // Insert a task into the collection
        Meteor.call('tasks.insert', newTask);

        // Clear form
        this.newTask = "";``
    }

    setChecked(task) {
        // Update checked column of task document in collection
        Meteor.call('tasks.setChecked', task._id, !task.checked);
    }

    removeTask(task) {
        Meteor.call('tasks.remove', task._id);
    }

    setPrivate(task) {
        Meteor.call('tasks.setPrivate', task._id, !task.private);
    }
}

export default angular.module('todoList', [
    angularMeteor
]).component('todoList', {
    templateUrl: 'imports/components/todoList/todoList.html',
    controller: ['$scope', TodoListCtrl]
});