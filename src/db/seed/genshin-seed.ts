import { characters, cities, elements } from "../migrations/schema";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "../migrations/schema";
import * as relations from "../migrations/relations";
import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd(), true);
const connectionString = process.env.DATABASE_URL;

const client = postgres(connectionString as string);

const db = drizzle(client, {
  schema: { ...schema, ...relations },
  logger: true,
});
const genshinSeed = async () => {
  await db.delete(characters).execute();
  await db.delete(cities).execute();
  await db.delete(elements).execute();
  const element_result = await db
    .insert(elements)
    .values([
      {
        name: "Anemo",
        colour: "#74c2a8",
      },
      {
        name: "Cryo",
        colour: "#9fd6e3",
      },
      {
        name: "Electro",
        colour: "#af8ec1",
      },
      {
        name: "Hydro",
        colour: "#4cc2f1",
      },
      {
        name: "Pyro",
        colour: "#ef7938",
      },
      {
        name: "Dendro",
        colour: "#a5c83b",
      },
      {
        name: "Geo",
        colour: "#fab632",
      },
    ])
    .returning();
  const city_result = await db
    .insert(cities)
    .values([
      {
        name: "Mondstadt",
      },
      {
        name: "Liyue",
      },
      {
        name: "Inazuma",
      },
      {
        name: "Sumeru",
      },
      {
        name: "Fontaine",
      },
    ])
    .returning();

  const character_result = await db
    .insert(characters)
    .values([
      {
        name: "Albedo",
        description: [
          `Albedo — an alchemist based in Mondstadt, in the service of the Knights of Favonius.`,
          `"Genius," "Kreideprinz," or "Captain of the Investigation Team"... Such titles and honors are of no consequence to him when there is so much more research to conduct.`,
          `The pursuit of fortune and connections cannot hold a candle to his heart's desire — acquiring the limitless, obscure knowledge left behind by previous generations of scholars.`,
        ],
        element_id: element_result.find((e) => e.name === "Geo")?.id!,
        city_id: city_result.find((c) => c.name === "Mondstadt")?.id!,
      },
      {
        name: "Alhaitham",
        description: [
          `The current scribe of the Sumeru Akademiya, a man endowed with extraordinary intelligence and talent.`,
          `He lives free — free from the searching eyes of ordinary people, anyway.`,
        ],
        element_id: element_result.find((e) => e.name === "Dendro")?.id!,
        city_id: city_result.find((c) => c.name === "Sumeru")?.id!,
      },
      {
        name: "Arataki Itto",
        description: [
          `Fast as the wind and mighty as thunder, he is an intrepid man with Oni blood running through his veins.`,
        ],
        element_id: element_result.find((e) => e.name === "Geo")?.id!,
        city_id: city_result.find((c) => c.name === "Inazuma")?.id!,
      },
      {
        name: "Baizhu",
        description: [
          `The owner of Bubu Pharmacy, the finest pharmacy in all of Liyue.`,
          `He is rarely seen without a white snake named Changsheng coiled around his shoulders.`,
          `His prescriptions are varied and diverse, and his medical prowess and compassion are known throughout Teyvat.`,
        ],
        element_id: element_result.find((e) => e.name === "Dendro")?.id!,
        city_id: city_result.find((c) => c.name === "Liyue")?.id!,
      },
      {
        name: "Chiori",
        description: [
          `A frank and outspoken fashion designer whose unique sense of style always puts her at the forefront of Fontainian trends.`,
        ],
        element_id: element_result.find((e) => e.name === "Geo")?.id!,
        city_id: city_result.find((c) => c.name === "Fontaine")?.id!,
      },
      {
        name: "Cyno",
        description: [
          `The General Mahamatra of the Akademiya, leader of all the Matras.`,
          `He has a unique sense of humor that never fails to leave a deep impression.`,
        ],
        element_id: element_result.find((e) => e.name === "Electro")?.id!,
        city_id: city_result.find((c) => c.name === "Sumeru")?.id!,
      },
      {
        name: "Dehya",
        description: [
          `A member of "The Eremites," a loosely-organized mercenary organization.`,
          `She is brave, powerful, and enjoys an excellent reputation among mercenaries.`,
        ],
        element_id: element_result.find((e) => e.name === "Pyro")?.id!,
        city_id: city_result.find((c) => c.name === "Sumeru")?.id!,
      },
      {
        name: "Diluc",
        description: [
          `As the wealthiest gentleman in Mondstadt, the ever-dapper Diluc always presents himself as the epitome of perfection.`,
          `But behind the courteous visage burns a zealous soul that has sworn to protect Mondstadt at all costs, allowing him to mercilessly vanquish all who threaten his city.`,
        ],
        element_id: element_result.find((e) => e.name === "Pyro")?.id!,
        city_id: city_result.find((c) => c.name === "Mondstadt")?.id!,
      },
      {
        name: "Eula",
        description: [
          `A rebellious descendant of the old aristocracy who is always out on the battlefield.`,
          `As one born into the old aristocracy, carrying the bloodline of sinners, Eula has needed a unique approach to the world to navigate the towering walls of prejudice peacefully.`,
          `Of course, this did not prevent her from severing ties with her clan.`,
          `As the outstanding Spindrift Knight, she hunts down Mondstadt's enemies in the wild to exact her unique "vengeance."`,
        ],
        element_id: element_result.find((e) => e.name === "Cryo")?.id!,
        city_id: city_result.find((c) => c.name === "Mondstadt")?.id!,
      },
      {
        name: "Furina",
        description: [
          `The "Regina of All Waters, Kindreds, Peoples and Laws" is deeply loved by her people.`,
          `She follows each and every trial held at the Opera Epiclese with an inextinguishable passion, and is always acutely aware of how the "audience" sees things.`,
        ],
        element_id: element_result.find((e) => e.name === "Hydro")?.id!,
        city_id: city_result.find((c) => c.name === "Fontaine")?.id!,
      },
      {
        name: "Ganyu",
        description: [
          `The secretary to the Liyue Qixing. The blood of both human and illuminated beast flows within her veins.`,
          `Graceful and quiet by nature, yet the gentle disposition of qilin sees not even the slightest conflict with even the most arduous of workloads.`,
          `After all, Ganyu firmly believes that all the work she does is in honor of her contract with Rex Lapis, seeking the well-being of all living things within Liyue.`,
        ],
        element_id: element_result.find((e) => e.name === "Cryo")?.id!,
        city_id: city_result.find((c) => c.name === "Liyue")?.id!,
      },
      {
        name: "Hu Tao",
        description: [
          `Hu Tao is the 77th Director of the Wangsheng Funeral Parlor, a person vital to managing Liyue's funerary affairs.`,
          `She does her utmost to flawlessly carry out a person's last rites and preserve the world's balance of yin and yang.`,
          `Aside from this, she is also a talented poet whose many "masterpieces" have passed around Liyue's populace by word of mouth.`,
        ],
        element_id: element_result.find((e) => e.name === "Pyro")?.id!,
        city_id: city_result.find((c) => c.name === "Liyue")?.id!,
      },
      {
        name: "Jean",
        description: [
          `As the Acting Grand Master of the Knights, Jean has always been devoted to her duties and maintaining peace in Mondstadt.`,
          `She had taken precautions long before the onset of Stormterror's assault, and she will guard Mondstadt with her life as always.`,
        ],
        element_id: element_result.find((e) => e.name === "Anemo")?.id!,
        city_id: city_result.find((c) => c.name === "Mondstadt")?.id!,
      },
      {
        name: "Kaedehara Kazuha",
        description: [
          `A wandering samurai from Inazuma with a modest and gentle personality. Beneath a youthful and carefree demeanor lies a heart that hides a great many burdens from the past.`,
          `Seemingly easygoing, Kazuha has his own code of conduct.`,
        ],
        element_id: element_result.find((e) => e.name === "Anemo")?.id!,
        city_id: city_result.find((c) => c.name === "Inazuma")?.id!,
      },
      {
        name: "Kamisato Ayaka",
        description: [
          `Daughter of the Yashiro Commission's Kamisato Clan from Inazuma. Dignified and elegant, wise and determined.`,
          `Sincere and pleasant to others.`,
          `Universally loved by the Inazuma people, she has earned the title of Shirasagi Himegimi.`,
        ],
        element_id: element_result.find((e) => e.name === "Cryo")?.id!,
        city_id: city_result.find((c) => c.name === "Inazuma")?.id!,
      },
      {
        name: "Kamisato Ayato",
        description: [
          `Current head of the Kamisato Clan and, accordingly, the Yashiro Commissioner.`,
          `He always has a way of attaining his purpose in a well-thought-out manner.`,
          `However, few people understand what that "goal" he holds most dear is.`,
        ],
        element_id: element_result.find((e) => e.name === "Hydro")?.id!,
        city_id: city_result.find((c) => c.name === "Inazuma")?.id!,
      },
      {
        name: "Keqing",
        description: [
          `Keqing has much to say about Rex Lapis' unilateral approach to policymaking in Liyue ⁠— but in truth, gods admire skeptics such as her quite a lot.`,
          `She firmly believes that humanity's future should be determined by humans themselves, and that they can even do better than the archons and adepti have done for them.`,
          `In order to prove this, she works harder than anyone else.`,
        ],
        element_id: element_result.find((e) => e.name === "Electro")?.id!,
        city_id: city_result.find((c) => c.name === "Liyue")?.id!,
      },
      {
        name: "Klee",
        description: [
          `Knights of Favonius Spark Knight! Forever with a bang and a flash!`,
          `—And then disappearing from the stern gaze of Acting Grand Master Jean.`,
          `Sure, time in solitary confinement gives lots of time to think about new gunpowder formulas...`,
          `But it'd still be better to not be in solitary in the first place.`,
        ],
        element_id: element_result.find((e) => e.name === "Pyro")?.id!,
        city_id: city_result.find((c) => c.name === "Mondstadt")?.id!,
      },
      {
        name: "Lyney",
        description: [
          `A genius of a magician famed throughout Fontaine.`,
          `He moves his audience with a combination of sleight of hand and the gift of the gab.`,
          `Eloquent, ingenious, and with a mind as hard to fathom as a cat.`,
        ],
        element_id: element_result.find((e) => e.name === "Pyro")?.id!,
        city_id: city_result.find((c) => c.name === "Fontaine")?.id!,
      },
      {
        name: "Mona",
        description: [
          `A mysterious young astrologer who proclaims herself to be "Astrologist Mona Megistus," and who possesses abilities to match the title.`,
          `Erudite, but prideful.`,
          `Though she is often strapped for cash and lives a life of thrift, she is resolved to never use astrology for profit...`,
          `It is this very resolution that has caused her to constantly fret about money.`,
        ],
        element_id: element_result.find((e) => e.name === "Hydro")?.id!,
        city_id: city_result.find((c) => c.name === "Mondstadt")?.id!,
      },
      {
        name: "Nahida",
        description: [
          `Lesser Lord Kusanali dwells deep in the Sanctuary of Surasthana, and has never really been in the limelight, nor has she even been mentioned much.`,
          `Her burden is heavy, but though she may experience loneliness, and though darkness is all she sees before her, she will not stop moving forward.`,
        ],
        element_id: element_result.find((e) => e.name === "Dendro")?.id!,
        city_id: city_result.find((c) => c.name === "Sumeru")?.id!,
      },
      {
        name: "Navia",
        description: [
          `The ever-beaming President of the Spina di Rosula, devoted to helping the people of Fontaine solve all kinds of thorny issues.`,
        ],
        element_id: element_result.find((e) => e.name === "Geo")?.id!,
        city_id: city_result.find((c) => c.name === "Fontaine")?.id!,
      },
      {
        name: "Neuvillette",
        description: [
          `You wouldn't exactly describe the Iudex of Fontaine as "approachable."`,
          `It's hard to say whether it's just in his nature, or because he has secrets to hide.`,
        ],
        element_id: element_result.find((e) => e.name === "Hydro")?.id!,
        city_id: city_result.find((c) => c.name === "Fontaine")?.id!,
      },
      {
        name: "Nilou",
        description: [
          `Star of the Zubayr Theater.`,
          `Her dance is as graceful as a water lily in first bloom, pure and pristine.`,
          `But she is by no means a haughty and cold person.`,
          `Even the most hurried traveler will not forget her innocent and radiant smile.`,
        ],
        element_id: element_result.find((e) => e.name === "Hydro")?.id!,
        city_id: city_result.find((c) => c.name === "Sumeru")?.id!,
      },
      {
        name: "Qiqi",
        description: [
          `An apprentice and herb gatherer at Bubu Pharmacy.`,
          `"Blessed" by the adepti with a body that cannot die, this petite zombie cannot do anything without first giving herself orders to do it.`,
          `Qiqi's memory is like a sieve.`,
          `Out of necessity, she always carries around a notebook in which she writes anything important that she is sure to forget later.`,
          `But on her worst days, she even forgets to look at her notebook..`,
        ],
        element_id: element_result.find((e) => e.name === "Cryo")?.id!,
        city_id: city_result.find((c) => c.name === "Liyue")?.id!,
      },
      {
        name: "Raiden Shogun",
        description: [
          `The Raiden Shogun is the awesome and terrible power of thunder incarnate, the exalted ruler of the Inazuma Shogunate.`,
          `With the might of lightning at her disposal, she commits herself to the solitary pursuit of eternity.`,
        ],
        element_id: element_result.find((e) => e.name === "Electro")?.id!,
        city_id: city_result.find((c) => c.name === "Inazuma")?.id!,
      },
      {
        name: "Sangonomiya Kokomi",
        description: [
          `Kokomi is the Divine Priestess of Watatsumi Island, and also serves as its supreme leader.`,
          `She is well-versed in the art of war, is good at strategizing, and has keen insights into military affairs.`,
          `She is also adept at handling domestic affairs, diplomacy, and other matters.`,
          `Still, this unfathomable leader has a mysterious side to her...`,
        ],
        element_id: element_result.find((e) => e.name === "Hydro")?.id!,
        city_id: city_result.find((c) => c.name === "Inazuma")?.id!,
      },
      {
        name: "Shenhe",
        description: [
          `Even though she was born in the human world, she ended up being an adepti disciple.`,
          `She grew up in the mountains far away from Liyue Harbor, her soul bound with red ropes, training both her body and mind.`,
          `Despite having the elegant temperament of an adeptus, she seems to be shrouded in mystery.`,
        ],
        element_id: element_result.find((e) => e.name === "Cryo")?.id!,
        city_id: city_result.find((c) => c.name === "Liyue")?.id!,
      },
      {
        name: "Tartaglia",
        description: [
          `Meet Tartaglia — the cunning Snezhnayan whose unpredictable personality keeps people guessing his every move.`,
          `Don't be under any illusion as to what he might be thinking or what his intentions are.`,
          `Just remember this: Behind that innocent, childlike exterior lies a finely honed instrument of war.`,
        ],
        element_id: element_result.find((e) => e.name === "Hydro")?.id!,
        city_id: city_result.find((c) => c.name === "Liyue")?.id!,
      },
      {
        name: "Tighnari",
        description: [
          `An Avidya Forest Watcher and botanical scholar who graduated from Amurta.`,
          `He leads a fruitful life of patrolling the rainforest, protecting the ecology, and lecturing fools every day.`,
        ],
        element_id: element_result.find((e) => e.name === "Dendro")?.id!,
        city_id: city_result.find((c) => c.name === "Sumeru")?.id!,
      },
      {
        name: "Venti",
        description: [
          `A bard that seems to have arrived on some unknown wind — sometimes sings songs as old as the hills, and other times sings poems fresh and new.`,
          `Likes apples and lively places but is not a fan of cheese or anything sticky.`,
          `When using his Anemo power to control the wind, it often appears as feathers, as he's fond of that which appears light and breezy.`,
        ],
        element_id: element_result.find((e) => e.name === "Anemo")?.id!,
        city_id: city_result.find((c) => c.name === "Mondstadt")?.id!,
      },
      {
        name: "Wanderer",
        description: [
          `If the measure of humanity is having a heart, then he cannot be deemed as such.`,
          `If one without a heart experiences joy and sorrow, then he shall be a puppet most alike to humanity.`,
        ],
        element_id: element_result.find((e) => e.name === "Anemo")?.id!,
        city_id: city_result.find((c) => c.name === "Sumeru")?.id!,
      },
      {
        name: "Wriothesley",
        description: [
          `Administrator of the Fortress of Meropide, he was given Fontaine's highest honorary title of "Duke."`,
          `Both low-profile and dependable.`,
        ],
        element_id: element_result.find((e) => e.name === "Cryo")?.id!,
        city_id: city_result.find((c) => c.name === "Fontaine")?.id!,
      },
      {
        name: "Xianyun",
        description: [
          `A mysterious woman who has just moved to Liyue Harbor and claims to be reserved, quiet, and socially inept.`,
        ],
        element_id: element_result.find((e) => e.name === "Anemo")?.id!,
        city_id: city_result.find((c) => c.name === "Liyue")?.id!,
      },
      {
        name: "Xiao",
        description: [
          `One of the mighty and illuminated adepti guarding Liyue, also heralded as the "Vigilant Yaksha."`,
          `Despite his youthful appearance, tales of his exploits have been documented for millennia.`,
          `He is especially fond of Wangshu Inn's Almond Tofu.`,
          `This is because it tastes just like the sweet dreams he used to devour.`,
        ],
        element_id: element_result.find((e) => e.name === "Anemo")?.id!,
        city_id: city_result.find((c) => c.name === "Liyue")?.id!,
      },
      {
        name: "Yae Miko",
        description: [
          `The head shrine maiden in charge of Grand Narukami Shrine and a descendant of Kitsune lineage, Eternity's servant and friend, and the intimidating editor-in-chief of Yae Publishing House, a publisher of light novels...`,
        ],
        element_id: element_result.find((e) => e.name === "Electro")?.id!,
        city_id: city_result.find((c) => c.name === "Inazuma")?.id!,
      },
      {
        name: "Yelan",
        description: [
          `A mysterious person who claims to work for the Ministry of Civil Affairs, but is a "non-entity" on the Ministry of Civil Affairs' list.`,
          `Elusive, enigmatic, erratic - all of these are Yelan's hallmarks.`,
        ],
        element_id: element_result.find((e) => e.name === "Hydro")?.id!,
        city_id: city_result.find((c) => c.name === "Liyue")?.id!,
      },
      {
        name: "Yoimiya",
        description: [
          `A talented pyrotechnician.`,
          `The current owner of Naganohara Fireworks known as the "Queen of the Summer Festival."`,
          `A girl filled with fiery passion.`,
          `The uncompromising childish innocence and the obsession with craftsmanship intertwine in her to create a spectacular blaze.`,
        ],
        element_id: element_result.find((e) => e.name === "Pyro")?.id!,
        city_id: city_result.find((c) => c.name === "Inazuma")?.id!,
      },
      {
        name: "Zhongli",
        description: [
          `Wangsheng Funeral Parlor's mysterious consultant.`,
          `Handsome, elegant, and surpassingly learned.`,
          `Though no one knows where Zhongli is from, he is a master of courtesy and rules.`,
          `From his seat at Wangsheng Funeral Parlor, he performs all manner of rituals.`,
        ],
        element_id: element_result.find((e) => e.name === "Geo")?.id!,
        city_id: city_result.find((c) => c.name === "Liyue")?.id!,
      },
    ])
    .returning();
};
const main = async () => {
  if (process.env.SEED !== "true") {
    console.log("Skipping seed");
    return;
  }
  console.log("Seeding database...");

  try {
    await db.transaction(async (db) => {
      await genshinSeed();
    });
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
  console.log("Seeding complete");
  process.exit(0);
};

main();
