"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";

const MODES = [
  { value: "proposal", label: "Full Proposal" },
  { value: "loi", label: "Letter of Inquiry (LOI)" },
  { value: "narrative", label: "Narrative" },
  { value: "budget", label: "Budget Justification" },
  { value: "questions", label: "Answer Grant Questions" },
];

const SECTIONS_BY_MODE: Record<string, string[]> = {
  proposal: [
    "Problem Statement / Needs Assessment",
    "Project Description",
    "Goals and Objectives",
    "Methods / Activities",
    "Evaluation Plan",
    "Budget Justification",
    "Organizational Capacity",
    "Sustainability",
  ],
  loi: [
    "Introduction",
    "Organization Overview",
    "Project Summary",
    "Need Being Addressed",
    "Expected Outcomes",
    "High-Level Budget",
    "Closing",
  ],
  narrative: [
    "Community Need",
    "Project Response",
    "Impact on Beneficiaries",
    "Organizational Positioning",
  ],
  budget: [
    "Overall Budget Summary",
    "Line Item Justifications",
    "Alignment with Outcomes",
  ],
  questions: ["Question Responses"],
};

export default function GrantWriterPage() {
  const { id } = useParams();
  const [grant, setGrant] = useState<any>(null);
  const [mode, setMode] = useState<string>("proposal");
  const [draft, setDraft] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [generating, setGenerating] = useState<boolean>(false);
  const [questions, setQuestions] = useState<string>("");

  // Version history
  const [drafts, setDrafts] = useState<any[]>([]);
  const [selectedDraftId, setSelectedDraftId] = useState<string>("");

  // Autosave
  const [autosaveStatus, setAutosaveStatus] = useState<string>("Saved");
  const lastSavedDraft = useRef<string>("");

  // Load grant info
  useEffect(() => {
    const load = async () => {
      const res = await fetch(`/api/grants/${id}`);
      const data = await res.json();
      setGrant(data.grant || null);
      setLoading(false);
    };

    load();
  }, [id]);

  // Load saved drafts
  const loadDrafts = async () => {
    const res = await fetch(`/api/grant-drafts/${id}`);
    const data = await res.json();
    setDrafts(data.drafts || []);
  };

  useEffect(() => {
    loadDrafts();
  }, [id]);

  // Generate full draft
  const generateDraft = async () => {
    setGenerating(true);

    const res = await fetch("/api/grants/write", {
      method: "POST",
      body: JSON.stringify({
        grantId: id,
        mode,
        questions: mode === "questions" ? questions.split("\n") : undefined,
      }),
    });

    const data = await res.json();
    setDraft(data.draft || "");
    lastSavedDraft.current = data.draft || "";
    setAutosaveStatus("Saved");
    setGenerating(false);
  };

  // Regenerate a single section
  const regenerateSection = async (sectionLabel: string) => {
    if (!grant) return;

    setGenerating(true);

    const res = await fetch("/api/grants/write", {
      method: "POST",
      body: JSON.stringify({
        grantId: id,
        mode,
        questions: mode === "questions" ? questions.split("\n") : undefined,
        section: sectionLabel,
      }),
    });

    const data = await res.json();
    const newSection = data.draft || "";

    setDraft((prev) =>
      prev
        ? `${prev}\n\n[Regenerated: ${sectionLabel}]\n${newSection}`
        : newSection
    );

    setAutosaveStatus("Unsaved changes");
    setGenerating(false);
  };

  // Manual Save Draft
  const saveDraft = async () => {
    if (!draft.trim()) {
      alert("Draft is empty — nothing to save.");
      return;
    }

    await fetch("/api/grant-drafts", {
      method: "POST",
      body: JSON.stringify({
        grantId: id,
        mode,
        content: draft,
      }),
    });

    lastSavedDraft.current = draft;
    setAutosaveStatus("Saved");

    await loadDrafts();

    alert("Draft saved!");
  };

  // Load selected draft
  const loadSelectedDraft = () => {
    const d = drafts.find((x) => x.id === selectedDraftId);
    if (!d) return alert("No draft selected.");
    setDraft(d.content);
    lastSavedDraft.current = d.content;
    setAutosaveStatus("Saved");
  };

  // Restore version
  const restoreVersion = (draftObj: any) => {
    setDraft(draftObj.content);
    lastSavedDraft.current = draftObj.content;
    setAutosaveStatus("Restored");
  };

  // Duplicate version
  const duplicateVersion = async (draftObj: any) => {
    await fetch("/api/grant-drafts", {
      method: "POST",
      body: JSON.stringify({
        grantId: id,
        mode: draftObj.mode,
        content: draftObj.content,
      }),
    });

    await loadDrafts();
    alert("Version duplicated!");
  };

  // AUTOSAVE every 10 seconds
  useEffect(() => {
    const interval = setInterval(async () => {
      if (!draft.trim()) return;
      if (draft === lastSavedDraft.current) return;

      setAutosaveStatus("Saving…");

      await fetch("/api/grant-drafts", {
        method: "POST",
        body: JSON.stringify({
          grantId: id,
          mode,
          content: draft,
        }),
      });

      lastSavedDraft.current = draft;
      setAutosaveStatus("Saved");
      await loadDrafts();
    }, 10000);

    return () => clearInterval(interval);
  }, [draft, id, mode]);

  if (loading) {
    return <div className="p-10 text-gray-600">Loading grant…</div>;
  }

  if (!grant) {
    return <div className="p-10 text-red-600">Grant not found.</div>;
  }

  const sections = SECTIONS_BY_MODE[mode] || [];

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-10 flex gap-6">
      {/* VERSION HISTORY SIDEBAR */}
      <div className="w-80 bg-white border rounded-xl shadow-sm p-5 h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold text-gray-900">Version History</h2>

        {drafts.length === 0 && (
          <p className="text-gray-500 mt-4">No drafts saved yet.</p>
        )}

        <div className="mt-4 space-y-4">
          {drafts.map((d) => (
            <div
              key={d.id}
              className="border rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition"
            >
              <p className="text-sm font-semibold text-gray-800">
                {new Date(d.updatedAt).toLocaleString()}
              </p>
              <p className="text-xs text-gray-600 mt-1">Mode: {d.mode}</p>

              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => restoreVersion(d)}
                  className="px-3 py-1 text-xs bg-blue-600 text-white rounded"
                >
                  Restore
                </button>
                <button
                  onClick={() => duplicateVersion(d)}
                  className="px-3 py-1 text-xs bg-gray-300 rounded"
                >
                  Duplicate
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MAIN WRITER PANEL */}
      <div className="flex-1 max-w-4xl mx-auto bg-white p-10 rounded-xl shadow-sm border">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">
            AI Grant Writer — {grant.title}
          </h1>

          <p className="text-sm text-gray-500">
            Autosave: <span className="font-medium">{autosaveStatus}</span>
          </p>
        </div>

        {/* Mode Selector */}
        <div className="mt-8">
          <label className="font-semibold text-gray-700">Writing Mode</label>
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value)}
            className="mt-2 p-3 border rounded-lg w-full bg-gray-50"
          >
            {MODES.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        </div>

        {/* Load Previous Drafts */}
        {drafts.length > 0 && (
          <div className="mt-8">
            <label className="font-semibold text-gray-700">
              Load Previous Draft
            </label>
            <div className="flex gap-3 mt-2">
              <select
                value={selectedDraftId}
                onChange={(e) => setSelectedDraftId(e.target.value)}
                className="p-3 border rounded-lg w-full bg-gray-50"
              >
                <option value="">Select a draft…</option>
                {drafts.map((d) => (
                  <option key={d.id} value={d.id}>
                    {new Date(d.updatedAt).toLocaleString()}
                  </option>
                ))}
              </select>

              <button
                onClick={loadSelectedDraft}
                className="px-5 py-3 bg-blue-600 text-white rounded-lg"
              >
                Load
              </button>
            </div>
          </div>
        )}

        {/* Questions Input */}
        {mode === "questions" && (
          <div className="mt-8">
            <label className="font-semibold text-gray-700">
              Paste Grant Questions (one per line)
            </label>
            <textarea
              value={questions}
              onChange={(e) => setQuestions(e.target.value)}
              className="mt-2 p-4 border rounded-lg w-full h-32 bg-gray-50"
            />
          </div>
        )}

        {/* Generate Button */}
        <button
          onClick={generateDraft}
          disabled={generating}
          className="mt-8 px-6 py-3 bg-purple-600 text-white rounded-lg"
        >
          {generating ? "Generating…" : "Generate Full Draft"}
        </button>

        {/* Section Regeneration */}
        {sections.length > 0 && (
          <div className="mt-10">
            <h2 className="text-lg font-semibold text-gray-900">
              Regenerate Specific Sections
            </h2>
            <div className="mt-3 flex flex-wrap gap-3">
              {sections.map((section) => (
                <button
                  key={section}
                  onClick={() => regenerateSection(section)}
                  disabled={generating}
                  className="px-4 py-2 text-sm bg-gray-100 border rounded-lg hover:bg-gray-200"
                >
                  {section}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Draft Editor */}
        {draft && (
          <div className="mt-12">
            <h2 className="text-xl font-semibold text-gray-900">
              Draft Output
            </h2>

            <textarea
              value={draft}
              onChange={(e) => {
                setDraft(e.target.value);
                setAutosaveStatus("Unsaved changes");
              }}
              className="mt-4 p-5 border rounded-lg w-full h-[600px] bg-gray-50 leading-relaxed text-gray-800"
            />

            {/* Manual Save */}
            <button
              onClick={saveDraft}
              className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg"
            >
              Save Draft
            </button>

            {/* EXPORT BUTTONS */}
            <div className="mt-6 flex gap-4">
              <button
                onClick={async () => {
                  const res = await fetch("/api/export/pdf", {
                    method: "POST",
                    body: JSON.stringify({
                      title: `${grant.title} - ${mode}`,
                      content: draft,
                    }),
                  });

                  const blob = await res.blob();
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `${grant.title}-${mode}.pdf`;
                  a.click();
                }}
                className="px-6 py-3 bg-red-600 text-white rounded-lg"
              >
                Export as PDF
              </button>

              <button
                onClick={async () => {
                  const res = await fetch("/api/export/docx", {
                    method: "POST",
                    body: JSON.stringify({
                      title: `${grant.title} - ${mode}`,
                      content: draft,
                    }),
                  });

                  const blob = await res.blob();
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `${grant.title}-${mode}.docx`;
                  a.click();
                }}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg"
              >
                Export as DOCX
              </button>
            </div>
          </div>
        )}

        {/* Back Link */}
        <div className="mt-10">
          <a href={`/grants/${id}`} className="text-gray-600 underline">
            ← Back to Grant
          </a>
        </div>
      </div>
    </div>
  );
}
