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
  createCita,
  getCita,
  listMascotas,
  updateCita,
  type MascotaListItem,
} from "@/lib/api";

export default function CitaForm() {
  const { id } = useParams<{ id?: string }>();
  const router = useRouter();
  const edit = Boolean(id);
  const [f, setF] = useState({ mascotaId: "", fechaHora: "", motivo: "" });
  const [mascotas, setMascotas] = useState<MascotaListItem[]>([]);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    listMascotas()
      .then((r) => setMascotas(r.items))
      .catch((e) => setError(e.message));
    if (!id) return;
    getCita(Number(id))
      .then((c) =>
        setF({
          mascotaId: String(c.mascotaId),
          fechaHora: new Date(c.fechaHora).toISOString().slice(0, 16),
          motivo: c.motivo,
        }),
      )
      .catch((e) => setError(e.message));
  }, [id]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const body = {
      mascotaId: Number(f.mascotaId),
      fechaHora: new Date(f.fechaHora).toISOString(),
      motivo: f.motivo,
    };
    const fn = edit ? updateCita(Number(id), body) : createCita(body);
    fn.then(() => router.push("/citas"))
      .catch((e) => setError(e.message))
      .finally(() => setSaving(false));
  };

  return (
    <div className="mx-auto max-w-2xl">
      <Button variant="ghost" render={<Link href="/citas" />}>
        <ArrowLeft data-icon="inline-start" />
        Volver
      </Button>
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>{edit ? "Editar cita" : "Nueva cita"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="flex flex-col gap-5">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="flex flex-col gap-2">
              <Label>Mascota *</Label>
              <select
                required
                className="h-9 rounded-lg border bg-background px-3 text-sm"
                value={f.mascotaId}
                onChange={(e) => setF({ ...f, mascotaId: e.target.value })}
              >
                <option value="">Selecciona una mascota</option>
                {mascotas.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.nombre} — {m.dueno?.nombre || m.especie}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <Label>Fecha y hora *</Label>
              <Input
                required
                type="datetime-local"
                value={f.fechaHora}
                onChange={(e) => setF({ ...f, fechaHora: e.target.value })}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Motivo *</Label>
              <textarea
                required
                maxLength={500}
                className="min-h-28 rounded-lg border bg-background px-3 py-2 text-sm"
                value={f.motivo}
                onChange={(e) => setF({ ...f, motivo: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">Máximo 500 caracteres.</p>
            </div>
            <Button type="submit" disabled={saving}>
              {saving ? "Guardando..." : "Guardar cita"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
