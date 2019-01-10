//makes mocha know test file
/* eslint-env mocha */
 
import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { assert } from 'chai';
// import { Accounts } from 'meteor/accounts-base';

import { Tasks } from './tasks.js';

//checks is running on the server side
if (Meteor.isServer) {
 describe('Tasks', () => {
   describe('methods', () => {
    const userId = Random.id();
    let taskId;
    const user = 'vivian';
    // let text;
    // Meteor.users.find
    // befor(function()) {
      // userId = user._id
    // }
//befor every test
    beforeEach(() => {
      //remove all tasks
      Tasks.remove({});
      //create task and equate taskId
      taskId = Tasks.insert({
        text: 'test task',
        createdAt: new Date(),
        owner: userId,
        username: 'tmeasday',
      });
    });
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

     //write test shows that you can insert task
     it('can insert owned tasks', () => {
       let text = "text"
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

    //write test shows that you can setChecked task
    it('can setChecked task', () => {
      let setChecked = true

     // Find the internal implementation of the task method so we can
    // test it in isolation
    const setCheckedTask = Meteor.server.method_handlers['tasks.setChecked'];

    // Set up a fake method invocation that looks like what the method expects
    const invocation = { userId };

    // Run the method with `this` set to the fake invocation
    setCheckedTask.apply(invocation, [taskId, setChecked]);

    // Verify that the method does what we expected
    assert.equal(Tasks.find(taskId, { $set: { checked: setChecked } }).count(), 1);
 });

    //write test shows that you can setToPrivate task
    it('can setToPrivate task', () => {
      let setToPrivate = true

     // Find the internal implementation of the task method so we can
    // test it in isolation
    const setToPrivateTask = Meteor.server.method_handlers['tasks.setPrivate'];

    // Set up a fake method invocation that looks like what the method expects
    const invocation = { userId };

    // Run the method with `this` set to the fake invocation
    setToPrivateTask.apply(invocation, [taskId, setToPrivate]);

    // Verify that the method does what we expected
    assert.equal(Tasks.find(taskId, { $set: { private: setToPrivate } }).count(), 1);
 });
 
   });
 });
}
