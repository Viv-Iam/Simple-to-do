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
   });
 });
}
