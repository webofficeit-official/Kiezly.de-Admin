'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import LocalizedLink from '@/lib/localizedLink';
import { Button } from '@/components/ui/button';
import { Users, FileText, Settings, BarChart3, ChevronRight } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

export default function RightRailPrivate() {
  // Desktop sticky rail and a mobile slide-over button
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement|null>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      const t = e.target as Node;
      if (panelRef.current && !panelRef.current.contains(t)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [open]);

  const links = [
    { href: '/admin/users', icon: Users, label: 'Users' },
    { href: '/admin/reports', icon: FileText, label: 'Reports' },
    { href: '/admin/analytics', icon: BarChart3, label: 'Analytics' },
    { href: '/admin/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <>
      {/* Desktop / tablet */}
      <aside className="hidden lg:block w-80 shrink-0">
        <div className="sticky top-24 space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Quick actions</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              <LocalizedLink href="/dashboard/new">
                <Button className="w-full justify-between">
                  Create new <ChevronRight className="h-4 w-4" />
                </Button>
              </LocalizedLink>
              <LocalizedLink href="/dashboard/approvals">
                <Button variant="outline" className="w-full justify-between">
                  Review approvals <ChevronRight className="h-4 w-4" />
                </Button>
              </LocalizedLink>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">Admin links</CardTitle></CardHeader>
            <CardContent className="space-y-1">
              {links.map((l, i) => (
                <LocalizedLink
                  key={i}
                  href={l.href}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-neutral-50 border"
                >
                  <l.icon className="h-4 w-4" />
                  <span className="text-sm">{l.label}</span>
                </LocalizedLink>
              ))}
            </CardContent>
          </Card>
        </div>
      </aside>

      {/* Mobile button + slide-over */}
      <div className="lg:hidden">
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-4 right-4 z-40 rounded-full h-12 w-12 shadow-lg flex items-center justify-center bg-neutral-900 text-white"
          aria-label="Open dashboard menu"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        {open && (
          <>
            <div className="fixed inset-0 bg-black/40 z-40" onClick={() => setOpen(false)} />
            <aside
              ref={panelRef}
              className="fixed right-0 top-0 h-full w-[88vw] sm:w-[360px] bg-white shadow-xl z-50 p-4 overflow-y-auto"
            >
              <div className="space-y-4">
                <h3 className="text-sm font-semibold">Dashboard menu</h3>
                <div className="space-y-2">
                  <LocalizedLink href="/dashboard/new" className="block px-3 py-2 rounded border hover:bg-neutral-50">Create new</LocalizedLink>
                  <LocalizedLink href="/dashboard/approvals" className="block px-3 py-2 rounded border hover:bg-neutral-50">Review approvals</LocalizedLink>
                </div>

                <div className="pt-2 space-y-1">
                  {links.map((l, i) => (
                    <LocalizedLink key={i} href={l.href} className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-neutral-50 border">
                      <l.icon className="h-4 w-4" /><span className="text-sm">{l.label}</span>
                    </LocalizedLink>
                  ))}
                </div>
              </div>
            </aside>
          </>
        )}
      </div>
    </>
  );
}
