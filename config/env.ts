function requireEnv(name: string, value: string | undefined): string {
  if (!value) throw new Error(`Missing env var: ${name}`);
  return value;
}

export const ENV = {
  TOKEN_KEY: requireEnv("TOKEN_KEY", process.env.EXPO_PUBLIC_TOKEN_KEY),
  USER_KEY: requireEnv("USER_KEY", process.env.EXPO_PUBLIC_USER_KEY),
};
