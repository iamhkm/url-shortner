export async function createAuthHandler (event) {
  let secretLoginCode = 12345;
  const previousChallenge = event.request.session.slice(-1)[0];
  secretLoginCode = previousChallenge.challengeMetadata?.match(/CODE-(\d*)/)?.[1];
  event.response.publicChallengeParameters = {
    email: event.request.userAttributes.email,
  };
  event.response.privateChallengeParameters = { secretLoginCode };
  event.response.challengeMetadata = `CODE-${secretLoginCode}`;
  return event;
};
