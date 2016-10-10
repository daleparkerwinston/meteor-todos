/**
 * Created by dale.winston on 10/10/2016.
 */

import 'angular-mocks'
import {Meteor} from 'meteor/meteor';
import {assert} from 'meteor/practicalmeteor:chai';
import {sinon} from 'meteor/practicalmeteor:chai';

import todoList from '../todoList';

describe('todoList', function () {
    var element;

    beforeEach(function () {
        var $compile;
        var $rootScope;

        window.module(todoList.name);

        inject(function (_$compile_, _$rootScope_) {
            $compile = _$compile_;
            $rootScope = _$rootScope_;
        });

        element = $compile('<todo-list></todo-list>')($rootScope.$new(true));
        $rootScope.$digest();
    });

    describe('component', function () {
        it('should be showing incomplete tasks count', function () {
            assert.include(element[0].querySelector('h1').innerHTML, '0');
        });
    });

    describe('controller', function() {
        describe('addTask', function() {
            var controller;
            var newTask = 'Do more things';

            beforeEach(() => {
                sinon.stub(Meteor, 'call');
                controller = element.controller('todoList');
                controller.newTask = 'Do one thing';
                controller.addTask(newTask);
            });

            afterEach(() => {
                Meteor.call.restore();
            });

            it('should call tasks.insert method', function() {
                sinon.assert.calledOnce(Meteor.call);
                sinon.assert.calledWith(Meteor.call, 'tasks.insert', newTask);
            });

            it('should reset newTask', function() {
                assert.equal(controller.newTask, '');
            });
        });
    });
});