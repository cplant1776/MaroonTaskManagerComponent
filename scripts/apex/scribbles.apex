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
System.debug(userTodoListsWithIds);
System.debug(userTodoListIds);
System.debug(todoLists);

List<TaskManagerController.ToDoListWithTasks> result = new List<TaskManagerController.ToDoListWithTasks>();
for (To_Do_List__c eachList : todoLists)
        {
            System.debug('Inside loop');
            TaskManagerController.ToDoListWithTasks todoList = new TaskManagerController.ToDoListWithTasks();
            todoList.listName = eachList.Name;
            todoList.listTasks = eachList.To_Do_Tasks__r;
            result.add(todoList);
        }
System.debug(result);