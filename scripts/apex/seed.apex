// Use .apex files to store anonymous Apex.
// You can execute anonymous Apex in VS Code by selecting the
//     apex text and running the command:
//     SFDX: Execute Anonymous Apex with Currently Selected Text
// You can also execute the entire file by running the command:
//     SFDX: Execute Anonymous Apex with Editor Contents

/* Seed some data */
Id userId = UserInfo.getUserId();

// Lists
List<To_Do_List__c> todoLists = new List<To_Do_List__c>();
todoLists.add(new To_Do_List__c(Name='List1'));
todoLists.add(new To_Do_List__c(Name='List2'));
insert todoLists;

// Tasks
List<To_Do_Task__c> todoTasks = new List<To_Do_Task__c>();
todoTasks.add(new To_Do_Task__c(Name='Task 1', To_Do_List__c=todoLists[0].id, Description__c='Task 1 Description', List_Position__c=0));
todoTasks.add(new To_Do_Task__c(Name='Task 2', To_Do_List__c=todoLists[0].id, Description__c='Task 2 Description', List_Position__c=1));
todoTasks.add(new To_Do_Task__c(Name='Task 3', To_Do_List__c=todoLists[0].id, Description__c='Task 3 Description', List_Position__c=2));
todoTasks.add(new To_Do_Task__c(Name='Task 4', To_Do_List__c=todoLists[1].id, Description__c='Task 4 Description', List_Position__c=0));
insert todoTasks;

// Users To Do Lists
List<User_To_Do_List__c> userLists = new List<User_To_Do_List__c>();
userLists.add(new User_To_Do_List__c(Name='List1 Link', To_Do_List__c=todoLists[0].id, User__c=userId));
userLists.add(new User_To_Do_List__c(Name='List2 Link', To_Do_List__c=todoLists[1].id, User__c=userId));
insert userLists;


/* <2> */
Id userId = UserInfo.getUserId();

List<User_To_Do_List__c> userLists = new List<User_To_Do_List__c>();
To_Do_List__c list2 = [SELECT Id FROM To_Do_List__c WHERE Name = 'List2'];
userLists.add(new User_To_Do_List__c(Name='List2 Link', To_Do_List__c=list2.id, User__c=userId));
insert userLists;

/* DELETE THEM ALL >:D */
List<To_Do_List__c> todoLists = [SELECT Id FROM To_Do_List__c];
List<User_To_Do_List__c> userLists = [SELECT Id FROM User_To_Do_List__c];
delete todoLists;
