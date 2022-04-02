import { readFile } from "fs";
import { parse } from "csv-parse";

async function loadClassrooms() {
  const csvCoursesPromise = new Promise((resolve, reject) => {
    readFile("data_formatted_courses.csv", (err, fileData) => {
      parse(fileData, { columns: true }, function (err, rows) {
        //   console.log("rows", rows, err);
        resolve(rows);
      });
    });
  });

  const csvClassroomsPromise = new Promise((resolve, reject) => {
    readFile("data_formatted_classrooms.csv", (err, fileData) => {
      parse(fileData, { columns: true }, function (err, rows) {
        //   console.log("rows", rows, err);
        resolve(rows);
      });
    });
  });

  let courses, classrooms;
  [courses, classrooms] = await Promise.all([
    csvCoursesPromise,
    csvClassroomsPromise,
  ]);

  // Add the course data to their resp. classrooms
  for (let classroom of classrooms) {
    classroom.courses = courses.filter(
      (course) => course["classroom_id"] == classroom["id"]
    );
  }

  return classrooms;
}

export default loadClassrooms;
