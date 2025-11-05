"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { Briefcase, BriefcaseMedical, CalendarClock, CalendarMinus2, CircleSlash, Euro, Eye, Facebook, Globe, GraduationCap, Hourglass, IceCream, Instagram, Linkedin, Scale, View, X } from "lucide-react";
import { useT } from "@/app/[locale]/layout";

interface JobProfileProps {
  job: any;
  application?: any;
  onClose?: any;
}

export default function JobProfile({ job, onClose }: JobProfileProps) {
  if (!job) return null;
  const t = useT("jobs")

  return (
    <>
      <Card className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-12">
          <div className="col-span-5 bg-gray-100 p-6">
            {job.avatar_url ? (
              <>
                <img src={job?.avatar_url || "https://placehold.co/96x96"} alt={job?.display_name} className="h-100 w-full rounded-lg object-cover" />
              </>
            ) : (
              <div className="w-20 h-20 flex items-center justify-center bg-gray-200 rounded-full text-gray-600 font-semibold">
                {job.first_name?.charAt(0)}
                {job.last_name?.charAt(0)}
              </div>
            )}
            <div className="mt-10">
              {job.rate ? (
                <LeftType label={t("job.salary-expectation.label")} value={t("job.salary-expectation.value", { rate: job.rate})} Icon={<Euro />} />
              ) : ""}
              {job.experience ? (
                <LeftType label={t("job.work-experience.label")} value={t("job.work-experience.value", { years: job.experience})} Icon={<Briefcase />} />
              ) : ""}
              {job.min_hours ? (
                <LeftType label={t("job.min-hours.label")} value={t("job.min-hours.value", { hours: job.min_hours })} Icon={<Hourglass />} />
              ) : ""}
              {job.gender ? (
                <LeftType label={t("job.gender.label")} value={`${job.gender}`} Icon={<CircleSlash />} />
              ) : ""}
              {job.weekdays.length > 0 ? (
                <LeftType label={t("job.available days.label")} value={`${job.weekdays.join(', ')}`} Icon={<CalendarClock />} />
              ) : ""}
              {job.time_windows.length > 0 ? (
                <LeftType label={t("job.time-windows.label")} value={`${job.time_windows.join(', ')}`} Icon={<CalendarMinus2 />} />
              ) : ""}
            </div>
            <div className="mt-10">
              <p className="font-medium text-lg">{t("job.contacts")}</p>
              <p className="mt-3 font-semibold text-sm text-blue-700"><a href={`mailto:${job.email}`}>{job.email}</a></p>
              <p className="mt-3 font-semibold text-sm text-blue-700"><a href={`tel:${job.phone}`}>{job.phone}</a></p>
            </div>
            {job.social_links.length > 0 ? (
              <div className="mt-10">
                <p className="font-medium text-lg mb-3">{t("job.socials")}</p>
                <div className="flex items-center gap-1">
                  {job.social_links.find(s => s.platform === 'website') ? (
                    <SocialIcons Icon={<Globe className="h-4 w-4 text-gray-600 hover:text-black" />} link={job.social_links.find(s => s.platform === 'website')?.url} />
                  ) : ""}
                  {job.social_links.find(s => s.platform === 'linkedin') ? (
                    <SocialIcons Icon={<Linkedin className="h-4 w-4 text-blue-600 hover:text-blue-700" />} link={job.social_links.find(s => s.platform === 'linkedin')?.url} />
                  ) : ""}
                  {job.social_links.find(s => s.platform === 'instagram') ? (
                    <SocialIcons Icon={<Instagram className="h-4 w-4 text-pink-500 hover:text-pink-600" />} link={job.social_links.find(s => s.platform === 'instagram')?.url} />
                  ) : ""}
                  {job.social_links.find(s => s.platform === 'x') ? (
                    <SocialIcons Icon={<X className="h-4 w-4 text-gray-800 hover:text-black" />} link={job.social_links.find(s => s.platform === 'x')?.url} />
                  ) : ""}
                  {job.social_links.find(s => s.platform === 'facebook') ? (
                    <SocialIcons Icon={<Facebook className="h-4 w-4 text-blue-500 hover:text-blue-600" />} link={job.social_links.find(s => s.platform === 'facebook')?.url} />
                  ) : ""}
                </div>
              </div>
            ) : ""}
          </div>
          <div className="col-span-7 p-6">
            {/* --- Header --- */}
            <div className="flex justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                {job.first_name} {job.last_name}
              </h2>
              <X className="h-6 w-6 text-black-300 border border-gray-200 cursor-pointer rounded-lg" onClick={onClose} />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {job.street} . {job.postal_code}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {job.city} . {job.state} . {job.country}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {t("job.since")} {new Date(job.created_at).toLocaleDateString()}
            </p>

            {/* --- Bio --- */}
            {job.bio && job.bio.trim() && (
              <div className="mt-4">
                <div className="text-sm text-gray-500 leading-relaxed" dangerouslySetInnerHTML={{  __html: job.bio }} />
              </div>
            )}
            <hr className="mt-4" />

            {/* --- Education --- */}
            {job.education?.length > 0 && (
              <>
                <div className="mt-5">
                  <p className="font-medium text-gray-500 text-sm mb-3">{t("job.education")}</p>
                  <div className="mt-4">
                    {job.education.map((e: any) => (
                      <EducationType label={e.institution} value={e.field} year={e.year} Icon={<GraduationCap />} />
                    ))}
                  </div>
                </div>
                <hr className="mt-4" />
              </>
            )}

            {/* --- Skills Section --- */}
            {job.skills?.length > 0 && (
              <>
                <div className="mt-5">
                  <p className="font-medium text-gray-500 text-sm mb-3">{t("job.skills")}</p>
                  <div className="flex flex-wrap gap-2">
                    {job.skills.map((skill: any) => (
                      <span
                        key={skill.name}
                        className="border rounded-2xl py-1 px-2 text-xs text-gray-800 border-gray-400"
                      >
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </div>
                <hr className="mt-4" />
              </>
            )}

            {/* --- Documents --- */}
            <div className="mt-5">
              <div className="mt-3">
                {job.has_first_aid ? (
                  <>
                    <p className="font-medium text-gray-500 text-sm mb-2">{t("job.first-aid")}</p>
                    <CertificateType value={`${job.first_aid.provider} - ${job.first_aid.certificateId}`} label={`${job.first_aid.completionDate} - ${job.first_aid.expiryDate}`} Icon={<BriefcaseMedical />} fileUrl={job.first_aid.fileUrl} />
                  </>
                ) : ''}
                {job.police_verified ? (
                  <>
                    <p className="font-medium text-gray-500 text-sm mb-2 mt-3">{t("job.police-certificate")}</p>
                    <CertificateType value={`${job.police_certificate.level}`} label={`${job.police_certificate.issueDate} - ${job.police_certificate.expiryDate}`} Icon={<Scale />} fileUrl={job.first_aid.fileUrl} />
                  </>
                ) : ''}
              </div>
            </div>

          </div>
        </div>
      </Card>
    </>
  );
}

/* --- Helper Subcomponents --- */
function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-medium text-gray-700">{label}</p>
      <p className="text-gray-600">{value}</p>
    </div>
  );
}

function LeftType({ label, value, Icon }: { label: string; value: string; Icon: any }) {
  return (
    <div className="flex items-center gap-3 mt-4">
      <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-gray-100">
        {Icon}
      </div>
      <div className="flex flex-col leading-tight">
        <span className="font-bold text-gray-900 text-sm">{value}</span>
        <span className="text-xs text-gray-600">{label}</span>
      </div>
    </div>
  );
}

function EducationType({
  label,
  value,
  year,
  Icon,
}: {
  label: string;
  value: string;
  year: number;
  Icon: any;
}) {
  return (
    <div className="flex items-start justify-between gap-6 mt-4">
      {/* Left side: icon + text */}
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-gray-100">
          {Icon}
        </div>
        <div className="flex flex-col leading-tight">
          <span className="font-bold text-gray-900 text-sm">{value}</span>
          <span className="text-xs text-gray-600">{label}</span>
        </div>
      </div>

      {/* Right side: year at top */}
      <div className="text-sm text-black-500 font-semibold">{year}</div>
    </div>
  );
}

function CertificateType({
  label,
  value,
  Icon,
  fileUrl
}: {
  label: string;
  value: string;
  Icon: any;
  fileUrl: string
}) {
  return (
    <div className="flex items-start justify-between gap-6 mt-4">
      {/* Left side: icon + text */}
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-gray-100">
          {Icon}
        </div>
        <a href={fileUrl} target="__blank">
          <div className="flex flex-col leading-tight">
            <span className="font-bold text-gray-900 text-sm">{value}</span>
            <span className="text-xs text-gray-600">{label}</span>
          </div>
        </a>
      </div>
    </div>
  );
}

function SocialIcons({ link, Icon }: { link: string; Icon: any }) {
  return (
    <a href={link} target="__blank" className="p-2 bg-background rounded-full border border-gray-200 hover:bg-gray-100 transition-all duration-200">
      {Icon}
    </a>
  );
}

function CertificateItem({ title, certificate }: { title: string; certificate: any }) {
  const hasFile = certificate?.fileUrl;

  return (
    <div className="border border-gray-100 rounded-lg p-2">
      <p className="font-medium text-gray-800">{title}</p>
      {hasFile ? (
        <a
          href={certificate.fileUrl}
          target="_blank"
          className="text-blue-600 text-sm hover:underline"
        >
          View Certificate
        </a>
      ) : (
        <p className="text-sm text-gray-500">Not uploaded</p>
      )}
      {certificate?.expiryDate && (
        <p className="text-xs text-gray-500 mt-1">
          Expires: {new Date(certificate.expiryDate).toLocaleDateString()}
        </p>
      )}
    </div>
  );
}
