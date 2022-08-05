const { get } = require("axios").default;
const discordContributors = require("./discord.json");

const repos = ["Nucleoid", "IDE", "nucleoid.com", "docs"];
const contributors = [
  {
    id: 110643717,
    login: "NucBot",
  },
];

const getContributors = async (repo) => {
  const { data } = await get(
    `https://api.github.com/repos/NucleoidJS/${repo}/contributors`
  );

  contributors.push(...data);
};

const getContributorsFromIssues = async (repo) => {
  const { data } = await get(
    `https://api.github.com/repos/NucleoidJS/${repo}/issues`
  );

  const users = data.map((issue) => issue.user);
  contributors.push(...users);
};

const generateTable = (contributors) => {
  let i = 1;
  let html = "<table><tr>";

  for (const { id, login } of contributors.values()) {
    if (i % 8 === 0) {
      html += "</tr><tr>";
    }

    html += '<td align="center">';
    html += `<a href="https://github.com/${login}">`;
    html += `<img src="https://avatars.githubusercontent.com/u/${id}?v=4&s=100" width="100px;" alt="User ${login}"/>`;
    html += "<br/>";
    html += `<sub>${login}</sub>`;
    html += "</a>";
    html += "</td>";

    i++;
  }

  return html + "</tr></table>";
};

async function generate() {
  for (const repo of repos) {
    await getContributors(repo);
    await getContributorsFromIssues(repo);
  }

  contributors.push(...discordContributors);

  const map = new Map();
  contributors.forEach((contributor) => {
    map.set(contributor.id, contributor);
  });

  return generateTable(map);
}

generate().then((table) => console.log(table));
