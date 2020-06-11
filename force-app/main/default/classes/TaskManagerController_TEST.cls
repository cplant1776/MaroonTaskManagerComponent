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
        todoTasks.add(new To_Do_Task__c(Name='Task 1', To_Do_List__c=todoLists[0].id));
        todoTasks.add(new To_Do_Task__c(Name='Task 2', To_Do_List__c=todoLists[0].id));
        todoTasks.add(new To_Do_Task__c(Name='Task 3', To_Do_List__c=todoLists[0].id));
        todoTasks.add(new To_Do_Task__c(Name='Task 4', To_Do_List__c=todoLists[1].id));
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
        List<TaskManagerController.ToDoListWithTasks> todoLists = TaskManagerController.getUserToDoLists();
        System.debug(todoLists);
        System.assertEquals(NUM_OF_TASKS_LIST_1, todoLists[0].listTasks.size());
        System.assertEquals(NUM_OF_TASKS_LIST_2, todoLists[1].listTasks.size());
    }
}
