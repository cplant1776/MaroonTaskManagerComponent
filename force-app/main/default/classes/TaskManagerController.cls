public with sharing class TaskManagerController {

    @AuraEnabled
    public static List<ToDoListWithTasks> getUserToDoLists(String source)
    {
        Set<Id> userSpecificTodoListIds = getUserSpecificTodoListIds();

        List<To_Do_List__c> todoLists = [SELECT Id, Name,
        (SELECT Id, Name, Description__c FROM To_Do_Tasks__r)
        FROM To_Do_List__c
        WHERE Id IN :userSpecificTodoListIds];

        return wrapToDoLists(todoLists);
    }
    
    private static List<ToDoListWithTasks> wrapToDoLists(List<To_Do_List__c> todoLists)
    {
        List<ToDoListWithTasks> result = new List<ToDoListWithTasks>();

        for (To_Do_List__c eachList : todoLists)
        {
            ToDoListWithTasks todoList = new ToDoListWithTasks();
            todoList.listName = eachList.Name;
            todoList.taskListId = eachList.Id;

            // Add tasks
            List<ToDoTask> todoTasks = new List<ToDoTask>();
            for(To_Do_Task__c eachTask : eachList.To_Do_Tasks__r)
            {
                ToDoTask currentTask = new ToDoTask();
                currentTask.taskId = eachTask.Id;
                currentTask.taskName = eachTask.Name;
                currentTask.description = eachTask.Description__c;
                todoTasks.add(currentTask);
            }
            todoList.taskList = todoTasks;
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

    @AuraEnabled
    public static void moveTodoTask(Id taskId, Id targetListId){

        try{
            System.debug('Try updating task');
            To_Do_Task__c task = [SELECT Id, To_Do_List__c FROM To_Do_Task__c
            WHERE Id = :taskId LIMIT 1];
    
            task.To_Do_List__c = targetListId;
            upsert task;
        } catch (Exception e)
        {
            System.debug('Failed updating task: ' + e.getMessage());
            throw new AuraHandledException(e.getMessage());
        }
    }
}
