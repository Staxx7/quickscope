import { NextRequest } from 'next/server';
import { AuthorizationCode } from 'simple-oauth2';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');

  const client = new AuthorizationCode({
    client: {
      id: process.env.QBO_CLIENT_ID!,
      secret: process.env.QBO_CLIENT_SECRET!,
    },
    auth: {
      tokenHost: 'https://oauth.platform.intuit.com',
      tokenPath: '/oauth2/v1/tokens/bearer',
    },
  });

  try {
    const tokenParams = {
      code: code!,
      redirect_uri: process.env.QBO_REDIRECT_URI!,
    };

    const accessToken = await client.getToken(tokenParams);
    console.log('Access Token:', accessToken.token);

    return new Response('Success! You can close this tab.');
  } catch (err) {
    console.error('Callback Error:', err);
    return new Response('Auth failed.', { status: 500 });
  }
}

