public with sharing class TaskManagerController {

    @AuraEnabled
    public static List<ToDoListWithTasks> getUserToDoLists(String source)
    {
        Set<Id> userSpecificTodoListIds = getUserSpecificTodoListIds();

        List<To_Do_List__c> todoLists = [SELECT Id, Name,
        (SELECT Id, Name, Description__c FROM To_Do_Tasks__r
        ORDER BY List_Position__c)
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
    public static void deleteTodoTask(Id taskId){
        try{
            System.Database.delete(taskId);
        } catch (Exception e) {
            System.debug('Failed deleting task: ' + e.getMessage());
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static void deleteTodoList(Id taskListId){
        try{
            System.Database.delete(taskListId);
        } catch (Exception e) {
            System.debug('Failed deleting task list: ' + e.getMessage());
            throw new AuraHandledException(e.getMessage());
        } 
    }

    @AuraEnabled
    public static void moveTodoTask(Id movedTaskId, Id targetListId, Integer targetPosition){

        try{
            System.debug('Try shifting tasks');
            shiftExistingTasks(targetListId, targetPosition);

            System.debug('Try updating task:' + movedTaskId);
            moveTaskToList(movedTaskId, targetListId, targetPosition);

        } catch (Exception e)
        {
            System.debug('Failed updating task: ' + e.getMessage());
            throw new AuraHandledException(e.getMessage());
        }
    }

    private static void shiftExistingTasks(Id targetListId, Integer insertedPosition)
    {
        // Grab tasks listed after inserted task
        List<To_Do_Task__c> tasksToShift = [SELECT Id, List_Position__c FROM To_Do_Task__c
                                            WHERE To_Do_List__c = :targetListId
                                            AND List_Position__c >= :insertedPosition];
        for(To_Do_Task__c eachTask : tasksToShift)
        {
            eachTask.List_Position__c += 1;
        }

        update tasksToShift;
    }

    private static void moveTaskToList(Id movedTaskId, Id targetListId, Integer targetPosition)
    {
        To_Do_Task__c task = [SELECT Id, To_Do_List__c FROM To_Do_Task__c
            WHERE Id = :movedTaskId LIMIT 1];
    
        task.To_Do_List__c = targetListId;
        task.List_Position__c = targetPosition;
        upsert task;
    }
}
