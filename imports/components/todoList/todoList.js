import angular from "angular";
import angularMeteor from "angular-meteor";
import {Tasks} from "../../api/tasks.js";
import {Meteor} from 'meteor/meteor';
import "./todoList.html";

class TodoListCtrl {
    constructor($scope) {
        $scope.viewModel(this);

        this.hideCompleted = false;

        this.helpers({
            tasks() {
                const selector = {owner: Meteor.userId()};

                // If hide completed is checked, filter tasks
                if (this.getReactively('hideCompleted')) {
                    selector.checked = {
                        $ne: true
                    };
                }

                return Tasks.find(selector, {
                    sort: {
                        createdAt: -1
                    }
                });
            },
            incompleteCount() {
                return Tasks.find({owner:Meteor.userId(),checked: {$ne: true}}).count();
            },
            currentUser() {
                return Meteor.user();
            }
        })
    }

    addTask(newTask) {
        // Insert a task into the collection
        Tasks.insert({
            text: newTask,
            createdAt: new Date,
            owner: Meteor.userId(),
            username: Meteor.user().username
        });

        // Clear form
        this.newTask = "";
    }

    setChecked(task) {
        Tasks.update(task._id, {
            $set: {
                checked: !task.checked
            },
        });
    }

    removeTask(task) {
        Tasks.remove(task._id);
    }
}

export default angular.module('todoList', [
    angularMeteor
]).component('todoList', {
    templateUrl: 'imports/components/todoList/todoList.html',
    controller: ['$scope', TodoListCtrl]
});