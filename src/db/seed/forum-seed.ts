import * as forum from "../forum/schema";
import { Transaction } from "./seed";
import {faker} from "@faker-js/faker";
import * as genshin from "../genshin/schema";

const randomWords = () => {
    const words = [];
    for (let i = 0; i < Math.floor(Math.random() * 5) + 1; i++) {
      words.push(`#${faker.lorem.word()}`);
    }
    return words;
  };
  
  const randomMessage = () => {
    return faker.lorem.sentences({ min: 1, max: 3 }, "\n");
  };
  
  const randomName = () => {
    const first_name = faker.person.firstName();
    const last_name = faker.person.lastName();
    const email = faker.internet.email({
      firstName: first_name,
      lastName: last_name,
    });
    const username = `${faker.word.adjective()}_${faker.word.noun()}`.replace(
      " ",
      ""
    );
    const bio = faker.person.bio();
  
    return {
      username: username.toLowerCase().replace("'", "''"),
      first_name: first_name.replace("'", "''"),
      last_name: last_name.replace("'", "''"),
      email: email.replace("'", "''"),
      bio: bio,
    };
  };

  export const addUsers = async (client: Transaction) => {
    const icons = await client.select().from(genshin.characters);
    const users = [] as typeof forum.users.$inferInsert[];
    for (let i = 0; i < 100; i++) {
      users.push({
        ...randomName(),
        avatar: icons[Math.floor(Math.random() * icons.length)].name,
      });
    }
    await client.insert(forum.users).values(users);
  };

export const forumSeed = async (db: Transaction) => {

}