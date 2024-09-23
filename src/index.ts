import ExpoVeriffModule from "./ExpoVeriffModule";

export async function launchVeriff(token: string) {
  return await ExpoVeriffModule.launchVeriff(token);
}

export default {};
