import google from "@googleapis/people";

export async function getUserInfo(accessToken) {
  try {
    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token: accessToken });
    const people = google.people({ version: 'v1', auth });
    const response = await people.people.get({
      resourceName: 'people/me',
      personFields: 'names,emailAddresses,photos',
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching user info:', error);
  }
}
