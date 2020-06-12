import { LightningElement, track } from 'lwc';
import getUserToDoLists from '@salesforce/apex/TaskManagerController.getUserToDoLists';
import moveTodoTask from '@salesforce/apex/TaskManagerController.moveTodoTask';

export default class TaskManager extends LightningElement {
    @track taskLists = [];
    draggingTask;

    connectedCallback()
    {
        this.fetchUserTodoLists();
        console.log(this.taskLists);
    }
    
    handleMoveTask(event)
    {
        console.log('Caught in taskManager');
        console.log('Event detail: ' + event.detail);

        const targetListId = 'a000R00000341ttQAA';
        moveTodoTask({taskId: event.detail, targetListId: targetListId}).then(result => {
            console.log('Successfully moved task.');
            console.log(result);
        }).catch(error => {
            console.log('Error moving task!');
            console.log(error);
        });
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

        // Remove dropped task from its current task list
        let updatedTaskLists = this.filterOutTargetTask(this.taskLists, droppedTask);
        // Add dropped task to target task list
        updatedTaskLists = this.addDroppedTaskToTargetList(updatedTaskLists, targetListId, droppedTask);
        // Update local task lists
        this.taskLists = updatedTaskLists;
        
        
        // Update task list in database
        moveTodoTask({taskId: droppedTask.taskId, targetListId: targetListId}).then(result => {
            console.log('Successfully moved task.');
            console.log(result);
        }).catch(error => {
            console.log('Error moving task!');
            console.log(error);
        });
        
    }

    handleListItemDrag(event)
    {        
        console.log('taskManager :: handle list item drag ' + event.detail.taskId);
        this.draggingTask = event.detail;
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
}