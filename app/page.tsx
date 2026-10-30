"use client";

import { Suspense, useEffect } from "react";
import { useRouter } from "next/navigation";

function HomeRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace(
      localStorage.getItem("vet-perfil-id")
        ? "/dashboard"
        : "/seleccionar-perfil",
    );
  }, [router]);
  return null;
}

export default function Page() {
  return (
    <Suspense fallback={null}>
      <HomeRedirect />
    </Suspense>
  );
}
