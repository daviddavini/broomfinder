import {
  between,
  BLDG_POSITIONS,
  getDistanceFromLatLonInKm,
  DAY_STRT_TIME_SECS,
  DAY_STOP_TIME_SECS,
} from "./utilities.js";

function createFeaturesForClassroom(situation, classroom) {
  let open = true;
  // let curr_course_ids = [];
  // let num_courses_before = 0;
  // let num_courses_after = 0;
  // let num_courses_currently = 0;
  let prev_course_stop_time_secs = DAY_STRT_TIME_SECS;
  let next_course_strt_time_secs = DAY_STOP_TIME_SECS;
  let curr_course_stop_time_secs = situation.now_time_secs;
  let curr_course_strt_time_secs = situation.now_time_secs;

  for (const [i, course] of classroom.courses.entries()) {
    // Time logic only makes sense if we are on the same day
    if (course.days.includes(situation.now_day)) {
      // Determine if classroom in use
      const time_in_range = between(
        course.strt_time_secs,
        situation.now_time_secs,
        course.stop_time_secs
      );
      if (time_in_range) {
        open = false;
        // num_courses_currently += 1;
        // curr_course_ids.push(i);

        // Update current course start and stops
        if (curr_course_stop_time_secs <= course.stop_time_secs) {
          curr_course_stop_time_secs = course.stop_time_secs;
        }

        if (course.strt_time_secs <= curr_course_strt_time_secs) {
          curr_course_strt_time_secs = course.strt_time_secs;
        }
      }

      // Determine next start time
      const earlier_start = between(
        situation.now_time_secs,
        course.strt_time_secs,
        next_course_strt_time_secs
      );
      if (earlier_start) {
        next_course_strt_time_secs = course.strt_time_secs;
      }

      // Determine prev stop time
      const later_stop = between(
        prev_course_stop_time_secs,
        course.stop_time_secs,
        situation.now_time_secs
      );
      if (later_stop) {
        prev_course_stop_time_secs = course.stop_time_secs;
      }
    }
  }

  let feats = {};
  if (open) {
    feats.time_open = next_course_strt_time_secs - situation.now_time_secs;
  } else {
    feats.time_open = 0;
  }

  if ("building" in classroom) {
    // Use cached distance if possible
    if ("features" in classroom.building) {
      feats.distance = classroom.building.features.distance;
    } else {
      let dist = getDistanceFromLatLonInKm(
        situation.now_lat,
        situation.now_lon,
        classroom.building.latitude,
        classroom.building.longitude
      );
      classroom.building.features = {};
      classroom.building.features.distance = dist;
      feats.distance = dist;
    }
  } else {
    feats.distance = 3;
  }

  return feats;
}

function createFeatures(situation, classrooms, buildings) {
  let i = 0;
  for (let classroom of classrooms) {
    const feats = createFeaturesForClassroom(situation, classroom);
    // Store the features on the classroom
    classroom.features = feats;
    // Also store the features in a separate array
    i++;
  }
}

// process.stdout.write(classroom.text);

// if (feats["open"]) {
//   process.stdout.write(" IS OPEN UNTIL " + feats["next_course_strt_time"]);
// } else {
//   process.stdout.write(
//     " IS OCCUPIED UNTIL " + feats["curr_course_stop_time"]
//   );
// }
// process.stdout.write("\n");

export default createFeatures;
