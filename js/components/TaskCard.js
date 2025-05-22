const TaskCard = {
    props: {
        task: {
            type: Object,
            required: true
        }
    },
    
    template: `
        <div class="card task-card" :class="taskCardClass">
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-start mb-2">
                    <h6 class="card-title mb-0" :class="{ 'text-decoration-line-through': task.status === 'completed' }">
                        {{ task.title }}
                    </h6>
                    <div class="dropdown">
                        <button class="btn btn-sm btn-outline-secondary" type="button" data-bs-toggle="dropdown">
                            <i class="bi bi-three-dots-vertical"></i>
                        </button>
                        <ul class="dropdown-menu">
                            <li><a class="dropdown-item" href="#" @click.prevent="$emit('edit', task)">
                                <i class="bi bi-pencil me-2"></i>Edit
                            </a></li>
                            <li><a class="dropdown-item text-danger" href="#" @click.prevent="$emit('delete', task.id)">
                                <i class="bi bi-trash me-2"></i>Delete
                            </a></li>
                        </ul>
                    </div>
                </div>
                
                <p v-if="task.description" class="card-text text-muted small mb-2">
                    {{ task.description }}
                </p>
                
                <div class="mb-2">
                    <span class="badge" :class="priorityBadgeClass">
                        <i class="bi" :class="priorityIcon"></i>
                        {{ task.priority.toUpperCase() }}
                    </span>
                </div>
                
                <div v-if="task.assigneeId" class="mb-2">
                    <small class="text-muted">
                        <i class="bi bi-person me-1"></i>
                        {{ getAssigneeName(task.assigneeId) }}
                    </small>
                </div>
                
                <div v-if="task.dueDate" class="mb-2">
                    <small :class="dueDateClass">
                        <i class="bi bi-calendar me-1"></i>
                        {{ formatDate(task.dueDate) }}
                    </small>
                </div>
                
                <div class="d-flex justify-content-between align-items-center">
                    <select 
                        :value="task.status" 
                        @change="updateStatus"
                        class="form-select form-select-sm"
                        :class="statusSelectClass"
                    >
                        <option value="todo">To Do</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                    </select>
                </div>
                
                <div class="mt-2">
                    <small class="text-muted">
                        <i class="bi bi-clock me-1"></i>
                        Created {{ formatRelativeDate(task.createdAt) }}
                    </small>
                </div>
            </div>
        </div>
    `,
    
    computed: {
        taskCardClass() {
            const classes = [];
            
            if (this.task.priority === 'high') {
                classes.push('border-danger');
            } else if (this.task.priority === 'medium') {
                classes.push('border-warning');
            }
            
            if (this.isOverdue) {
                classes.push('bg-light-danger');
            }
            
            return classes.join(' ');
        },
        
        priorityBadgeClass() {
            const baseClass = 'badge';
            switch (this.task.priority) {
                case 'high': return `${baseClass} bg-danger`;
                case 'medium': return `${baseClass} bg-warning`;
                case 'low': return `${baseClass} bg-secondary`;
                default: return `${baseClass} bg-secondary`;
            }
        },
        
        priorityIcon() {
            switch (this.task.priority) {
                case 'high': return 'bi-exclamation-triangle-fill';
                case 'medium': return 'bi-exclamation-circle-fill';
                case 'low': return 'bi-circle-fill';
                default: return 'bi-circle-fill';
            }
        },
        
        statusSelectClass() {
            switch (this.task.status) {
                case 'todo': return 'border-warning';
                case 'in-progress': return 'border-info';
                case 'completed': return 'border-success';
                default: return '';
            }
        },
        
        dueDateClass() {
            if (this.isOverdue) {
                return 'text-danger fw-bold';
            } else if (this.isDueSoon) {
                return 'text-warning fw-bold';
            }
            return 'text-muted';
        },
        
        isOverdue() {
            if (!this.task.dueDate || this.task.status === 'completed') return false;
            return new Date(this.task.dueDate) < new Date();
        },
        
        isDueSoon() {
            if (!this.task.dueDate || this.task.status === 'completed') return false;
            const dueDate = new Date(this.task.dueDate);
            const today = new Date();
            const diffTime = dueDate - today;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return diffDays <= 3 && diffDays >= 0;
        }
    },
    
    methods: {
        updateStatus(event) {
            this.$emit('update-status', this.task.id, event.target.value);
        },
        
        getAssigneeName(assigneeId) {
            const assignee = this.$store.state.teamMembers.find(member => member.id === assigneeId);
            return assignee ? assignee.name : 'Unknown';
        },
        
        formatDate(dateString) {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            });
        },
        
        formatRelativeDate(dateString) {
            const date = new Date(dateString);
            const now = new Date();
            const diffTime = Math.abs(now - date);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            if (diffDays === 1) {
                return 'yesterday';
            } else if (diffDays < 7) {
                return `${diffDays} days ago`;
            } else if (diffDays < 30) {
                const weeks = Math.floor(diffDays / 7);
                return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
            } else {
                return this.formatDate(dateString);
            }
        }
    },
    
    emits: ['update-status', 'edit', 'delete']
};
