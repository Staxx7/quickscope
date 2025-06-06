import { NextRequest } from 'next/server';
import { AuthorizationCode } from 'simple-oauth2';

export async function GET(req: NextRequest) {
  const client = new AuthorizationCode({
    client: {
      id: process.env.QBO_CLIENT_ID!,
      secret: process.env.QBO_CLIENT_SECRET!,
    },
    auth: {
      tokenHost: 'https://oauth.platform.intuit.com',
      authorizePath: '/oauth2/v1/tokens/bearer',
      tokenPath: '/oauth2/v1/tokens/bearer',
    },
  });

  const authorizationUri = client.authorizeURL({
    redirect_uri: process.env.QBO_REDIRECT_URI!,
    scope: 'com.intuit.quickbooks.accounting openid profile email',
    state: 'randomstate123',
  });

  return Response.redirect(authorizationUri);
}
