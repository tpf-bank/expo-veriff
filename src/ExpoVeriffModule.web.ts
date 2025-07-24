import { createVeriffFrame, MESSAGES } from "@veriff/incontext-sdk";

export default {
  launchVeriff(token: string): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        createVeriffFrame({
          url: token,
          lang: "en",
          onEvent: (event: MESSAGES) => {
            switch (event) {
              case MESSAGES.FINISHED:
                resolve(token);
                break;
              case MESSAGES.CANCELED:
                reject(new Error("Veriff session was canceled"));
                break;
              default:
                // Handle other events silently
                break;
            }
          },
        });
      } catch (error) {
        reject(
          new Error(
            `Failed to create Veriff frame: ${error instanceof Error ? error.message : "Unknown error"}`,
          ),
        );
      }
    });
  },
};
