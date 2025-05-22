const TaskForm = {
    props: {
        taskId: {
            type: String,
            default: null
        }
    },
    
    data() {
        return {
            form: {
                title: '',
                description: '',
                assigneeId: '',
                priority: 'medium',
                dueDate: '',
                status: 'todo'
            },
            errors: {},
            isSubmitting: false
        };
    },
    
    template: `
        <div class="task-form">
            <div class="row mb-4">
                <div class="col">
                    <nav aria-label="breadcrumb">
                        <ol class="breadcrumb">
                            <li class="breadcrumb-item">
                                <router-link to="/">Dashboard</router-link>
                            </li>
                            <li class="breadcrumb-item">
                                <router-link to="/tasks">Tasks</router-link>
                            </li>
                            <li class="breadcrumb-item active">{{ isEditing ? 'Edit Task' : 'New Task' }}</li>
                        </ol>
                    </nav>
                    <h1 class="h2">
                        <i class="bi bi-plus-circle me-2" v-if="!isEditing"></i>
                        <i class="bi bi-pencil me-2" v-else></i>
                        {{ isEditing ? 'Edit Task' : 'Create New Task' }}
                    </h1>
                </div>
            </div>

            <div class="row">
                <div class="col-lg-8">
                    <div class="card">
                        <div class="card-body">
                            <form @submit.prevent="submitForm">
                                <div class="mb-3">
                                    <label for="title" class="form-label">
                                        Task Title <span class="text-danger">*</span>
                                    </label>
                                    <input
                                        id="title"
                                        v-model="form.title"
                                        type="text"
                                        class="form-control"
                                        :class="{ 'is-invalid': errors.title }"
                                        placeholder="Enter task title"
                                        required
                                    >
                                    <div v-if="errors.title" class="invalid-feedback">
                                        {{ errors.title }}
                                    </div>
                                </div>

                                <div class="mb-3">
                                    <label for="description" class="form-label">Description</label>
                                    <textarea
                                        id="description"
                                        v-model="form.description"
                                        class="form-control"
                                        :class="{ 'is-invalid': errors.description }"
                                        rows="4"
                                        placeholder="Enter task description (optional)"
                                    ></textarea>
                                    <div v-if="errors.description" class="invalid-feedback">
                                        {{ errors.description }}
                                    </div>
                                </div>

                                <div class="row">
                                    <div class="col-md-6 mb-3">
                                        <label for="assignee" class="form-label">Assign To</label>
                                        <select
                                            id="assignee"
                                            v-model="form.assigneeId"
                                            class="form-select"
                                            :class="{ 'is-invalid': errors.assigneeId }"
                                        >
                                            <option value="">Unassigned</option>
                                            <option 
                                                v-for="member in teamMembers" 
                                                :key="member.id" 
                                                :value="member.id"
                                            >
                                                {{ member.name }} ({{ member.role }})
                                            </option>
                                        </select>
                                        <div v-if="errors.assigneeId" class="invalid-feedback">
                                            {{ errors.assigneeId }}
                                        </div>
                                    </div>

                                    <div class="col-md-6 mb-3">
                                        <label for="priority" class="form-label">Priority</label>
                                        <select
                                            id="priority"
                                            v-model="form.priority"
                                            class="form-select"
                                            :class="{ 'is-invalid': errors.priority }"
                                        >
                                            <option value="low">
                                                <i class="bi bi-circle-fill"></i> Low Priority
                                            </option>
                                            <option value="medium">
                                                <i class="bi bi-exclamation-circle-fill"></i> Medium Priority
                                            </option>
                                            <option value="high">
                                                <i class="bi bi-exclamation-triangle-fill"></i> High Priority
                                            </option>
                                        </select>
                                        <div v-if="errors.priority" class="invalid-feedback">
                                            {{ errors.priority }}
                                        </div>
                                    </div>
                                </div>

                                <div class="row">
                                    <div class="col-md-6 mb-3">
                                        <label for="dueDate" class="form-label">Due Date</label>
                                        <input
                                            id="dueDate"
                                            v-model="form.dueDate"
                                            type="date"
                                            class="form-control"
                                            :class="{ 'is-invalid': errors.dueDate }"
                                            :min="today"
                                        >
                                        <div v-if="errors.dueDate" class="invalid-feedback">
                                            {{ errors.dueDate }}
                                        </div>
                                    </div>

                                    <div v-if="isEditing" class="col-md-6 mb-3">
                                        <label for="status" class="form-label">Status</label>
                                        <select
                                            id="status"
                                            v-model="form.status"
                                            class="form-select"
                                            :class="{ 'is-invalid': errors.status }"
                                        >
                                            <option value="todo">To Do</option>
                                            <option value="in-progress">In Progress</option>
                                            <option value="completed">Completed</option>
                                        </select>
                                        <div v-if="errors.status" class="invalid-feedback">
                                            {{ errors.status }}
                                        </div>
                                    </div>
                                </div>

                                <div class="d-flex gap-2 mt-4">
                                    <button 
                                        type="submit" 
                                        class="btn btn-primary"
                                        :disabled="isSubmitting"
                                    >
                                        <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-2"></span>
                                        <i v-else class="bi bi-check-circle me-2"></i>
                                        {{ isEditing ? 'Update Task' : 'Create Task' }}
                                    </button>
                                    
                                    <router-link to="/tasks" class="btn btn-outline-secondary">
                                        <i class="bi bi-x-circle me-2"></i>
                                        Cancel
                                    </router-link>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                <div class="col-lg-4">
                    <div class="card">
                        <div class="card-header">
                            <h6 class="mb-0">
                                <i class="bi bi-info-circle me-2"></i>
                                Task Guidelines
                            </h6>
                        </div>
                        <div class="card-body">
                            <ul class="list-unstyled mb-0">
                                <li class="mb-2">
                                    <i class="bi bi-check-circle text-success me-2"></i>
                                    Use clear, descriptive titles
                                </li>
                                <li class="mb-2">
                                    <i class="bi bi-check-circle text-success me-2"></i>
                                    Set realistic due dates
                                </li>
                                <li class="mb-2">
                                    <i class="bi bi-check-circle text-success me-2"></i>
                                    Assign tasks to appropriate team members
                                </li>
                                <li class="mb-2">
                                    <i class="bi bi-check-circle text-success me-2"></i>
                                    Use priority levels effectively
                                </li>
                                <li>
                                    <i class="bi bi-check-circle text-success me-2"></i>
                                    Provide detailed descriptions when needed
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    
    computed: {
        isEditing() {
            return !!this.taskId;
        },
        
        teamMembers() {
            return this.$store.state.teamMembers;
        },
        
        today() {
            return new Date().toISOString().split('T')[0];
        }
    },
    
    methods: {
        async submitForm() {
            this.errors = {};
            this.isSubmitting = true;
            
            try {
                if (this.isEditing) {
                    await this.$store.dispatch('updateTask', {
                        id: this.taskId,
                        taskData: this.form
                    });
                } else {
                    await this.$store.dispatch('createTask', this.form);
                }
                
                this.$router.push('/tasks');
            } catch (error) {
                if (error.response?.data?.error) {
                    // Handle validation errors
                    this.errors.general = error.response.data.error;
                }
            } finally {
                this.isSubmitting = false;
            }
        },
        
        async loadTask() {
            if (this.isEditing) {
                const task = this.$store.state.tasks.find(t => t.id === this.taskId);
                if (task) {
                    this.form = {
                        title: task.title,
                        description: task.description,
                        assigneeId: task.assigneeId || '',
                        priority: task.priority,
                        dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
                        status: task.status
                    };
                } else {
                    // Task not found, redirect to tasks list
                    this.$router.push('/tasks');
                }
            }
        }
    },
    
    async created() {
        await Promise.all([
            this.$store.dispatch('fetchTeamMembers'),
            this.$store.dispatch('fetchTasks')
        ]);
        
        this.loadTask();
    },
    
    watch: {
        taskId() {
            this.loadTask();
        }
    }
};
