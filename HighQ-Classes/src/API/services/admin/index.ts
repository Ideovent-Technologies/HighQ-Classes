import { NoticeService } from "./notices.service";
import { StudentService } from "./students.service";
import { TeacherService } from "./teachers.service";
import { BatchService } from "./batches.service";
import { ScheduleService } from "./schedules.service";
import { CourseService } from "./courses.service";
import { ReportService } from "./reports.service";
import { UserService } from "./users.service";

class AdminService {
  notices = new NoticeService();
  students = new StudentService();
  teachers = new TeacherService();
  batches = new BatchService();
  schedules = new ScheduleService();
  courses = new CourseService();
  reports = new ReportService();
  users = new UserService();
}

export default new AdminService();
