import { LightningElement, track } from 'lwc';
import getUserToDoLists from '@salesforce/apex/TaskManagerController.getUserToDoLists';
import moveTodoTask from '@salesforce/apex/TaskManagerController.moveTodoTask';

export default class TaskManager extends LightningElement {
    @track taskLists = [];
    @track openModal=false;

    draggingTask;
    listModalMode;
    selectedList;

    listModalObjectApiName='To_Do_List__c';

    connectedCallback()
    {
        this.fetchUserTodoLists();
        console.log(this.taskLists);
    }

    fetchUserTodoLists()
    {
        getUserToDoLists({source: 'placeholder'}).then(result => {
            if(result)
            {
                console.log("Size retrieved from server: ", result.length);
                console.log(result);
                
                this.taskLists = result;
            }
        }).catch(error => {
            console.log("Error fetching user todo lists!");
            console.log(error);
        });
    }

    handleItemDrop(event)
    {
        let targetListId = event.detail;
        let droppedTask = this.draggingTask;
        console.log('taskManager :: handleItemDrop => ' +  targetListId);
        
        // Update task list in database
        moveTodoTask({taskId: droppedTask.taskId, targetListId: targetListId}).then(result => {
            console.log('Successfully moved task.');
            console.log(result);
        }).catch(error => {
            console.log('Error moving task!');
            console.log(error);
        });

        // Remove dropped task from its current task list
        let updatedTaskLists = this.filterOutTargetTask(this.taskLists, droppedTask);
        // Add dropped task to target task list
        updatedTaskLists = this.addDroppedTaskToTargetList(updatedTaskLists, targetListId, droppedTask);
        // Update local task lists
        this.taskLists = updatedTaskLists;
        
    }

    handleListItemDrag(event)
    {        
        console.log('taskManager :: handle list item drag ' + event.detail.taskId);
        this.draggingTask = event.detail;
    }

    handleSubmitModal(event)
    {
        console.log('taskManager :: handleSubmitModal');
        // console.log(event.detail);
        let taskFields = event.detail;

        let updatedTaskLists = JSON.parse(JSON.stringify(this.taskLists));
        updatedTaskLists = this.updateTargetTask(updatedTaskLists, taskFields);
        
        this.taskLists = updatedTaskLists;
    }

    handleCreateTask(event)
    {
        console.log('taskManager :: handleCreateTask');
        let newTaskFields = event.detail.fields;

        let targetListId = newTaskFields.To_Do_List__c.value;
        let newTask = {
            taskId: event.detail.id,
            taskName: newTaskFields.Name.value,
            description: newTaskFields.Description__c.value,
        }

        // Add dropped task to target task list
        let updatedTaskLists = this.addDroppedTaskToTargetList(this.taskLists, targetListId, newTask);
        // Update local task lists
        this.taskLists = updatedTaskLists;
    }

    handleModalSubmit(event)
    {
        let listFields = JSON.parse(JSON.stringify(event.detail.fields));
        console.log(listFields);
        
        let currentList = {
            listName: listFields.Name.value,
            listId: listFields.id,
            taskList: []
        }

        console.log('currentList:');
        console.log(currentList);
        

        if(this.listModalMode === 'create')
        {
            console.log('mode is create');
            this.taskLists.push(currentList);

        } else if(this.listModalMode === 'edit')
        {
            this.updateTargetList(this.taskLists, currentList);
        }

        this.resetModalParams();
    }

    handleCreateListModal()
    {
        console.log('taskManager :: handleCreateListModal');

        this.listModalMode = 'create';
        this.selectedList = null;
        this.openModal = true;
    }

    handleCloseListModal(event)
    {
        console.log('taskManager :: handleCloseListModal');

        this.resetModalParams()
    }

    filterOutTargetTask(taskLists, droppedTask)
    {
        // Remove dropped task from its current task list
        let result = taskLists.map(list => {
            // Filter out task if present in list
            list.taskList = list.taskList.filter(task => {
                return task.taskId == droppedTask.taskId ? false : true;         
            });
            return list;
        });

        return result;
    }

    addDroppedTaskToTargetList(taskLists, targetListId, droppedTask)
    {
        let result = taskLists;
        result.some(list => {
            if(list.taskListId == targetListId)
            {
                list.taskList.push(droppedTask);
                return true;
            }
        });

        return result;
    }

    updateTargetTask(taskLists, taskFields)
    {
        let result = taskLists;

        result.some(list => {
            // Find updated task's list
            if(list.taskListId === taskFields.taskListId)
            {
                // Find and update task
                list.taskList.some(task => {
                    if(task.taskId == taskFields.taskId)
                    {
                        task.taskName = taskFields.Name;
                        task.description = taskFields.Description__c;
                        console.log('Updated task: ' + task.taskId);
                        return true;
                    }
                });
                return true;
            }
        });

        return result;
    }

    updateTargetList(taskLists, currentList)
    {
        taskLists.some(list => {
            if(list.listId === currentList.id)
            {
                list.listName = currentList.listname;
            }
            return true;
        });
    }

    resetModalParams()
    {
        this.listModalMode = null;
        this.selectedList = null;
        this.openModal = false;
    }
}