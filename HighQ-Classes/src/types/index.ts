// Main export file for all user types

// Base types and admin
export * from './admin.types';

// Student types
export * from './student.types';

// Teacher types  
export * from './teacher.types';

// Union type for all extended users
import { AdminUser } from './admin.types';
import { StudentUser } from './student.types';
import { TeacherUser } from './teacher.types';

export type ExtendedUser = StudentUser | TeacherUser | AdminUser;
