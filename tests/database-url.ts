export function withTestSchema(rawUrl: string, schemaHintUrl?: string): string {
  const parsed = new URL(rawUrl);
  if (!parsed.searchParams.get("schema") && schemaHintUrl) {
    const hint = new URL(schemaHintUrl);
    const hintSchema = hint.searchParams.get("schema");
    if (hintSchema) {
      parsed.searchParams.set("schema", hintSchema);
    }
  }
  const schema = parsed.searchParams.get("schema") || "public";
  const testSchema = schema.endsWith("_test") ? schema : `${schema}_test`;
  parsed.searchParams.set("schema", testSchema);
  return parsed.toString();
}

export function applyTestDatabaseEnv(): { databaseUrl: string; directUrl: string } {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL no definida para pruebas");
  }
  const directSource = process.env.DIRECT_URL ?? databaseUrl;
  const testDirectUrl = withTestSchema(directSource, directSource);
  const testDatabaseUrl = withTestSchema(databaseUrl, directSource);
  process.env.DATABASE_URL = testDatabaseUrl;
  process.env.DIRECT_URL = testDirectUrl;
  return { databaseUrl: testDatabaseUrl, directUrl: testDirectUrl };
}

export function testSchemaName(): string {
  const directSource = process.env.DIRECT_URL ?? process.env.DATABASE_URL ?? "";
  const parsed = new URL(withTestSchema(directSource, directSource));
  return parsed.searchParams.get("schema") || "public_test";
}
