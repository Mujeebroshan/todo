const Dashboard = {
    template: `
        <div class="dashboard">
            <div class="row mb-4">
                <div class="col">
                    <h1 class="h2">
                        <i class="bi bi-speedometer2 me-2"></i>
                        Dashboard
                    </h1>
                    <p class="text-muted">Overview of your team's task progress</p>
                </div>
            </div>

            <!-- Statistics Cards -->
            <div class="row mb-4">
                <div class="col-md-2 mb-3">
                    <div class="card bg-primary text-white">
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-center">
                                <div>
                                    <h5 class="card-title">Total Tasks</h5>
                                    <h2 class="mb-0">{{ taskStats.total }}</h2>
                                </div>
                                <i class="bi bi-list-task fs-1"></i>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="col-md-2 mb-3">
                    <div class="card bg-warning text-white">
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-center">
                                <div>
                                    <h5 class="card-title">To Do</h5>
                                    <h2 class="mb-0">{{ taskStats.todo }}</h2>
                                </div>
                                <i class="bi bi-clock-history fs-1"></i>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="col-md-2 mb-3">
                    <div class="card bg-info text-white">
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-center">
                                <div>
                                    <h5 class="card-title">In Progress</h5>
                                    <h2 class="mb-0">{{ taskStats.inProgress }}</h2>
                                </div>
                                <i class="bi bi-arrow-clockwise fs-1"></i>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="col-md-2 mb-3">
                    <div class="card bg-success text-white">
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-center">
                                <div>
                                    <h5 class="card-title">Completed</h5>
                                    <h2 class="mb-0">{{ taskStats.completed }}</h2>
                                </div>
                                <i class="bi bi-check-circle fs-1"></i>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="col-md-2 mb-3">
                    <div class="card bg-danger text-white">
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-center">
                                <div>
                                    <h5 class="card-title">High Priority</h5>
                                    <h2 class="mb-0">{{ taskStats.highPriority }}</h2>
                                </div>
                                <i class="bi bi-exclamation-triangle fs-1"></i>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="col-md-2 mb-3">
                    <div class="card bg-dark text-white">
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-center">
                                <div>
                                    <h5 class="card-title">Overdue</h5>
                                    <h2 class="mb-0">{{ taskStats.overdue }}</h2>
                                </div>
                                <i class="bi bi-calendar-x fs-1"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Task Board -->
            <div class="row">
                <div class="col-md-4 mb-4">
                    <div class="card h-100">
                        <div class="card-header bg-warning text-white">
                            <h5 class="mb-0">
                                <i class="bi bi-clock-history me-2"></i>
                                To Do ({{ tasksByStatus.todo.length }})
                            </h5>
                        </div>
                        <div class="card-body task-column">
                            <div v-if="tasksByStatus.todo.length === 0" class="text-center text-muted py-4">
                                <i class="bi bi-inbox fs-1 d-block mb-2"></i>
                                No tasks in this column
                            </div>
                            <task-card
                                v-for="task in tasksByStatus.todo"
                                :key="task.id"
                                :task="task"
                                @update-status="updateTaskStatus"
                                @edit="editTask"
                                @delete="deleteTask"
                                class="mb-2"
                            ></task-card>
                        </div>
                    </div>
                </div>
                
                <div class="col-md-4 mb-4">
                    <div class="card h-100">
                        <div class="card-header bg-info text-white">
                            <h5 class="mb-0">
                                <i class="bi bi-arrow-clockwise me-2"></i>
                                In Progress ({{ tasksByStatus['in-progress'].length }})
                            </h5>
                        </div>
                        <div class="card-body task-column">
                            <div v-if="tasksByStatus['in-progress'].length === 0" class="text-center text-muted py-4">
                                <i class="bi bi-inbox fs-1 d-block mb-2"></i>
                                No tasks in this column
                            </div>
                            <task-card
                                v-for="task in tasksByStatus['in-progress']"
                                :key="task.id"
                                :task="task"
                                @update-status="updateTaskStatus"
                                @edit="editTask"
                                @delete="deleteTask"
                                class="mb-2"
                            ></task-card>
                        </div>
                    </div>
                </div>
                
                <div class="col-md-4 mb-4">
                    <div class="card h-100">
                        <div class="card-header bg-success text-white">
                            <h5 class="mb-0">
                                <i class="bi bi-check-circle me-2"></i>
                                Completed ({{ tasksByStatus.completed.length }})
                            </h5>
                        </div>
                        <div class="card-body task-column">
                            <div v-if="tasksByStatus.completed.length === 0" class="text-center text-muted py-4">
                                <i class="bi bi-inbox fs-1 d-block mb-2"></i>
                                No tasks in this column
                            </div>
                            <task-card
                                v-for="task in tasksByStatus.completed"
                                :key="task.id"
                                :task="task"
                                @update-status="updateTaskStatus"
                                @edit="editTask"
                                @delete="deleteTask"
                                class="mb-2"
                            ></task-card>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Quick Actions -->
            <div class="row mt-4">
                <div class="col">
                    <div class="card">
                        <div class="card-header">
                            <h5 class="mb-0">Quick Actions</h5>
                        </div>
                        <div class="card-body">
                            <div class="d-flex gap-2 flex-wrap">
                                <router-link to="/tasks/new" class="btn btn-primary">
                                    <i class="bi bi-plus-circle me-1"></i>
                                    New Task
                                </router-link>
                                <router-link to="/team/new" class="btn btn-outline-primary">
                                    <i class="bi bi-person-plus me-1"></i>
                                    Add Team Member
                                </router-link>
                                <router-link to="/tasks" class="btn btn-outline-secondary">
                                    <i class="bi bi-list me-1"></i>
                                    View All Tasks
                                </router-link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    
    computed: {
        taskStats() {
            return this.$store.getters.taskStats;
        },
        tasksByStatus() {
            return this.$store.getters.tasksByStatus;
        }
    },
    
    methods: {
        async updateTaskStatus(taskId, newStatus) {
            try {
                await this.$store.dispatch('updateTask', {
                    id: taskId,
                    taskData: { status: newStatus }
                });
            } catch (error) {
                console.error('Failed to update task status:', error);
            }
        },
        
        editTask(task) {
            this.$router.push(`/tasks/${task.id}/edit`);
        },
        
        async deleteTask(taskId) {
            if (confirm('Are you sure you want to delete this task?')) {
                try {
                    await this.$store.dispatch('deleteTask', taskId);
                } catch (error) {
                    console.error('Failed to delete task:', error);
                }
            }
        }
    },
    
    async created() {
        await Promise.all([
            this.$store.dispatch('fetchTasks'),
            this.$store.dispatch('fetchTeamMembers')
        ]);
    }
};
