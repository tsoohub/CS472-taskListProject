var increase = true;
$(document).ready(function(){
    $("#dueDateSort").click(function(){
        tasksController.loadTasks("Due", increase);
        increase = !increase;
    });
    $("#prioritySort").click(function(){
        tasksController.loadTasks("Priority", increase);
        increase = !increase;
    });
});
