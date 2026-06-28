const { z } = require('zod')

const passwordSchema = z.string()
  .min(8,         'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Must contain an uppercase letter')
  .regex(/[a-z]/, 'Must contain a lowercase letter')
  .regex(/[0-9]/, 'Must contain a number')
  .regex(/[!@#$%^&*()\-_=+\[\]{};:'",.<>/?\\|`~]/, 'Must contain a special character')

module.exports = {
  register:       z.object({ name: z.string().min(2).max(60), email: z.string().email(), password: passwordSchema }),
  login:          z.object({ email: z.string().email(), password: z.string().min(1) }),
  forgotPassword: z.object({ email: z.string().email() }),
  resetPassword:  z.object({ email: z.string().email(), token: z.string().min(1), newPassword: passwordSchema }),
  createBoard:    z.object({ title: z.string().min(1).max(80), description: z.string().max(300).optional(), color: z.string().optional(), emoji: z.string().optional() }),
  updateBoard:    z.object({ title: z.string().min(1).max(80).optional(), description: z.string().max(300).optional(), color: z.string().optional(), emoji: z.string().optional() }),
  createTask:     z.object({ title: z.string().min(1).max(200), description: z.string().optional(), status: z.enum(['todo','inprogress','review','done']).optional(), priority: z.enum(['low','medium','high','urgent']).optional(), dueDate: z.string().optional().nullable(), effortHours: z.number().min(0).max(200).optional().nullable(), labels: z.array(z.string()).optional() }),
}
