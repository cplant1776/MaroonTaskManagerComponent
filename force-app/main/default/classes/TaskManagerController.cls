public with sharing class TaskManagerController {

    @AuraEnabled
    public static List<ToDoListWithTasks> getAllToDoLists()
    {
        Id userId = UserInfo.getUserId();
        List<User_To_Do_List__c> userTodoListsWithIds = [SELECT Id, To_Do_List__r.Id FROM User_To_Do_List__c WHERE User__c = :userId];
        Set<Id> userTodoListIds = new Set<Id>();
        for(User_To_Do_List__c eachUserTodoList : userTodoListsWithIds)
        {
            userTodoListIds.add(eachUserTodoList.To_Do_List__r.Id);
        }

        List<To_Do_List__c> todoLists = [SELECT Id, Name,
        (SELECT Id, Name FROM To_Do_Tasks__r)
        FROM To_Do_List__c
        WHERE Id IN :userTodoListIds];

        return getToDoLists(todoLists);
    }
    
    @AuraEnabled
    public static List<ToDoListWithTasks> getToDoLists(List<To_Do_List__c> todoLists)
    {
        List<ToDoListWithTasks> result = new List<ToDoListWithTasks>();
        for (To_Do_List__c eachList : todoLists)
        {
            ToDoListWithTasks todoList = new ToDoListWithTasks();
            todoList.listName = eachList.Name;
            todoList.listTasks = eachList.To_Do_Tasks__r;
            result.add(todoList);
        }

        return result;
    }

    //Wrapper class for returning TDLists with associated TDTasks
    public class ToDoListWithTasks
    {
        @AuraEnabled
        public String listName;
        @AuraEnabled
        public List<To_Do_Task__c> listTasks;
    }
}
