import { injectable }    from 'inversify';

import { Course }                                  from '../models/course';

@injectable()
export class CourseDomain {

  getCourse(courseId: string) {
    return Course.findById(courseId).lean(true);
  }

  getIssuerCourses(issuerId: string) {
    return Course.find({issuerId}).lean(true);
  }

  createCourse(name: string, issuerId: string) {
    return Course.create({name, issuerId});
  }

  updateCourse(courseId: string, courseName: string) {
    return Course.findByIdAndUpdate(courseId, {name: courseName}, {new: true}).lean(true);
  }

  deleteCourses(courseIds: string[]) {
    return Course.deleteMany({_id: { $in: courseIds } } ).exec();
  }
}
