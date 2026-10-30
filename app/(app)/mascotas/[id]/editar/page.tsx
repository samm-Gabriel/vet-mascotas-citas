"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  createMascota,
  getMascota,
  listDuenos,
  updateMascota,
  type Dueno,
} from "@/lib/api";

export default function MascotaForm() {
  const { id } = useParams<{ id?: string }>();
  const router = useRouter();
  const edit = Boolean(id);
  const [f, setF] = useState({ nombre: "", especie: "", raza: "", duenoId: "" });
  const [duenos, setDuenos] = useState<Dueno[]>([]);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    listDuenos()
      .then((r) => setDuenos(r.items))
      .catch((e) => setError(e.message));
    if (!id) return;
    getMascota(Number(id))
      .then((m) =>
        setF({
          nombre: m.nombre,
          especie: m.especie,
          raza: m.raza || "",
          duenoId: String(m.duenoId),
        }),
      )
      .catch((e) => setError(e.message));
  }, [id]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const body = {
      nombre: f.nombre,
      especie: f.especie,
      raza: f.raza || null,
      duenoId: Number(f.duenoId),
    };
    const fn = edit
      ? updateMascota(Number(id), body)
      : createMascota(body);
    fn.then(() => router.push("/mascotas"))
      .catch((e) => setError(e.message))
      .finally(() => setSaving(false));
  };

  return (
    <div className="mx-auto max-w-2xl">
      <Button variant="ghost" render={<Link href="/mascotas" />}>
        <ArrowLeft data-icon="inline-start" />
        Volver
      </Button>
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>{edit ? "Editar mascota" : "Nueva mascota"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="flex flex-col gap-5">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="flex flex-col gap-2">
              <Label>Nombre *</Label>
              <Input
                required
                value={f.nombre}
                onChange={(e) => setF({ ...f, nombre: e.target.value })}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Especie *</Label>
              <Input
                required
                value={f.especie}
                onChange={(e) => setF({ ...f, especie: e.target.value })}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Raza</Label>
              <Input
                value={f.raza}
                onChange={(e) => setF({ ...f, raza: e.target.value })}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Dueño *</Label>
              <select
                required
                className="h-9 rounded-lg border bg-background px-3 text-sm"
                value={f.duenoId}
                onChange={(e) => setF({ ...f, duenoId: e.target.value })}
              >
                <option value="">Selecciona un dueño</option>
                {duenos.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.nombre}
                  </option>
                ))}
              </select>
            </div>
            <Button type="submit" disabled={saving}>
              {saving ? "Guardando..." : "Guardar mascota"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
