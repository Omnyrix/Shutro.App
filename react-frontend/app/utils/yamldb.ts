import fs from "fs";
import yaml from "js-yaml";
import bcrypt from "bcryptjs";

const USERS_PATH = "../users.yml";

export function getUsers() {
  const file = fs.readFileSync(USERS_PATH, "utf8");
  const data = yaml.load(file) as any;
  return data.users || [];
}

export function addUser(username: string, password: string) {
  const users = getUsers();
  const hash = bcrypt.hashSync(password, 10);
  users.push({ username, password: hash });
  const newYaml = yaml.dump({ users });
  fs.writeFileSync(USERS_PATH, newYaml, "utf8");
}

export function validateUser(username: string, password: string) {
  const users = getUsers();
  const user = users.find((u: any) => u.username === username);
  if (!user) return false;
  return bcrypt.compareSync(password, user.password);
}