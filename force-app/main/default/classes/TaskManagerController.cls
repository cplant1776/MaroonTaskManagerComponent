public with sharing class TaskManagerController {

    @AuraEnabled
    public static List<ToDoListWithTasks> getUserToDoLists()
    {
        Set<Id> userSpecificTodoListIds = getUserSpecificTodoListIds();

        List<To_Do_List__c> todoLists = [SELECT Id, Name,
        (SELECT Id, Name FROM To_Do_Tasks__r)
        FROM To_Do_List__c
        WHERE Id IN :userSpecificTodoListIds];

        return wrapToDoLists(todoLists);
    }
    
    @AuraEnabled
    public static List<ToDoListWithTasks> wrapToDoLists(List<To_Do_List__c> todoLists)
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

    private static Set<Id> getUserSpecificTodoListIds()
    {
        // Declarations
        Set<Id> result = new Set<Id>();
        Id userId = UserInfo.getUserId();

        // Get To Do Lists associated w/ logged in user
        List<User_To_Do_List__c> userTodoListsWithIds = [SELECT Id, To_Do_List__r.Id 
        FROM User_To_Do_List__c 
        WHERE User__c = :userId];

        // Extract Id for each To Do List
        for(User_To_Do_List__c eachUserTodoList : userTodoListsWithIds)
        {
            result.add(eachUserTodoList.To_Do_List__r.Id);
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
