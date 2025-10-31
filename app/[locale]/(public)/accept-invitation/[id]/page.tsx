"use client";

import { Suspense } from "react";
import VerifyAndAcceptInvitaion from "@/components/accept-invitation/accept-invitation";
import { useParams } from "next/navigation";

export default function AcceptInvitaitonPage() {
const { id } = useParams<{ id: string }>();

  return <main className="mx-auto max-w-6xl px-4">
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyAndAcceptInvitaion id={id}/>
    </Suspense>
  </main>
}
