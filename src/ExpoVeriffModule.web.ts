import { createVeriffFrame, MESSAGES } from "@veriff/incontext-sdk";

export default {
   launchVeriff(token: string): Promise<string> {
      return new Promise((resolve, reject) => {
        createVeriffFrame({
          url: token,
          onEvent: (event: MESSAGES) => {
            switch (event) {
              case MESSAGES.FINISHED:
                resolve(token);
                break;
              default:
                reject(`${MESSAGES}`)
            }
          }
        })
      })
  },
};
