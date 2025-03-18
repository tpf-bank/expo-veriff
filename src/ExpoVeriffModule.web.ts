import { createVeriffFrame, MESSAGES } from "@veriff/incontext-sdk";

export default {
   launchVeriff(token: string): Promise<string> {
      return new Promise((resolve, reject) => {
        createVeriffFrame({
          url: token,
          lang: 'en',
          onEvent: (event: MESSAGES) => {
            switch (event) {
              case MESSAGES.FINISHED:
                resolve(token);
                break;
              case MESSAGES.CANCELED:
                reject(MESSAGES)
                break;
              default:
                break;
            }
          }
        })
      })
  },
};
