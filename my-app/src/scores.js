function classroomScore(classroom) {
  return classroom.features.time_open - 5 * classroom.features.distance;
}

export function classroomCompareFn(a, b) {
  // Tiebreaker
  let scoreA = classroomScore(a);
  let scoreB = classroomScore(b);
  if (scoreA !== scoreB) {
    return scoreA - scoreB;
  } else {
    return ("" + a.text).localeCompare(b.text);
  }
}

// function computeScore(classroom) {
//   let score = 0;

//   // Remaining time open
//   score += classroom.features.time_open;
//   //

//   // Distance penalty
//   score -= 5 * classroom.features.distance;

//   classroom.score = score;

//   return score;
// }

// function computeScores(classrooms) {
//   for (let classroom of classrooms) {
//     computeScore(classroom);
//   }
// }

function computeScores_COMPLEX(classrooms, features) {
  let score = 0;
  // Prev course buffer
  // (need at least 10 mins for room to clear out)
  score -= features.prev_course_stop_time_secs;

  // Next course buffer
  // (need at least 10 mins while people trickle in to course)
  // this shouldn't be counted as open

  // Remaining time open
  // (want at least 30 mins open)

  //

  // Distance penalty
  score -= 5 * features.distance;
}

// export default computeScores;
