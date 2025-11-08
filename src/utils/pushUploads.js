import { exec } from "child_process";
import fs from "fs";
import path from "path";

const repo = process.env.GITHUB_REPO;
const folder = path.resolve("./uploads"); // adjust to your uploads folder
// Helper to run git commands and log output
function runGitCommand(cmd) {
  return new Promise((resolve, reject) => {
    console.log(`\nRunning: ${cmd}`);
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        reject(error);
        return;
      }
      if (stderr) console.error(`stderr: ${stderr}`);
      if (stdout) console.log(`stdout: ${stdout}`);
      resolve(stdout);
    });
  });
}

export const syncUploads = async () => {
  try {
    // Make sure folder exists
    if (!fs.existsSync(folder)) fs.mkdirSync(folder, { recursive: true });

    // Git setup
    await runGitCommand('git config user.name "Render Bot"');
    await runGitCommand('git config user.email "bot@example.com"');

    // Ensure we're on main
    await runGitCommand("git checkout -B main");

    // Stage everything in the uploads folder
    await runGitCommand(`git add -A ${folder}`);

    // Commit
    await runGitCommand(
      'git commit -m "sync: update uploads folder" || echo "nothing to commit"'
    );

    // Set remote (remove first if exists)
    await runGitCommand("git remote remove origin || true");
    await runGitCommand(`git remote add origin ${repo}`);

    // Push changes
    await runGitCommand("git push -u origin main --force");

    console.log("Uploads folder synced successfully!");
  } catch (err) {
    console.error("Git operation failed:", err);
    throw err;
  }
};
