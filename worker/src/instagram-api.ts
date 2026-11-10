/** Match the Graph endpoint to the authentication flow configured for this Worker. */
export const instagramGraphOrigin = (env: Pick<Env, 'INSTAGRAM_AUTH_MODE'>) =>
  env.INSTAGRAM_AUTH_MODE === 'facebook' ? 'https://graph.facebook.com' : 'https://graph.instagram.com';
