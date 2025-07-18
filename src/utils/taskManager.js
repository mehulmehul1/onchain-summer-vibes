/**
 * Task Management System
 * Handles reading and writing to tasks.json
 */

const fs = require('fs').promises;
const path = require('path');

class TaskManager {
    constructor() {
        this.tasksFile = path.join(process.cwd(), 'tasks', 'tasks.json');
        this.tasks = null;
    }

    /**
     * Load tasks from the JSON file
     */
    async loadTasks() {
        try {
            const data = await fs.readFile(this.tasksFile, 'utf8');
            this.tasks = JSON.parse(data);
            return this.tasks;
        } catch (error) {
            console.error('Error loading tasks:', error);
            throw error;
        }
    }

    /**
     * Save tasks to the JSON file
     */
    async saveTasks() {
        if (!this.tasks) {
            throw new Error('Tasks not loaded');
        }
        try {
            this.tasks.lastUpdated = new Date().toISOString();
            await fs.writeFile(
                this.tasksFile, 
                JSON.stringify(this.tasks, null, 4),
                'utf8'
            );
        } catch (error) {
            console.error('Error saving tasks:', error);
            throw error;
        }
    }

    /**
     * Find a task or subtask by ID
     */
    findTask(taskId) {
        if (!this.tasks) return null;

        // Check if it's a subtask ID (e.g., "1.2")
        if (taskId.includes('.')) {
            const [parentId, subId] = taskId.split('.');
            const parentTask = this.tasks.tasks.find(t => t.id === parentId);
            return parentTask?.subtasks?.find(st => st.id === taskId);
        }

        // Main task
        return this.tasks.tasks.find(t => t.id === taskId);
    }

    /**
     * Update a task's status
     */
    async updateTaskStatus(taskId, newStatus, details = '') {
        if (!this.tasks) await this.loadTasks();

        const task = this.findTask(taskId);
        if (!task) {
            throw new Error(`Task ${taskId} not found`);
        }

        // Update status
        task.status = newStatus;
        
        // Add details if provided
        if (details) {
            task.details = task.details || [];
            task.details.push({
                timestamp: new Date().toISOString(),
                message: details
            });
        }

        // Update parent task status if it's a subtask
        if (taskId.includes('.')) {
            const [parentId] = taskId.split('.');
            const parentTask = this.tasks.tasks.find(t => t.id === parentId);
            if (parentTask) {
                const allSubtasksDone = parentTask.subtasks.every(st => st.status === 'done');
                if (allSubtasksDone) {
                    parentTask.status = 'done';
                } else if (parentTask.subtasks.some(st => st.status === 'in-progress')) {
                    parentTask.status = 'in-progress';
                }
            }
        }

        // Save changes
        await this.saveTasks();
    }

    /**
     * Start a task - mark as in-progress
     */
    async startTask(taskId) {
        await this.updateTaskStatus(taskId, 'in-progress');
        this.tasks.currentTask = taskId;
        await this.saveTasks();
    }

    /**
     * Complete a task
     */
    async completeTask(taskId, details = '') {
        await this.updateTaskStatus(taskId, 'done', details);
        if (this.tasks.currentTask === taskId) {
            this.tasks.currentTask = null;
        }
        await this.saveTasks();
    }

    /**
     * Mark a task as failed
     */
    async failTask(taskId, error) {
        const details = `Failed: ${error.message}\n${error.stack || ''}`;
        await this.updateTaskStatus(taskId, 'failed', details);
        await this.saveTasks();
    }
}

// Export singleton instance
const taskManager = new TaskManager();
module.exports = taskManager;
