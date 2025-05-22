const { createStore } = Vuex;

const store = createStore({
    state: {
        tasks: [],
        teamMembers: [],
        loading: false,
        error: null,
        toasts: [],
        filters: {
            status: '',
            assignee: '',
            priority: ''
        },
        sortBy: 'createdAt',
        sortOrder: 'desc'
    },
    
    getters: {
        filteredTasks: (state) => {
            let filtered = [...state.tasks];
            
            if (state.filters.status) {
                filtered = filtered.filter(task => task.status === state.filters.status);
            }
            
            if (state.filters.assignee) {
                filtered = filtered.filter(task => task.assigneeId === state.filters.assignee);
            }
            
            if (state.filters.priority) {
                filtered = filtered.filter(task => task.priority === state.filters.priority);
            }
            
            // Sort tasks
            filtered.sort((a, b) => {
                let aVal = a[state.sortBy];
                let bVal = b[state.sortBy];
                
                if (state.sortBy === 'dueDate') {
                    aVal = aVal ? new Date(aVal) : new Date('9999-12-31');
                    bVal = bVal ? new Date(bVal) : new Date('9999-12-31');
                } else if (state.sortBy === 'createdAt' || state.sortBy === 'updatedAt') {
                    aVal = new Date(aVal);
                    bVal = new Date(bVal);
                }
                
                if (state.sortOrder === 'asc') {
                    return aVal > bVal ? 1 : -1;
                } else {
                    return aVal < bVal ? 1 : -1;
                }
            });
            
            return filtered;
        },
        
        tasksByStatus: (state) => {
            return {
                todo: state.tasks.filter(task => task.status === 'todo'),
                'in-progress': state.tasks.filter(task => task.status === 'in-progress'),
                completed: state.tasks.filter(task => task.status === 'completed')
            };
        },
        
        taskStats: (state) => {
            const total = state.tasks.length;
            const completed = state.tasks.filter(task => task.status === 'completed').length;
            const inProgress = state.tasks.filter(task => task.status === 'in-progress').length;
            const todo = state.tasks.filter(task => task.status === 'todo').length;
            const highPriority = state.tasks.filter(task => task.priority === 'high').length;
            
            const overdue = state.tasks.filter(task => {
                if (!task.dueDate) return false;
                return new Date(task.dueDate) < new Date() && task.status !== 'completed';
            }).length;
            
            return { total, completed, inProgress, todo, highPriority, overdue };
        }
    },
    
    mutations: {
        SET_LOADING(state, loading) {
            state.loading = loading;
        },
        
        SET_ERROR(state, error) {
            state.error = error;
        },
        
        SET_TASKS(state, tasks) {
            state.tasks = tasks;
        },
        
        ADD_TASK(state, task) {
            state.tasks.push(task);
        },
        
        UPDATE_TASK(state, updatedTask) {
            const index = state.tasks.findIndex(task => task.id === updatedTask.id);
            if (index !== -1) {
                state.tasks.splice(index, 1, updatedTask);
            }
        },
        
        REMOVE_TASK(state, taskId) {
            state.tasks = state.tasks.filter(task => task.id !== taskId);
        },
        
        SET_TEAM_MEMBERS(state, members) {
            state.teamMembers = members;
        },
        
        ADD_TEAM_MEMBER(state, member) {
            state.teamMembers.push(member);
        },
        
        UPDATE_TEAM_MEMBER(state, updatedMember) {
            const index = state.teamMembers.findIndex(member => member.id === updatedMember.id);
            if (index !== -1) {
                state.teamMembers.splice(index, 1, updatedMember);
            }
        },
        
        REMOVE_TEAM_MEMBER(state, memberId) {
            state.teamMembers = state.teamMembers.filter(member => member.id !== memberId);
        },
        
        SET_FILTERS(state, filters) {
            state.filters = { ...state.filters, ...filters };
        },
        
        SET_SORT(state, { sortBy, sortOrder }) {
            state.sortBy = sortBy;
            state.sortOrder = sortOrder;
        },
        
        ADD_TOAST(state, toast) {
            state.toasts.push({
                id: Date.now() + Math.random(),
                ...toast
            });
        },
        
        REMOVE_TOAST(state, toastId) {
            state.toasts = state.toasts.filter(toast => toast.id !== toastId);
        }
    },
    
    actions: {
        async fetchTasks({ commit }) {
            commit('SET_LOADING', true);
            try {
                const response = await axios.get('/api/tasks');
                commit('SET_TASKS', response.data);
                commit('SET_ERROR', null);
            } catch (error) {
                commit('SET_ERROR', 'Failed to fetch tasks');
                commit('ADD_TOAST', { type: 'danger', message: 'Failed to fetch tasks' });
            } finally {
                commit('SET_LOADING', false);
            }
        },
        
        async createTask({ commit }, taskData) {
            commit('SET_LOADING', true);
            try {
                const response = await axios.post('/api/tasks', taskData);
                commit('ADD_TASK', response.data);
                commit('ADD_TOAST', { type: 'success', message: 'Task created successfully' });
                return response.data;
            } catch (error) {
                const message = error.response?.data?.error || 'Failed to create task';
                commit('ADD_TOAST', { type: 'danger', message });
                throw error;
            } finally {
                commit('SET_LOADING', false);
            }
        },
        
        async updateTask({ commit }, { id, taskData }) {
            commit('SET_LOADING', true);
            try {
                const response = await axios.put(`/api/tasks/${id}`, taskData);
                commit('UPDATE_TASK', response.data);
                commit('ADD_TOAST', { type: 'success', message: 'Task updated successfully' });
                return response.data;
            } catch (error) {
                const message = error.response?.data?.error || 'Failed to update task';
                commit('ADD_TOAST', { type: 'danger', message });
                throw error;
            } finally {
                commit('SET_LOADING', false);
            }
        },
        
        async deleteTask({ commit }, taskId) {
            commit('SET_LOADING', true);
            try {
                await axios.delete(`/api/tasks/${taskId}`);
                commit('REMOVE_TASK', taskId);
                commit('ADD_TOAST', { type: 'success', message: 'Task deleted successfully' });
            } catch (error) {
                const message = error.response?.data?.error || 'Failed to delete task';
                commit('ADD_TOAST', { type: 'danger', message });
                throw error;
            } finally {
                commit('SET_LOADING', false);
            }
        },
        
        async fetchTeamMembers({ commit }) {
            commit('SET_LOADING', true);
            try {
                const response = await axios.get('/api/team-members');
                commit('SET_TEAM_MEMBERS', response.data);
                commit('SET_ERROR', null);
            } catch (error) {
                commit('SET_ERROR', 'Failed to fetch team members');
                commit('ADD_TOAST', { type: 'danger', message: 'Failed to fetch team members' });
            } finally {
                commit('SET_LOADING', false);
            }
        },
        
        async createTeamMember({ commit }, memberData) {
            commit('SET_LOADING', true);
            try {
                const response = await axios.post('/api/team-members', memberData);
                commit('ADD_TEAM_MEMBER', response.data);
                commit('ADD_TOAST', { type: 'success', message: 'Team member added successfully' });
                return response.data;
            } catch (error) {
                const message = error.response?.data?.error || 'Failed to add team member';
                commit('ADD_TOAST', { type: 'danger', message });
                throw error;
            } finally {
                commit('SET_LOADING', false);
            }
        },
        
        async updateTeamMember({ commit }, { id, memberData }) {
            commit('SET_LOADING', true);
            try {
                const response = await axios.put(`/api/team-members/${id}`, memberData);
                commit('UPDATE_TEAM_MEMBER', response.data);
                commit('ADD_TOAST', { type: 'success', message: 'Team member updated successfully' });
                return response.data;
            } catch (error) {
                const message = error.response?.data?.error || 'Failed to update team member';
                commit('ADD_TOAST', { type: 'danger', message });
                throw error;
            } finally {
                commit('SET_LOADING', false);
            }
        },
        
        async deleteTeamMember({ commit }, memberId) {
            commit('SET_LOADING', true);
            try {
                await axios.delete(`/api/team-members/${memberId}`);
                commit('REMOVE_TEAM_MEMBER', memberId);
                commit('ADD_TOAST', { type: 'success', message: 'Team member removed successfully' });
            } catch (error) {
                const message = error.response?.data?.error || 'Failed to remove team member';
                commit('ADD_TOAST', { type: 'danger', message });
                throw error;
            } finally {
                commit('SET_LOADING', false);
            }
        },
        
        setFilters({ commit }, filters) {
            commit('SET_FILTERS', filters);
        },
        
        setSort({ commit }, sortOptions) {
            commit('SET_SORT', sortOptions);
        },
        
        removeToast({ commit }, toastId) {
            commit('REMOVE_TOAST', toastId);
        }
    }
});
