import fs from "fs";
import path from "path";
import { describe, expect, it } from "vitest";

const projectRoot = path.resolve(__dirname, "../..");

function findPageFiles(dir: string, acc: string[] = []): string[] {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      findPageFiles(full, acc);
    } else if (entry.name === "page.tsx") {
      acc.push(full);
    }
  }
  return acc;
}

const pageFiles = findPageFiles(path.join(projectRoot, "app"));

describe("Smoke páginas (#6)", () => {
  for (const filePath of pageFiles) {
    const rel = path.relative(projectRoot, filePath).replace(/\\/g, "/");
    const modulePath = `@/${rel.replace(/\.tsx$/, "")}`;

    it(`#6 exporta componente: ${rel}`, async () => {
      const mod = await import(modulePath);
      expect(typeof mod.default).toBe("function");
    });
  }

  it("#6 hay rutas principales registradas", () => {
    const relPaths = pageFiles.map((p) => path.relative(projectRoot, p).replace(/\\/g, "/"));
    expect(relPaths).toContain("app/page.tsx");
    expect(relPaths).toContain("app/(app)/dashboard/page.tsx");
    expect(relPaths).toContain("app/seleccionar-perfil/page.tsx");
  });
});
