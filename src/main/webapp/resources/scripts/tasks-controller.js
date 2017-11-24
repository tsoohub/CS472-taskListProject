tasksController = function() { 
	
	function errorLogger(errorCode, errorMessage) {
		console.log(errorCode +':'+ errorMessage);
	}
	
	var taskPage;
	var initialised = false;

    /**
	 * makes json call to server to get task list.
	 * currently just testing this and writing return value out to console
	 * 111917kl
     */

	function retrieveTasksServer() {

		const user = $('#userfilter').val();
        console.log('user: '+user);

        $.ajax("TaskServlet", {
            "type": "get",
			dataType: "json",
            "data": {
                "user": user,
            }
        }).done(displayTasksServer.bind());
    }

    function retrieveUsersServer() {

		$.ajax("TaskServlet", {
			"type": "get",
			dataType: "json",
            "data": {"reqtype" : "usercombo"},
		}).done(displayUserServer.bind());
    }

    function retrieveTeamsServer() {
        $.ajax("TaskServlet", {
            "type": "get",
            dataType: "json",
            "data": {"reqtype" : "team"},
        }).done(displayTeamServer.bind());
    }

    function saveTaskServer(name, due, category, userid, priority, team) {

        $.ajax("TaskServlet", {
            "type": "post",
            "data": {
            	"type" : "add",
				"name" : name,
				"due" : due,
				"category" : category,
				"userid" : userid,
				"priority" : priority,
				"team" : team,
			},
        }).done(displayAddUser);
    }

    /**
	 * 111917kl
	 * callback for retrieveTasksServer
     * @param data
     */
    function displayTasksServer(data) { //this needs to be bound to the tasksController -- used bind in retrieveTasksServer 111917kl
    	console.log(data);

        tasksController.loadServerTasks(data);
    }

    function displayUserServer(data) { //this needs to be bound to the tasksController -- used bind in retrieveTasksServer 111917kl
        console.log(data);

        tasksController.loadServerUsers(data);
    }


    function displayTeamServer(data) {
        console.log(data);

        tasksController.loadServerTeams(data);
	}

    function displayAddUser(data) { //this needs to be bound to the tasksController -- used bind in retrieveTasksServer 111917kl
        console.log(data);
    }
	
	function taskCountChanged() {
		var count = $(taskPage).find( '#tblTasks tbody tr').length;
		$('footer').find('#taskCount').text(count);
	}
	
	function clearTask() {
		$(taskPage).find('form').fromObject({});
	}
	
	function renderTable() {
		$.each($(taskPage).find('#tblTasks tbody tr'), function(idx, row) {
			var due = Date.parse($(row).find('[datetime]').text());
			if (due.compareTo(Date.today()) < 0) {
				$(row).addClass("overdue");
			} else if (due.compareTo((2).days().fromNow()) <= 0) {
				$(row).addClass("warning");
			}
		});
	}
	
	return {
		init : function(page, callback) { 
			if (initialised) {
				callback()
			} else {
				taskPage = page;

				storageEngine.init(function() {
					storageEngine.initObjectStore('task', function() {
						callback();
					}, errorLogger) 
				}, errorLogger);	 				
				$(taskPage).find('[required="required"]').prev('label').append( '<span>*</span>').children( 'span').addClass('required');
				$(taskPage).find('tbody tr:even').addClass('even');
				
				$(taskPage).find('#btnAddTask').click(function(evt) {
					evt.preventDefault();
					$(taskPage).find('#taskCreation').removeClass('not');

                    retrieveUsersServer();
                    retrieveTeamsServer();
				});

                /**	 * 11/19/17kl        */
                $(taskPage).find('#btnRetrieveTasks').click(function(evt) {
                    evt.preventDefault();
                    console.log('making ajax call');
                    retrieveTasksServer();
                });
				
				$(taskPage).find('#tblTasks tbody').on('click', 'tr', function(evt) {
					$(evt.target).closest('td').siblings().andSelf().toggleClass('rowHighlight');
				});	
				
				$(taskPage).find('#tblTasks tbody').on('click', '.deleteRow', 
					function(evt) { 					
						storageEngine.delete('task', $(evt.target).data().taskId, 
							function() {
								$(evt.target).parents('tr').remove(); 
								taskCountChanged();

							}, errorLogger);
						
					}
				);
				
				$(taskPage).find('#tblTasks tbody').on('click', '.editRow', 
					function(evt) { 
						$(taskPage).find('#taskCreation').removeClass('not');
						storageEngine.findById('task', $(evt.target).data().taskId, function(task) {
							$(taskPage).find('form').fromObject(task);
						}, errorLogger);
					}
				);
				
				$(taskPage).find('#clearTask').click(function(evt) {
					evt.preventDefault();
					clearTask();
				});
				
				$(taskPage).find('#tblTasks tbody').on('click', '.completeRow', function(evt) { 					
					storageEngine.findById('task', $(evt.target).data().taskId, function(task) {
						task.complete = true;
						storageEngine.save('task', task, function() {
							tasksController.loadTasks("Due", true);
						},errorLogger);
					}, errorLogger);
				});
				
				$(taskPage).find('#saveTask').click(function(evt) {
                    evt.preventDefault();
                    if ($(taskPage).find('form').valid()) {
                        var task = $(taskPage).find('form').toObject();
                        //Save to localStorage
                        storageEngine.save('task', task, function() {
                            console.log("save success");
                            $(taskPage).find('#tblTasks tbody').empty();
                            tasksController.loadTasks();
                            clearTask();
                            $(taskPage).find('#taskCreation').addClass('not');
                            console.log("end function");
                        }, errorLogger);
                        // Save to Server side
                        saveTaskServer(task.task, task.requiredBy, task.category, task.username, task.priority, task.team);

                    }
                });
				initialised = true;
			}
		},
        /**
		 * 111917kl
		 * modification of the loadTasks method to load tasks retrieved from the server
         */
		loadServerTasks: function(tasks) {
            storageEngine.initializedObjectStores = {};
            $(taskPage).find('#tblTasks tbody').empty();

            $.each(tasks, function (index, task) {
                if (!task.complete) {
                    task.complete = false;
                }
                $('#taskRow').tmpl(task).appendTo($(taskPage).find('#tblTasks tbody'));
                taskCountChanged();
				storageEngine.save('task', task, function(){}, errorLogger);
            });
		},
        loadServerUsers: function(tasks) {
            $(taskPage).find('#users').empty();
            $.each(tasks, function (index, task) {
                $('#userOption').tmpl(task).appendTo($(taskPage).find('#users'));
            });
        },
        loadServerTeams: function(tasks) {
            $(taskPage).find('#team').empty();
            $.each(tasks, function (index, task) {
                $('#teamOption').tmpl(task).appendTo($(taskPage).find('#team'));
            });
        },
        loadInitialUsers: function() {
            $.ajax("TaskServlet", {
                "type": "get",
                dataType: "json",
                data: {
                    "reqtype" : "usercombo",
                }
            }).done(function (data) {
                $('#userfilter').append('<option></option>');
                $.each(data, function (index, task) {
                    $('#userOption').tmpl(task).appendTo($(taskPage).find('#userfilter'));
                });
            });
        },
		loadTasks : function(filterField, increase) {
			$(taskPage).find('#tblTasks tbody').empty();
			storageEngine.findAll('task', function(tasks) {
				tasks.sort(function(o1, o2) {
					if(filterField ==="Due"){
						if(increase === true)
                        	return Date.parse(o1.requiredBy).compareTo(Date.parse(o2.requiredBy));
						else
                            return Date.parse(o2.requiredBy).compareTo(Date.parse(o1.requiredBy));
					} else if(filterField ==="Priority"){
						if(increase === true)
                        	return (o1.priority) < (o2.priority);
						else
                            return (o2.priority) < (o1.priority);
					} else if(filterField ==="User"){
                        if(increase === true)
                            return (o1.username) < (o2.username);
                        else
                            return (o2.username) < (o1.username);
                    }
				});

				$.each(tasks, function(index, task) {
					if (!task.complete) {
						task.complete = false;
					}
					$('#taskRow').tmpl(task).appendTo($(taskPage).find('#tblTasks tbody'));
					taskCountChanged();
					//renderTable();
				});
			}, errorLogger);
		} 
	} 
}();
