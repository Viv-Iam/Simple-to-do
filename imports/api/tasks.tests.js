//makes mocha know test file
/* eslint-env mocha */

import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { assert } from 'chai';
import { Accounts } from 'meteor/accounts-base';
import { Tasks } from './tasks.js';

//checks is running on the server side
if (Meteor.isServer) {
  describe('Tasks', () => {
    describe('methods', () => {
      // const userId = Random.id();
      // let taskId;

      const username ='vivian'
      let taskId, userId;

      before(() => {
        //create user if not already created
        const user = Meteor.users.findOne({username: username})
        
        if(!user) {
          userId = Accounts.createUser({
            'username': username,
            'email': 'vivian.opondoh@gmail.com',
            'password': '12345678'
          })
        } else {
          userId = user._id
        }
      })

      beforeEach(() => {
        //remove all tasks
        Tasks.remove({});
        //create task and equate taskId
        taskId = Tasks.insert({
          text: 'test task',
          createdAt: new Date(),
          owner: userId,
          username: 'tmeasday',
          checked: false,
          private: false
        });
      });

      // *******************DELETE****************

      //write test shows that you can delete your own task
      it('can delete owned task', () => {
        // Find the internal implementation of the task method so we can
        // test it in isolation
        const deleteTask = Meteor.server.method_handlers['tasks.remove'];

        // Set up a fake method invocation that looks like what the method expects
        const invocation = { userId };

        // Run the method with `this` set to the fake invocation
        deleteTask.apply(invocation, [taskId]);

        // Verify that the method does what we expected
        assert.equal(Tasks.find().count(), 0);
      });

      //write test shows that you cannot delete others task
      it('cannot delete others task', () => {

        //set existing task private by updating the task
        Tasks.update(taskId, { $set: { private: true } });

        //generate id to rep another user
        const anotheruserId = Random.id();

        // Find the internal implementation of the task method so we can
        // test it in isolation
        const deleteTask = Meteor.server.method_handlers['tasks.remove'];

        // Creat fake user id object for method
        const invocation = { 'userId': anotheruserId };

        // verify that exception is thrown
        assert.throws(function() {

        // Run test **there are some global variables that are local thus pass them*8
        deleteTask.apply(invocation, [taskId]);
          
        }, Meteor.Error, /not.authorized/);

        // Verify that task is not deleted
        assert.equal(Tasks.find().count(), 1);
      });

      // *******************INSERT****************

      //write test shows that you can insert task
      it('can insert owned tasks', () => {
        const text = "text"
        // Find the internal implementation of the task method so we can
        // test it in isolation
        const insertTask = Meteor.server.method_handlers['tasks.insert'];

        // Set up a fake method invocation that looks like what the method expects
        const invocation = { userId };

        // Run the method with `this` set to the fake invocation
        insertTask.apply(invocation, [text]);

        // Verify that the method does what we expected
        assert.equal(Tasks.find().count(), 2);
      });

       //write test shows that you cannot insert task if not logged in
       it('cannot insert task if !loggedin', () => {
        const text = "text"

        //cannot use because not userId is not a boolean but a string
        // notLoggedIn = ! this._id

        // Find the internal implementation of the task method so we can
        // test it in isolation
        const insertTask = Meteor.server.method_handlers['tasks.insert'];

        // Set up a fake method invocation that looks like what the method expects
        const invocation = {  };

        // verify that exception is thrown
        assert.throws(function() {
          
        // Run test **there are some global variables that are local thus pass them*8
        insertTask.apply(invocation, [text]);
                    
        }, Meteor.Error, /not.authorized/);
        
        // Verify that the method does what we expected
        assert.equal(Tasks.find().count(), 1);
      });

       // *******************SETCHECKED****************

      //write test shows that you can setChecked task
      it('can setChecked task', () => {

        // Find the internal implementation of the task method so we can
        // test it in isolation
        const setCheckedTask = Meteor.server.method_handlers['tasks.setChecked'];

        // Set up a fake method invocation that looks like what the method expects
        const invocation = { userId };

        // Run the method with `this` set to the fake invocation
        setCheckedTask.apply(invocation, [taskId, true]);

        // Verify that the method does what we expected
        assert.equal(Tasks.find(taskId, { $set: { checked: true } }).count(), 1);
      });

      //write test shows that you cannot setChecked task
      it('cannot setChecked task', () => {

        //set existing task private by updating the task
        Tasks.update(taskId, { $set: { private: true } });

        //generate id to rep another user
        const anotheruserId = Random.id();
        
        // Find the internal implementation of the task method so we can
        // test it in isolation
        const setCheckedTask = Meteor.server.method_handlers['tasks.setChecked'];
        
        // Set up a fake method invocation that looks like what the method expects
        const invocation = { 'userId': anotheruserId };

        // verify that exception is thrown
        assert.throws(function() {
          
        // Run test **there are some global variables that are local thus pass them*8
        setCheckedTask.apply(invocation, [taskId, true]);
                    
        }, Meteor.Error, /not.authorized/);
        
        // Verify that the method does what we expected
        assert.equal(Tasks.findOne(taskId).checked, false);
        });

       // *******************SETTOPRIVATE****************

      //write test shows that you can setToPrivate task
      it('can setToPrivate task', () => {

        // Find the internal implementation of the task method so we can
        // test it in isolation
        const setToPrivateTask = Meteor.server.method_handlers['tasks.setPrivate'];

        // Set up a fake method invocation that looks like what the method expects
        const invocation = { userId };

        // Run the method with `this` set to the fake invocation
        setToPrivateTask.apply(invocation, [taskId, true]);

        // Verify that the method does what we expected
        assert.equal(Tasks.find(taskId, { $set: { private: true } }).count(), 1);
      });

        // write test shows that you can cannotsetToPrivate task
        it('cannot setToPrivate task', () => {

        //generate id to rep another user
        const anotheruserId = Random.id();
          
        // Find the internal implementation of the task method so we can
        // test it in isolation
        const setToPrivateTask = Meteor.server.method_handlers['tasks.setPrivate'];
          
        // Set up a fake method invocation that looks like what the method expects
        const invocation = { anotheruserId };

        // verify that exception is thrown
        assert.throws(function() {
          
        // Run test **there are some global variables that are local thus pass them*8
        setToPrivateTask.apply(invocation, [taskId, true]);
                    
        }, Meteor.Error, /not.authorized/);
          
        // Verify that the method does what we expected
        assert.equal(Tasks.findOne(taskId).private, false);
        });

    });
  });
}