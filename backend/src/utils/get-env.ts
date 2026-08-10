export const getEnv = (key: string, defaultValue?: string): string => {
  const raw = process.env[key];

  if (raw === undefined || raw === "") {
    if (defaultValue !== undefined) {
      return defaultValue;
    }
    throw new Error(`Environment variable ${key} is not set`);
  }

  // Strip quotes often pasted into Render/Vercel dashboards: "value" or 'value'
  return raw.trim().replace(/^(['"])(.*)\1$/, "$2");
};
