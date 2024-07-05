// eslint-disable-next-line require-await
export async function verifyAuthHandler (event) {
  if (
    event.request.privateChallengeParameters.secretLoginCode ===
    event.request.challengeAnswer
  ) {
    event.response.answerCorrect = true;
  } else {
    event.response.answerCorrect = false;
  }
  return event;
};
