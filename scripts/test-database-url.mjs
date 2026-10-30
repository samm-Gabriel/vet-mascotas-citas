export function withTestSchema(rawUrl, schemaHintUrl) {
  if (!rawUrl) {
    throw new Error("DATABASE_URL no definida");
  }
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
  return { url: parsed.toString(), testSchema };
}
