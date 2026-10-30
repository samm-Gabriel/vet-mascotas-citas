'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { CalendarDays, LayoutDashboard, LogOut, Menu, PawPrint, Stethoscope, UserRound, UsersRound } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { usePerfil } from '@/hooks/use-perfil'
import { useEffect, useState } from 'react'

const items = [
  { href: '/dashboard', label: 'Tablero', icon: LayoutDashboard },
  { href: '/duenos', label: 'Dueños', icon: UsersRound },
  { href: '/mascotas', label: 'Mascotas', icon: PawPrint },
  { href: '/citas', label: 'Agenda', icon: CalendarDays },
]

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { perfil, limpiarPerfil } = usePerfil()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!localStorage.getItem('vet-perfil-id')) {
      router.replace('/seleccionar-perfil')
    }
  }, [router])

  const cambiar = () => {
    limpiarPerfil()
    router.push('/seleccionar-perfil')
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 border-r bg-background p-5 transition-transform lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Stethoscope />
          </div>
          <div>
            <p className="font-semibold">Vet Mascotas</p>
            <p className="text-xs text-muted-foreground">Gestión de citas</p>
          </div>
        </div>
        <Separator className="my-6" />
        <nav className="flex flex-col gap-2">
          {items.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${pathname.startsWith(href) ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}
            >
              <Icon data-icon="inline-start" />
              {label}
            </Link>
          ))}
        </nav>
        <div className="absolute inset-x-5 bottom-5 rounded-xl border bg-muted/40 p-3">
          <p className="text-xs text-muted-foreground">Perfil activo</p>
          <p className="mt-1 truncate text-sm font-medium">{perfil?.nombre || 'Cargando...'}</p>
          <Button variant="ghost" size="sm" className="mt-2 w-full justify-start px-0" onClick={cambiar}>
            <LogOut data-icon="inline-start" />
            Cambiar perfil
          </Button>
        </div>
      </aside>
      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/95 px-4 backdrop-blur md:px-8">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setOpen(!open)}
            aria-label="Abrir menú"
          >
            <Menu />
          </Button>
          <div className="ml-auto flex items-center gap-2 text-sm text-muted-foreground">
            <UserRound className="size-4" />
            {perfil?.nombre}
          </div>
        </header>
        <main className="mx-auto max-w-7xl p-4 md:p-8">{children}</main>
      </div>
    </div>
  )
}
