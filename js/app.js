const { createApp } = Vue;
const { createRouter, createWebHashHistory } = VueRouter;

// Tasks List Component
const TasksList = {
    template: `
        <div class="tasks-list">
            <div class="row mb-4">
                <div class="col">
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <h1 class="h2">
                                <i class="bi bi-list-task me-2"></i>
                                Tasks
                            </h1>
                            <p class="text-muted">Manage and track your team's tasks</p>
                        </div>
                        <router-link to="/tasks/new" class="btn btn-primary">
                            <i class="bi bi-plus-circle me-2"></i>
                            New Task
                        </router-link>
                    </div>
                </div>
            </div>

            <!-- Filters and Search -->
            <div class="card mb-4">
                <div class="card-body">
                    <div class="row g-3">
                        <div class="col-md-3">
                            <label class="form-label">Status</label>
                            <select v-model="filters.status" @change="updateFilters" class="form-select">
                                <option value="">All Statuses</option>
                                <option value="todo">To Do</option>
                                <option value="in-progress">In Progress</option>
                                <option value="completed">Completed</option>
                            </select>
                        </div>
                        <div class="col-md-3">
                            <label class="form-label">Assignee</label>
                            <select v-model="filters.assignee" @change="updateFilters" class="form-select">
                                <option value="">All Assignees</option>
                                <option value="">Unassigned</option>
                                <option v-for="member in teamMembers" :key="member.id" :value="member.id">
                                    {{ member.name }}
                                </option>
                            </select>
                        </div>
                        <div class="col-md-3">
                            <label class="form-label">Priority</label>
                            <select v-model="filters.priority" @change="updateFilters" class="form-select">
                                <option value="">All Priorities</option>
                                <option value="high">High</option>
                                <option value="medium">Medium</option>
                                <option value="low">Low</option>
                            </select>
                        </div>
                        <div class="col-md-3">
                            <label class="form-label">Sort By</label>
                            <select v-model="sortBy" @change="updateSort" class="form-select">
                                <option value="createdAt">Created Date</option>
                                <option value="updatedAt">Updated Date</option>
                                <option value="dueDate">Due Date</option>
                                <option value="priority">Priority</option>
                                <option value="title">Title</option>
                            </select>
                        </div>
                    </div>
                    <div class="row mt-3">
                        <div class="col-auto">
                            <button @click="clearFilters" class="btn btn-outline-secondary btn-sm">
                                <i class="bi bi-x-circle me-1"></i>
                                Clear Filters
                            </button>
                        </div>
                        <div class="col-auto">
                            <button @click="toggleSortOrder" class="btn btn-outline-secondary btn-sm">
                                <i class="bi" :class="sortOrder === 'asc' ? 'bi-sort-up' : 'bi-sort-down'"></i>
                                {{ sortOrder === 'asc' ? 'Ascending' : 'Descending' }}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Tasks Display -->
            <div v-if="filteredTasks.length === 0" class="text-center py-5">
                <i class="bi bi-inbox fs-1 text-muted d-block mb-3"></i>
                <h4 class="text-muted">No tasks found</h4>
                <p class="text-muted">{{ hasFilters ? 'Try adjusting your filters' : 'Create your first task to get started' }}</p>
                <router-link v-if="!hasFilters" to="/tasks/new" class="btn btn-primary">
                    <i class="bi bi-plus-circle me-2"></i>
                    Create First Task
                </router-link>
            </div>

            <div v-else class="row">
                <div class="col-12">
                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <span class="text-muted">{{ filteredTasks.length }} task(s) found</span>
                    </div>
                </div>
                <div v-for="task in filteredTasks" :key="task.id" class="col-lg-4 col-md-6 mb-3">
                    <task-card
                        :task="task"
                        @update-status="updateTaskStatus"
                        @edit="editTask"
                        @delete="deleteTask"
                    ></task-card>
                </div>
            </div>
        </div>
    `,
    
    data() {
        return {
            filters: {
                status: '',
                assignee: '',
                priority: ''
            },
            sortBy: 'createdAt',
            sortOrder: 'desc'
        };
    },
    
    computed: {
        filteredTasks() {
            return this.$store.getters.filteredTasks;
        },
        
        teamMembers() {
            return this.$store.state.teamMembers;
        },
        
        hasFilters() {
            return this.filters.status || this.filters.assignee || this.filters.priority;
        }
    },
    
    methods: {
        updateFilters() {
            this.$store.dispatch('setFilters', this.filters);
        },
        
        updateSort() {
            this.$store.dispatch('setSort', {
                sortBy: this.sortBy,
                sortOrder: this.sortOrder
            });
        },
        
        toggleSortOrder() {
            this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
            this.updateSort();
        },
        
        clearFilters() {
            this.filters = {
                status: '',
                assignee: '',
                priority: ''
            };
            this.updateFilters();
        },
        
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

// Team List Component
const TeamList = {
    template: `
        <div class="team-list">
            <div class="row mb-4">
                <div class="col">
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <h1 class="h2">
                                <i class="bi bi-people me-2"></i>
                                Team Members
                            </h1>
                            <p class="text-muted">Manage your team members and their roles</p>
                        </div>
                        <router-link to="/team/new" class="btn btn-primary">
                            <i class="bi bi-person-plus me-2"></i>
                            Add Member
                        </router-link>
                    </div>
                </div>
            </div>

            <div v-if="teamMembers.length === 0" class="text-center py-5">
                <i class="bi bi-people fs-1 text-muted d-block mb-3"></i>
                <h4 class="text-muted">No team members yet</h4>
                <p class="text-muted">Add your first team member to get started with task assignment</p>
                <router-link to="/team/new" class="btn btn-primary">
                    <i class="bi bi-person-plus me-2"></i>
                    Add First Member
                </router-link>
            </div>

            <div v-else class="row">
                <div v-for="member in teamMembers" :key="member.id" class="col-lg-4 col-md-6 mb-4">
                    <div class="card h-100">
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-start mb-3">
                                <div class="d-flex align-items-center">
                                    <div class="bg-primary rounded-circle d-flex align-items-center justify-content-center me-3" 
                                         style="width: 48px; height: 48px;">
                                        <span class="text-white fw-bold">{{ getInitials(member.name) }}</span>
                                    </div>
                                    <div>
                                        <h5 class="card-title mb-1">{{ member.name }}</h5>
                                        <p class="text-muted small mb-0">{{ member.role }}</p>
                                    </div>
                                </div>
                                <div class="dropdown">
                                    <button class="btn btn-sm btn-outline-secondary" type="button" data-bs-toggle="dropdown">
                                        <i class="bi bi-three-dots-vertical"></i>
                                    </button>
                                    <ul class="dropdown-menu">
                                        <li><a class="dropdown-item" href="#" @click.prevent="editMember(member)">
                                            <i class="bi bi-pencil me-2"></i>Edit
                                        </a></li>
                                        <li><a class="dropdown-item text-danger" href="#" @click.prevent="deleteMember(member.id)">
                                            <i class="bi bi-trash me-2"></i>Remove
                                        </a></li>
                                    </ul>
                                </div>
                            </div>
                            
                            <div class="mb-3">
                                <small class="text-muted">
                                    <i class="bi bi-envelope me-1"></i>
                                    {{ member.email }}
                                </small>
                            </div>
                            
                            <div class="d-flex justify-content-between align-items-center">
                                <div>
                                    <small class="text-muted">Assigned Tasks:</small>
                                    <strong class="d-block">{{ getAssignedTasksCount(member.id) }}</strong>
                                </div>
                                <div>
                                    <small class="text-muted">Completed:</small>
                                    <strong class="d-block text-success">{{ getCompletedTasksCount(member.id) }}</strong>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    
    computed: {
        teamMembers() {
            return this.$store.state.teamMembers;
        },
        
        tasks() {
            return this.$store.state.tasks;
        }
    },
    
    methods: {
        getInitials(name) {
            return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
        },
        
        getAssignedTasksCount(memberId) {
            return this.tasks.filter(task => task.assigneeId === memberId).length;
        },
        
        getCompletedTasksCount(memberId) {
            return this.tasks.filter(task => task.assigneeId === memberId && task.status === 'completed').length;
        },
        
        editMember(member) {
            this.$router.push(`/team/${member.id}/edit`);
        },
        
        async deleteMember(memberId) {
            const assignedTasks = this.getAssignedTasksCount(memberId);
            let confirmMessage = 'Are you sure you want to remove this team member?';
            
            if (assignedTasks > 0) {
                confirmMessage += ` This will unassign ${assignedTasks} task(s) currently assigned to them.`;
            }
            
            if (confirm(confirmMessage)) {
                try {
                    await this.$store.dispatch('deleteTeamMember', memberId);
                    // Refresh tasks to show updated assignments
                    await this.$store.dispatch('fetchTasks');
                } catch (error) {
                    console.error('Failed to delete team member:', error);
                }
            }
        }
    },
    
    async created() {
        await Promise.all([
            this.$store.dispatch('fetchTeamMembers'),
            this.$store.dispatch('fetchTasks')
        ]);
    }
};

// Router setup
const routes = [
    { path: '/', component: Dashboard },
    { path: '/tasks', component: TasksList },
    { path: '/tasks/new', component: TaskForm },
    { path: '/tasks/:id/edit', component: TaskForm, props: route => ({ taskId: route.params.id }) },
    { path: '/team', component: TeamList },
    { path: '/team/new', component: TeamMemberForm },
    { path: '/team/:id/edit', component: TeamMemberForm, props: route => ({ memberId: route.params.id }) }
];

const router = createRouter({
    history: createWebHashHistory(),
    routes
});

// Create Vue app
const app = createApp({
    methods: {
        getToastIcon(type) {
            switch (type) {
                case 'success': return 'bi-check-circle-fill';
                case 'danger': return 'bi-exclamation-triangle-fill';
                case 'warning': return 'bi-exclamation-circle-fill';
                case 'info': return 'bi-info-circle-fill';
                default: return 'bi-info-circle-fill';
            }
        },
        
        getToastTitle(type) {
            switch (type) {
                case 'success': return 'Success';
                case 'danger': return 'Error';
                case 'warning': return 'Warning';
                case 'info': return 'Info';
                default: return 'Notification';
            }
        }
    },
    
    mounted() {
        // Auto-remove toasts after 5 seconds
        setInterval(() => {
            const toasts = this.$store.state.toasts;
            if (toasts.length > 0) {
                const now = Date.now();
                toasts.forEach(toast => {
                    if (now - toast.id > 5000) {
                        this.$store.dispatch('removeToast', toast.id);
                    }
                });
            }
        }, 1000);
    }
});

// Register components
app.component('Dashboard', Dashboard);
app.component('TaskCard', TaskCard);
app.component('TaskForm', TaskForm);
app.component('TeamMemberForm', TeamMemberForm);

// Use plugins
app.use(store);
app.use(router);

// Mount app
app.mount('#app');
