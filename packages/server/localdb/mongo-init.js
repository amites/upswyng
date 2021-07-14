const { exec } = require("child_process");

db.createUser({
  user: "upswyng-dev-user",
  pwd: "upswyng123",
  roles: [
    {
      role: "readWrite",
      db: "upswyng-dev",
    },
  ],
});

exec("ls -la", (error, stdout, stderr) => {
  if (error) {
    console.log(`error: ${error.message}`);
    return;
  }
  if (stderr) {
    console.log(`stderr: ${stderr}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
});
