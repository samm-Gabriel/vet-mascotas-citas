"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Building2, Stethoscope } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { listPerfiles, type Perfil } from "@/lib/api";
import { usePerfil } from "@/hooks/use-perfil";

export default function SeleccionarPerfil() {
  const router = useRouter();
  const { guardarPerfil } = usePerfil();
  const [perfiles, setPerfiles] = useState<Perfil[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listPerfiles({ activo: true })
      .then((r) => setPerfiles(r.items))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/30 p-6">
      <div className="w-full max-w-4xl">
        <div className="mb-10 text-center">
          <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
            <Stethoscope />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">
            Bienvenido a Vet Mascotas
          </h1>
          <p className="mt-2 text-muted-foreground">
            Selecciona el perfil con el que quieres trabajar
          </p>
        </div>
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {loading ? (
          <div className="grid gap-4 md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-44 rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-3">
            {perfiles.map((p) => (
              <Card
                key={p.id}
                className="cursor-pointer transition hover:-translate-y-1 hover:border-primary hover:shadow-lg"
                onClick={() => {
                  guardarPerfil(p.id, p.nombre);
                  router.push("/dashboard");
                }}
              >
                <CardHeader>
                  <Building2 className="mb-3 size-7 text-primary" />
                  <CardTitle>{p.nombre}</CardTitle>
                  <CardDescription>{p.slug}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {p.descripcion ||
                      "Perfil de trabajo para la clínica veterinaria."}
                  </p>
                  <div className="mt-5 flex items-center gap-2 text-sm font-medium text-primary">
                    Entrar al perfil <ArrowRight className="size-4" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
