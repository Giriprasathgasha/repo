import jsonfile from "jsonfile";
import moment from "moment";
import simpleGit from "simple-git";
import random from "random";

const git = simpleGit();
const FILE_PATH = "./data.json";

/* ===============================
   CONFIG – CHANGE ONLY THIS
================================ */
const START_DATE = "2024-01-01";   // YYYY-MM-DD
const END_DATE   = "2024-03-31";   // YYYY-MM-DD
const MIN_COMMITS_PER_DAY = 1;
const MAX_COMMITS_PER_DAY = 5;
/* =============================== */

async function commitOnDate(date, count) {
  for (let i = 0; i < count; i++) {
    const commitTime = moment(date)
      .hour(random.int(0, 23))
      .minute(random.int(0, 59))
      .second(random.int(0, 59))
      .format();

    await jsonfile.writeFile(FILE_PATH, { date: commitTime });

    await git
      .add(FILE_PATH)
      .commit(`commit on ${commitTime}`, { "--date": commitTime });
  }
}

async function run() {
  let currentDate = moment(START_DATE);
  const endDate = moment(END_DATE);

  while (currentDate.isSameOrBefore(endDate)) {
    const commitsToday = random.int(
      MIN_COMMITS_PER_DAY,
      MAX_COMMITS_PER_DAY
    );

    console.log(
      `📅 ${currentDate.format("YYYY-MM-DD")} → ${commitsToday} commits`
    );

    await commitOnDate(currentDate, commitsToday);
    currentDate.add(1, "day");
  }

  await git.push();
  console.log("✅ All commits pushed successfully");
}

run();
