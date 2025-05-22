const TeamMemberForm = {
    props: {
        memberId: {
            type: String,
            default: null
        }
    },
    
    data() {
        return {
            form: {
                name: '',
                email: '',
                role: ''
            },
            errors: {},
            isSubmitting: false
        };
    },
    
    template: `
        <div class="team-member-form">
            <div class="row mb-4">
                <div class="col">
                    <nav aria-label="breadcrumb">
                        <ol class="breadcrumb">
                            <li class="breadcrumb-item">
                                <router-link to="/">Dashboard</router-link>
                            </li>
                            <li class="breadcrumb-item">
                                <router-link to="/team">Team</router-link>
                            </li>
                            <li class="breadcrumb-item active">{{ isEditing ? 'Edit Member' : 'New Member' }}</li>
                        </ol>
                    </nav>
                    <h1 class="h2">
                        <i class="bi bi-person-plus me-2" v-if="!isEditing"></i>
                        <i class="bi bi-pencil me-2" v-else></i>
                        {{ isEditing ? 'Edit Team Member' : 'Add Team Member' }}
                    </h1>
                </div>
            </div>

            <div class="row">
                <div class="col-lg-8">
                    <div class="card">
                        <div class="card-body">
                            <form @submit.prevent="submitForm">
                                <div class="mb-3">
                                    <label for="name" class="form-label">
                                        Full Name <span class="text-danger">*</span>
                                    </label>
                                    <input
                                        id="name"
                                        v-model="form.name"
                                        type="text"
                                        class="form-control"
                                        :class="{ 'is-invalid': errors.name }"
                                        placeholder="Enter full name"
                                        required
                                    >
                                    <div v-if="errors.name" class="invalid-feedback">
                                        {{ errors.name }}
                                    </div>
                                </div>

                                <div class="mb-3">
                                    <label for="email" class="form-label">
                                        Email Address <span class="text-danger">*</span>
                                    </label>
                                    <input
                                        id="email"
                                        v-model="form.email"
                                        type="email"
                                        class="form-control"
                                        :class="{ 'is-invalid': errors.email }"
                                        placeholder="Enter email address"
                                        required
                                    >
                                    <div v-if="errors.email" class="invalid-feedback">
                                        {{ errors.email }}
                                    </div>
                                </div>

                                <div class="mb-3">
                                    <label for="role" class="form-label">Role</label>
                                    <input
                                        id="role"
                                        v-model="form.role"
                                        type="text"
                                        class="form-control"
                                        :class="{ 'is-invalid': errors.role }"
                                        placeholder="Enter role (e.g., Developer, Designer, Manager)"
                                    >
                                    <div v-if="errors.role" class="invalid-feedback">
                                        {{ errors.role }}
                                    </div>
                                    <div class="form-text">
                                        If left empty, will default to "Team Member"
                                    </div>
                                </div>

                                <div v-if="errors.general" class="alert alert-danger">
                                    {{ errors.general }}
                                </div>

                                <div class="d-flex gap-2 mt-4">
                                    <button 
                                        type="submit" 
                                        class="btn btn-primary"
                                        :disabled="isSubmitting"
                                    >
                                        <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-2"></span>
                                        <i v-else class="bi bi-check-circle me-2"></i>
                                        {{ isEditing ? 'Update Member' : 'Add Member' }}
                                    </button>
                                    
                                    <router-link to="/team" class="btn btn-outline-secondary">
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
                                Team Member Guidelines
                            </h6>
                        </div>
                        <div class="card-body">
                            <ul class="list-unstyled mb-0">
                                <li class="mb-2">
                                    <i class="bi bi-check-circle text-success me-2"></i>
                                    Use the person's full professional name
                                </li>
                                <li class="mb-2">
                                    <i class="bi bi-check-circle text-success me-2"></i>
                                    Provide a valid work email address
                                </li>
                                <li class="mb-2">
                                    <i class="bi bi-check-circle text-success me-2"></i>
                                    Specify their primary role or job title
                                </li>
                                <li class="mb-2">
                                    <i class="bi bi-check-circle text-success me-2"></i>
                                    Email addresses must be unique
                                </li>
                                <li>
                                    <i class="bi bi-check-circle text-success me-2"></i>
                                    All information can be updated later
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div class="card mt-3">
                        <div class="card-header">
                            <h6 class="mb-0">
                                <i class="bi bi-people me-2"></i>
                                Current Team
                            </h6>
                        </div>
                        <div class="card-body">
                            <div v-if="teamMembers.length === 0" class="text-center text-muted py-3">
                                <i class="bi bi-people fs-1 d-block mb-2"></i>
                                No team members yet
                            </div>
                            <div v-else>
                                <div v-for="member in teamMembers" :key="member.id" class="d-flex align-items-center mb-2">
                                    <div class="me-2">
                                        <i class="bi bi-person-circle fs-5"></i>
                                    </div>
                                    <div class="flex-grow-1">
                                        <div class="fw-semibold small">{{ member.name }}</div>
                                        <div class="text-muted small">{{ member.role }}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    
    computed: {
        isEditing() {
            return !!this.memberId;
        },
        
        teamMembers() {
            return this.$store.state.teamMembers;
        }
    },
    
    methods: {
        async submitForm() {
            this.errors = {};
            this.isSubmitting = true;
            
            try {
                if (this.isEditing) {
                    await this.$store.dispatch('updateTeamMember', {
                        id: this.memberId,
                        memberData: this.form
                    });
                } else {
                    await this.$store.dispatch('createTeamMember', this.form);
                }
                
                this.$router.push('/team');
            } catch (error) {
                if (error.response?.data?.error) {
                    this.errors.general = error.response.data.error;
                }
            } finally {
                this.isSubmitting = false;
            }
        },
        
        async loadMember() {
            if (this.isEditing) {
                const member = this.$store.state.teamMembers.find(m => m.id === this.memberId);
                if (member) {
                    this.form = {
                        name: member.name,
                        email: member.email,
                        role: member.role
                    };
                } else {
                    // Member not found, redirect to team list
                    this.$router.push('/team');
                }
            }
        }
    },
    
    async created() {
        await this.$store.dispatch('fetchTeamMembers');
        this.loadMember();
    },
    
    watch: {
        memberId() {
            this.loadMember();
        }
    }
};
