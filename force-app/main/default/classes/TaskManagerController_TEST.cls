@isTest
public with sharing class TaskManagerController_TEST {

    private static Integer NUM_OF_TASKS_LIST_1 = 3;
    private static Integer NUM_OF_TASKS_LIST_2 = 1;
    
    @testSetup
    static void makeData()
    {
        Id userId = UserInfo.getUserId();

        // Lists
        List<To_Do_List__c> todoLists = new List<To_Do_List__c>();
        todoLists.add(new To_Do_List__c(Name='List1'));
        todoLists.add(new To_Do_List__c(Name='List2'));
        insert todoLists;

        // Tasks
        List<To_Do_Task__c> todoTasks = new List<To_Do_Task__c>();
        todoTasks.add(new To_Do_Task__c(Name='Task 1', To_Do_List__c=todoLists[0].id, List_Position__c=0));
        todoTasks.add(new To_Do_Task__c(Name='Task 2', To_Do_List__c=todoLists[0].id, List_Position__c=1));
        todoTasks.add(new To_Do_Task__c(Name='Task 3', To_Do_List__c=todoLists[0].id, List_Position__c=2));
        todoTasks.add(new To_Do_Task__c(Name='Task 4', To_Do_List__c=todoLists[1].id, List_Position__c=0));
        insert todoTasks;

        // Users To Do Lists
        List<User_To_Do_List__c> userLists = new List<User_To_Do_List__c>();
        userLists.add(new User_To_Do_List__c(Name='List1 Link', To_Do_List__c=todoLists[0].id, User__c=userId));
        userLists.add(new User_To_Do_List__c(Name='List2 Link', To_Do_List__c=todoLists[1].id, User__c=userId));
        insert userLists;
    }

    @isTest
    static void doesGetUserToDoListsReturnCorrectLists()
    {
        List<ToDoListWithTasks> todoLists = TaskManagerController.getUserToDoLists('placeholder');
        System.debug(todoLists);
        System.assertEquals(NUM_OF_TASKS_LIST_1, todoLists[0].taskList.size());
        System.assertEquals(NUM_OF_TASKS_LIST_2, todoLists[1].taskList.size());
    }

    @isTest
    static void doesDeleteTodoTaskRemoveTask()
    {
        To_Do_Task__c taskToDelete = [SELECT Id FROM To_Do_Task__c WHERE Name = 'Task 1'];
        To_Do_List__c taksList = [SELECT Id FROM To_Do_List__c WHERE Name = 'List1'];

        Test.startTest();
        TaskManagerController.deleteTodoTask(taskToDelete.Id);
        Test.stopTest();

        To_Do_List__c updatedTaskList = [SELECT Id, (SELECT Id FROM To_Do_Tasks__r) FROM To_Do_List__c WHERE Name = 'List1'];

        System.assertEquals(NUM_OF_TASKS_LIST_1 - 1, updatedTaskList.To_Do_Tasks__r.size());
    }

    @isTest
    static void doesDeleteTodoListRemoveList()
    {
        To_Do_List__c listToDelete = [SELECT Id FROM To_Do_List__c WHERE Name = 'List1'];
        Integer listCountBeforeDelete = [SELECT Count() FROM To_Do_List__c];
        Integer taskCountBeforeDelete = [SELECT Count() FROM To_DO_Task__c];

        Test.startTest();
        TaskManagerController.deleteTodoList(listToDelete.Id);
        Test.stopTest();

        Integer listCountAfterDelete = [SELECT Count() FROM To_Do_List__c];
        Integer taskCountAfterDelete = [SELECT Count() FROM To_DO_Task__c];

        // Was list removed?
        System.assertEquals(listCountBeforeDelete - 1, listCountAfterDelete);
        // Were associated tasks removed?
        System.assertEquals(taskCountBeforeDelete - NUM_OF_TASKS_LIST_1, taskCountAfterDelete);
    }

    @isTest
    static void doesMoveTodoTaskUpdateTodoLists()
    {
        To_Do_List__c originList = [SELECT Id FROM To_Do_List__c WHERE Name = 'List2'];
        To_Do_List__c targetList = [SELECT Id FROM To_Do_List__c WHERE Name = 'List1'];
        To_Do_Task__c movedTask = [SELECT Id FROM To_Do_Task__c WHERE Name = 'Task 4'];
        To_Do_Task__c originalTaskBeforeMove = [SELECT Id FROM To_Do_Task__c WHERE List_Position__c = 1];

        Test.startTest();
        // Move task from list 2 to list 1 as 2nd item in list
        TaskManagerController.moveTodoTask(movedTask.Id, targetList.Id, 1);
        Test.stopTest();

        // Grab values to test
        originList = [SELECT Id, (SELECT Id FROM To_Do_Tasks__r) FROM To_Do_List__c WHERE Name = 'List2'];
        targetList = [SELECT Id, (SELECT Id FROM To_Do_Tasks__r) FROM To_Do_List__c WHERE Name = 'List1'];
        movedTask = [SELECT Id, List_Position__c FROM To_Do_Task__c WHERE Name = 'Task 4'];
        To_Do_Task__c originalTaskAfterMove = [SELECT Id FROM To_Do_Task__c WHERE List_Position__c = 2];

        // Was a task removed from list 2 and added to list 1?
        System.assertEquals(NUM_OF_TASKS_LIST_2 - 1, originList.To_Do_Tasks__r.size());
        System.assertEquals(NUM_OF_TASKS_LIST_1 + 1, targetList.To_Do_Tasks__r.size());

        // Was moved task inserted at correct position?
        System.assertEquals(1, movedTask.List_Position__c);

        // Was task originally in position 1 moved to position 2?
        System.assertEquals(originalTaskBeforeMove.Id, originalTaskAfterMove.Id);
    }
}
