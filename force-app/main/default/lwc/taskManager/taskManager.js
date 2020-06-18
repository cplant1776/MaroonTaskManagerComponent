import { LightningElement, track } from 'lwc';
import getUserToDoLists from '@salesforce/apex/TaskManagerController.getUserToDoLists';
import moveTodoTask from '@salesforce/apex/TaskManagerController.moveTodoTask';
import deleteTodoTask from '@salesforce/apex/TaskManagerController.deleteTodoTask';
import deleteTodoList from '@salesforce/apex/TaskManagerController.deleteTodoList';

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
        let droppedPositionId = event.detail;
        console.log('taskManager :: handleItemDrop');        
        console.log('dragging task: ' + this.draggingTask.taskId + ' | dropped position Id: ' + droppedPositionId);
        
        // Update local view
        let updatedTaskLists = this.taskLists;
        let targetPosition = this.moveTaskPosition(this.taskLists, this.draggingTask, droppedPositionId)

        // Update positions in database
        moveTodoTask({movedTaskId: this.draggingTask.taskId, targetListId: targetPosition.taskListId,
            targetPosition: targetPosition.index}).then(result => {
            console.log('Successfully moved task.');
            console.log(result);
        }).catch(error => {
            console.log('Error moving task!');
            console.log(error);
        });

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
        console.log('newTask:');
        console.log(newTask);
        

        // Add dropped task to target task list
        let updatedTaskLists = this.addDroppedTaskToTargetList(this.taskLists, targetListId, newTask);
        // Update local task lists
        this.taskLists = updatedTaskLists;
    }

    handleModalSubmit(event)
    {
        console.log('taskManager :: handleModalSubmit');
        let listFields = JSON.parse(JSON.stringify(event.detail.fields));
        
        let currentList = {
            listName: listFields.Name.value,
            taskListId: event.detail.id,
            taskList: []
        }

        console.log('new list:');
        console.log(currentList);
        let updatedTaskLists = this.taskLists;
        

        if(this.listModalMode === 'create')
        {
            console.log('mode = create');
            updatedTaskLists.push(currentList);

        } else if(this.listModalMode === 'edit')
        {
            this.updateTargetList(this.taskLists, currentList);
        }

        this.taskLists = updatedTaskLists;
        console.log(this.taskLists);
        
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

    handleDeleteTask(event)
    {
        console.log('taskManager :: handleDeleteTask');
        let originListId = event.detail.taskListId;
        let deletedTaskId = event.detail.taskId;
        
        // Delete task in database
        deleteTodoTask({taskId: deletedTaskId}).then(result => {
            console.log('Successfully deleted task.');
            console.log(result);
        }).catch(error => {
            console.log('Error deleting task!');
            console.log(error);
        });

        // Delete from local view
        let updatedTaskLists = JSON.parse(JSON.stringify(this.taskLists));
        updatedTaskLists = this.filterOutTargetTask(updatedTaskLists, deletedTaskId);
        this.taskLists = updatedTaskLists;
    }
    
    handleDeleteList(event)
    {
        console.log('taskManager :: handleDeleteList');

        let deletedListId = event.detail;
        console.log('detail:');
        console.log(deletedListId);

        // Delete list in database
        deleteTodoList({taskListId: deletedListId}).then(result => {
            console.log('Successfully deleted list.');
            console.log(result);
        }).catch(error => {
            console.log('Error deleting list!');
            console.log(error);
        });

        // Delete from local view
        let updatedTaskLists = JSON.parse(JSON.stringify(this.taskLists));
        console.log('updatedTaskLists');
        console.log(updatedTaskLists);
        
        updatedTaskLists = this.filterOutTargetTaskList(updatedTaskLists, deletedListId);
        this.taskLists = updatedTaskLists;
    }

    filterOutTargetTask(taskLists, droppedTaskId)
    {
        // Remove dropped task from its current task list
        let result = taskLists.map(list => {
            // Filter out task if present in list
            list.taskList = list.taskList.filter(task => {
                return task.taskId == droppedTaskId ? false : true;         
            });
            return list;
        });

        return result;
    }

    filterOutTargetTaskList(taskLists, droppedTaskListId)
    {
        let result = taskLists.filter(list => {
            return list.taskListId === droppedTaskListId ? false : true;
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

    addTaskToTargetPosition(taskLists, taskToMove, targetPosition)
    {
        taskLists.some(list => {
            if(list.taskListId === targetPosition.taskListId)
            {
                console.log('attempting move');
                
                list.taskList.splice(targetPosition.index, 0, taskToMove);
                return true;
            }
        });
    }

    moveTaskPosition(taskLists, taskToMove, targetPositionId)
    {
        // Find position to move task to
        let targetPosition = this.findListPositionByTaskId(taskLists, targetPositionId);
        
        // Remove task from original location
        this.filterOutTargetTask(taskLists, taskToMove.taskId);

        // Add task to new location
        this.addTaskToTargetPosition(taskLists, taskToMove, targetPosition);

        return targetPosition;
    }

    resetModalParams()
    {
        this.listModalMode = null;
        this.selectedList = null;
        this.openModal = false;
    }

    findListPositionByTaskId(taskLists, targetTaskId)
    {
        // Find position to move task to
        for(let i=0; i < taskLists.length; i++)
        {
            for(let j=0; j < taskLists[i].taskList.length; j++)
            {
                if(taskLists[i].taskList[j].taskId == targetTaskId)
                {
                    var targetPosition = {
                        taskListId: taskLists[i].taskListId,
                        index: j
                    };

                    return targetPosition;
                }
            }
        }
    }
}