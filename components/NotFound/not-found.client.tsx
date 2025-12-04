"use client";

import React from "react";
import { ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useLocalizedRouter } from "@/lib/useLocalizedRouter";
import { useT } from "../../app/[locale]/layout";
import { useAuth } from "@/lib/context/auth-context";
import ProtectedLayout from "@/app/[locale]/(protected)/layout";
import PublicLayout from "@/app/[locale]/(public)/layout";

export default function NotFoundClient() {
  const { push } = useLocalizedRouter();
  const t = useT("404");
  const { user,loading } = useAuth();

  return (
    <>
      {user ? (
        <ProtectedLayout>
          <div className="min-h-screen bg-neutral-50 text-neutral-900 mt-10">
            <main className="mx-auto max-w-6xl px-4 py-6">
              <div className="mt-6">
                <Card>
                  <CardContent className="p-4 p-5 space-y-2 text-center text-neutral-700 text-sm">
                    <div className="mb-4 p-10">
                      <h1 className="font-bold" style={{ fontSize: "100px" }}>
                        {t("title")}
                      </h1>
                    </div>
                    <div className="mb-4 p-0.5">
                      <h1 className="font-semibold text-2xl text-gray-500">
                        {t("subtitle")}
                      </h1>
                    </div>
                    <div
                      className="mb-4 font-medium text-[0.875rem] text-muted-foreground"
                      dangerouslySetInnerHTML={{
                        __html: t("description") || "",
                      }}
                    />

                    <div className="mt-8">
                      <button
                        onClick={() => push("/")}
                        className="bg-neutral-900 border border-neutral-900 font-medium hover:opacity-90 inline-flex items-center justify-center mt-5 px-3 py-2 rounded-2xl text-sm text-white transition-colors"
                      >
                        {t("go-back")} <ArrowRight className="ml-2 h-4 w-4" />
                      </button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </main>
          </div>
        </ProtectedLayout>
      ) : (
        <PublicLayout>
          <div className="min-h-screen bg-neutral-50 text-neutral-900 mt-10">
            <main className="mx-auto max-w-6xl px-4 py-6">
              <div className="mt-6">
                <Card>
                  <CardContent className="p-4 p-5 space-y-2 text-center text-neutral-700 text-sm">
                    <div className="mb-4 p-10">
                      <h1 className="font-bold" style={{ fontSize: "100px" }}>
                        {t("title")}
                      </h1>
                    </div>
                    <div className="mb-4 p-0.5">
                      <h1 className="font-semibold text-2xl text-gray-500">
                        {t("subtitle")}
                      </h1>
                    </div>
                    <div
                      className="mb-4 font-medium text-[0.875rem] text-muted-foreground"
                      dangerouslySetInnerHTML={{
                        __html: t("description") || "",
                      }}
                    />

                    <div className="mt-8">
                      <button
                        onClick={() => push("/signin")}
                        className="bg-neutral-900 border border-neutral-900 font-medium hover:opacity-90 inline-flex items-center justify-center mt-5 px-3 py-2 rounded-2xl text-sm text-white transition-colors"
                      >
                        {t("go-back")} <ArrowRight className="ml-2 h-4 w-4" />
                      </button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </main>
          </div>
        </PublicLayout>
      )}
    </>
  );
}

