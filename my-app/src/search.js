import loadClassrooms from "./load_data.js";
import getSituation from "./situation.js";
import createFeatures from "./features.js";
import { classroomCompareFn } from "./scores.js";

function sortClassrooms(classrooms, scores) {
  classrooms.sort((a, b) => a.score - b.score).reverse();
}

async function getSearchResults() {
  // Load classrooms(+courses)
  const classroomsPromise = loadClassrooms();
  // Get situation (user location and time)
  const situationPromise = getSituation();

  // Wait for these promises to evaluate
  let classrooms, buildings, situation;
  [[classrooms, buildings], situation] = await Promise.all([
    classroomsPromise,
    situationPromise,
  ]);

  console.log(buildings);

  // Convert situation+classrooms into features
  createFeatures(situation, classrooms, buildings);
  // Run features through objective function
  // computeScores(classrooms);
  // Sort classrooms by objective function
  classrooms.sort(classroomCompareFn).reverse();

  // console.log(situation, classrooms);

  return [situation, classrooms];
}

export default getSearchResults;
