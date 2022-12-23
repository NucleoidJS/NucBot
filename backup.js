const fs = require("fs");
const { execSync } = require("child_process");
const repos = require("./repos.json");

const homedir = require("os").homedir();
const date = new Date().toISOString().slice(0, 10);

if (!fs.existsSync(`${homedir}/backups/${date}`)) {
  fs.mkdirSync(`${homedir}/backups/${date}`, {
    recursive: true,
  });
}

repos.forEach((repo) => {
  execSync(`git clone --mirror https://github.com/NucleoidJS/${repo}`);
  execSync(`tar -czvf ${repo}.tar.gz ${repo}/`);
  execSync(`rm -Rf ${repo}`);
  execSync(`mv ${repo}.tar.gz ${homedir}/backups/${date}/`);
});

execSync(`aws s3 sync ${homedir}/backups/ s3://backups.nucleoid.com/GitHub/`);
