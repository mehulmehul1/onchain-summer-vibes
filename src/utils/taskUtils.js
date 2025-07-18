/**
 * Utility functions for managing tasks with TaskManager
 */

import taskManager from './taskManager.js';

// Cache for task updates to avoid double updates
let lastUpdateMap = new Map();

/**
 * Update a task's status and append details if successful
 * @param {string} taskId - The task ID to update
 * @param {string} status - New status ('done', 'in-progress', etc.)
 * @param {string} [details] - Optional details about the task completion
 */
export async function updateTaskStatus(taskId, status, details) {
    if (!taskId) {
        console.warn('No task ID provided for status update');
        return;
    }

    // Prevent duplicate updates within 5 seconds
    const now = Date.now();
    const lastUpdate = lastUpdateMap.get(taskId);
    if (lastUpdate && now - lastUpdate < 5000) {
        return;
    }
    lastUpdateMap.set(taskId, now);

    try {
        // Initialize task manager if needed
        if (!taskManager.tasks) {
            await taskManager.loadTasks();
        }

        // Update task status
        if (status === 'done') {
            await taskManager.completeTask(taskId, details);
        } else if (status === 'in-progress') {
            await taskManager.startTask(taskId);
        } else if (status === 'failed') {
            await taskManager.failTask(taskId, new Error(details));
        } else {
            await taskManager.updateTaskStatus(taskId, status, details);
        }

        console.log(`Task ${taskId} status updated to ${status}`);

    } catch (error) {
        console.error(`Failed to update task ${taskId}:`, error);
        // Don't throw - we don't want task updates to break the app
    }
}

/**
 * Mark a task as complete with details
 * @param {string} taskId - The task ID to complete
 * @param {string} [details] - Optional completion details
 */
export async function completeTask(taskId, details = 'Task completed successfully') {
    await updateTaskStatus(taskId, 'done', details);
}

/**
 * Mark a task as in progress
 * @param {string} taskId - The task ID to update
 */
export async function startTask(taskId) {
    await updateTaskStatus(taskId, 'in-progress');
}

/**
 * Handle task error state
 * @param {string} taskId - The task ID that encountered an error
 * @param {Error} error - The error that occurred
 */
export async function taskError(taskId, error) {
    await updateTaskStatus(taskId, 'failed', error.message);
}
