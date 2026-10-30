"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CalendarDays, Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { deleteCita, listCitas, type CitaListItem } from "@/lib/api";

export default function CitasPage() {
  const [items, setItems] = useState<CitaListItem[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    listCitas()
      .then((r) => setItems(r.items))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-medium text-primary">Organización</p>
          <h1 className="text-3xl font-bold">Agenda</h1>
          <p className="mt-1 text-muted-foreground">
            Revisa las próximas citas de la clínica.
          </p>
        </div>
        <Button render={<Link href="/citas/nuevo" />}>
          <Plus data-icon="inline-start" />
          Nueva cita
        </Button>
      </div>
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="size-5" />
            Citas programadas
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-48 w-full" />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha y hora</TableHead>
                  <TableHead>Mascota</TableHead>
                  <TableHead>Dueño</TableHead>
                  <TableHead>Motivo</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-medium">
                      {new Date(c.fechaHora).toLocaleString("es-ES")}
                    </TableCell>
                    <TableCell>{c.mascota?.nombre || c.mascotaId}</TableCell>
                    <TableCell>{c.mascota?.dueno?.nombre || "—"}</TableCell>
                    <TableCell className="max-w-xs truncate">{c.motivo}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        render={<Link href={`/citas/${c.id}/editar`} />}
                      >
                        <Pencil />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          deleteCita(c.id)
                            .then(load)
                            .catch((e) => setError(e.message))
                        }
                      >
                        <Trash2 />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
