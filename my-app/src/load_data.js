import Papa from "papaparse";

import { DAY_CODES, timeToSeconds } from "./utilities.js";

async function fetchCSV(filename) {
  let response = await fetch(filename);
  let csv = await response.text();
  //   let reader = response.body.getReader();
  //   let result = await reader.read();
  //   let decoder = new TextDecoder("utf-8");
  //   let csv = decoder.decode(result.value);
  let parseResult = Papa.parse(csv, {
    header: true,
    skipEmptyLines: true,
    dynamicTyping: true,
  });
  let data = parseResult.data;
  return data;
}

function formatCourses(courses) {
  for (let course of courses) {
    // console.log(course);
    course.strt_time_secs = timeToSeconds(course.strt_time);
    course.stop_time_secs = timeToSeconds(course.stop_time);
    course.days = course.Days_in_week.split("")
      .filter((c) => c != " ")
      .map((c) => DAY_CODES.indexOf(c));
  }
}

let cache = {};
let firstCall = true;

async function loadClassrooms() {
  if (firstCall) {
    let [courses, classrooms, buildings] = await Promise.all([
      fetchCSV("/broomfinder/data_formatted_courses.csv"),
      fetchCSV("/broomfinder/data_formatted_classrooms.csv"),
      fetchCSV("/broomfinder/buildings.csv"),
    ]);

    // Formatting (move to server-side?)
    formatCourses(courses);

    // Add the course data to their resp. classrooms
    for (let classroom of classrooms) {
      const courses_here = courses.filter(
        (course) => course.classroom_id == classroom.id
      );
      classroom.courses = courses_here;
    }
    // TODO: Are some of the courses not filtering right?
    cache.classrooms = classrooms;
    cache.buildings = buildings;
    firstCall = false;

    for (let building of buildings) {
      let classrooms_here = classrooms.filter(
        (classroom) => building.value == classroom.value.split("|")[0]
      );

      // Link them
      building.classrooms = classrooms_here;
      for (let classroom of classrooms_here) {
        classroom.building = building;
      }
    }

    return [classrooms, buildings];
  } else {
    console.log(cache.classrooms);
    return [cache.classrooms, cache.buildings];
  }
}

export default loadClassrooms;
