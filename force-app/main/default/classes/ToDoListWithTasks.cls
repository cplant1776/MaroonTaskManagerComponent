//Wrapper class for returning TDLists with associated TDTasks
public class ToDoListWithTasks
{
    @AuraEnabled
    public String listName;
    @AuraEnabled
    public String taskListId;
    @AuraEnabled
    public List<ToDoTask> taskList;
}
