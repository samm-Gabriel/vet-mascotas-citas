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
import { createDueno, getDueno, updateDueno } from "@/lib/api";

export default function DuenoForm() {
  const { id } = useParams<{ id?: string }>();
  const router = useRouter();
  const edit = Boolean(id);
  const [form, setForm] = useState({ nombre: "", email: "", telefono: "" });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    getDueno(Number(id))
      .then((d) =>
        setForm({
          nombre: d.nombre,
          email: d.email || "",
          telefono: d.telefono || "",
        }),
      )
      .catch((e) => setError(e.message));
  }, [id]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const body = {
      nombre: form.nombre,
      email: form.email || null,
      telefono: form.telefono || null,
    };
    const fn = edit
      ? updateDueno(Number(id), body)
      : createDueno(body);
    fn.then(() => router.push("/duenos"))
      .catch((e) => setError(e.message))
      .finally(() => setSaving(false));
  };

  return (
    <div className="mx-auto max-w-2xl">
      <Button variant="ghost" render={<Link href="/duenos" />}>
        <ArrowLeft data-icon="inline-start" />
        Volver
      </Button>
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>{edit ? "Editar dueño" : "Nuevo dueño"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="flex flex-col gap-5">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="flex flex-col gap-2">
              <Label htmlFor="nombre">Nombre *</Label>
              <Input
                id="nombre"
                required
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="telefono">Teléfono</Label>
              <Input
                id="telefono"
                value={form.telefono}
                onChange={(e) => setForm({ ...form, telefono: e.target.value })}
              />
            </div>
            <Button type="submit" disabled={saving}>
              {saving ? "Guardando..." : "Guardar dueño"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
