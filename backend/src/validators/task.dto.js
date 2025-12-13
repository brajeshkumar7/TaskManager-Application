import { z } from 'zod';

const priorityEnum = z.enum(['Low', 'Medium', 'High', 'Urgent']);
const statusEnum = z.enum(['To Do', 'In Progress', 'Review', 'Completed']);

export const createTaskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title cannot exceed 100 characters').trim(),
  description: z.string().trim().optional().default(''),
  dueDate: z.coerce.date({
    required_error: 'Due date is required',
    invalid_type_error: 'Invalid date format',
  }),
  priority: priorityEnum.default('Medium'),
  status: statusEnum.default('To Do'),
  assignedToId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid user ID').optional().nullable(),
});

export const updateTaskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title cannot exceed 100 characters').trim().optional(),
  description: z.string().trim().optional(),
  dueDate: z.coerce.date({
    invalid_type_error: 'Invalid date format',
  }).optional(),
  priority: priorityEnum.optional(),
  status: statusEnum.optional(),
  assignedToId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid user ID').optional().nullable(),
});
