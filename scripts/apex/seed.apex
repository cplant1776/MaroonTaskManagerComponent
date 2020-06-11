// Use .apex files to store anonymous Apex.
// You can execute anonymous Apex in VS Code by selecting the
//     apex text and running the command:
//     SFDX: Execute Anonymous Apex with Currently Selected Text
// You can also execute the entire file by running the command:
//     SFDX: Execute Anonymous Apex with Editor Contents

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
User_To_Do_List__c userList = new User_To_Do_List__c(Name='List1 Link', To_Do_List__c=todoLists[0].id, User__c=userId);
insert userList;