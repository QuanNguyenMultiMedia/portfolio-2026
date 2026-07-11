"use client";

import { useState } from "react";
import { notFound } from "next/navigation";
import PageWrapper from "@/components/PageWrapper";
import { t, layout } from "@/lib/designSystem";
import { projects } from "@/data/projects";

interface Asset {
  id: string;
  fileName: string;
  type: "image" | "video";
  span: string;
  previewUrl?: string;
}

interface Section {
  id: string;
  name: string;
  content: string;
  notes: string;
  assets: Asset[];
}

export default function WorksBuilderPage() {
  // Restrict to local development
  if (process.env.NODE_ENV !== "development") {
    notFound();
  }

  // Convert a project's screens into our builder sections format
  const getSectionsFromProject = (proj: typeof projects[0]) => {
    if (!proj || !proj.screens) return [];
    return proj.screens.map((screen, idx) => {
      const assets: Asset[] = [];
      if (screen.src) {
        assets.push({
          id: `asset-init-${idx}-0`,
          fileName: screen.src,
          type: screen.type === "video" ? "video" : "image",
          span: "span-12"
        });
      }
      if (screen.images) {
        screen.images.forEach((img, i) => {
          assets.push({
            id: `asset-init-${idx}-${i}`,
            fileName: img,
            type: "image",
            span: screen.type === "bento" || screen.type === "deliverable-breakdown" ? "span-6" : "span-12"
          });
        });
      }
      return {
        id: `sec-init-${idx}`,
        name: screen.title || `${idx + 1}. ${screen.type.toUpperCase()}`,
        content: screen.description || screen.content || "",
        notes: "",
        assets
      };
    });
  };

  const initialProject = projects[0] || { slug: "", title: "New Project", category: "Motion Design", year: "2026" };

  const [selectedSlug, setSelectedSlug] = useState(initialProject.slug);
  const [projectTitle, setProjectTitle] = useState(initialProject.title);
  const [category, setCategory] = useState(initialProject.category);
  const [year, setYear] = useState(initialProject.year);
  const [sections, setSections] = useState<Section[]>(
    projects[0] ? getSectionsFromProject(projects[0]) : [
      {
        id: "sec-1",
        name: "Section 1 - Hero/Intro",
        content: "Draft the paragraph or editorial copy that will show on the screen here...",
        notes: "Specify cinematic motion, overlaps, spacing or visual directives here...",
        assets: []
      }
    ]
  );
  const [copied, setCopied] = useState(false);

  const handleProjectChange = (slug: string) => {
    const proj = projects.find(p => p.slug === slug);
    if (!proj) return;
    setSelectedSlug(slug);
    setProjectTitle(proj.title);
    setCategory(proj.category);
    setYear(proj.year);
    setSections(getSectionsFromProject(proj));
  };

  const addSection = () => {
    const newSecId = `sec-${Date.now()}`;
    setSections([
      ...sections,
      {
        id: newSecId,
        name: `Section ${sections.length + 1}`,
        content: "",
        notes: "",
        assets: []
      }
    ]);
  };

  const removeSection = (secId: string) => {
    const sec = sections.find(s => s.id === secId);
    sec?.assets.forEach(a => a.previewUrl && URL.revokeObjectURL(a.previewUrl));
    setSections(sections.filter(s => s.id !== secId));
  };

  const updateSectionName = (secId: string, name: string) => {
    setSections(sections.map(s => s.id === secId ? { ...s, name } : s));
  };

  const updateSectionContent = (secId: string, content: string) => {
    setSections(sections.map(s => s.id === secId ? { ...s, content } : s));
  };

  const updateSectionNotes = (secId: string, notes: string) => {
    setSections(sections.map(s => s.id === secId ? { ...s, notes } : s));
  };

  const handleFileUpload = (secId: string, files: FileList | null) => {
    if (!files) return;
    const newAssets: Asset[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const isVideo = file.type.startsWith("video/");
      newAssets.push({
        id: `asset-${Date.now()}-${i}`,
        fileName: file.name,
        type: isVideo ? "video" : "image",
        span: "span-12", // Default to full-width
        previewUrl: URL.createObjectURL(file)
      });
    }
    setSections(sections.map(s => {
      if (s.id === secId) {
        return {
          ...s,
          assets: [...s.assets, ...newAssets]
        };
      }
      return s;
    }));
  };

  const removeAsset = (secId: string, assetId: string) => {
    setSections(sections.map(s => {
      if (s.id === secId) {
        const asset = s.assets.find(a => a.id === assetId);
        if (asset?.previewUrl) URL.revokeObjectURL(asset.previewUrl);
        return {
          ...s,
          assets: s.assets.filter(a => a.id !== assetId)
        };
      }
      return s;
    }));
  };

  const updateAssetSpan = (secId: string, assetId: string, span: string) => {
    setSections(sections.map(s => {
      if (s.id === secId) {
        return {
          ...s,
          assets: s.assets.map(a => a.id === assetId ? { ...a, span } : a)
        };
      }
      return s;
    }));
  };

  const exportJSON = () => {
    // Strip preview URLs before exporting to keep JSON clean
    const cleanSections = sections.map(s => ({
      name: s.name,
      content: s.content,
      notes: s.notes,
      assets: s.assets.map(a => ({
        fileName: a.fileName,
        type: a.type,
        span: a.span
      }))
    }));

    const output = {
      title: projectTitle,
      slug: selectedSlug,
      category,
      year,
      sections: cleanSections
    };

    navigator.clipboard.writeText(JSON.stringify(output, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <PageWrapper>
      <div className={`${layout.page} min-h-screen pt-24 px-8 md:px-16`}>
        {/* Header */}
        <div className="mb-12 border-b border-primary/10 pb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <span className={t.monoEyebrow}>DEVELOPER SANDBOX</span>
            <h1 className={`${t.pageTitle} mt-2`}>WORKS LAYOUT BUILDER</h1>
            <p className="text-xs text-foreground/40 mt-1 font-mono">
              Build your custom blueprint. Drop assets and leave structural notes.
            </p>
          </div>
          <button
            onClick={exportJSON}
            className="px-6 py-3 border border-tech-blue/40 text-tech-blue hover:bg-tech-blue/10 font-mono text-xs tracking-wider transition-all uppercase flex items-center gap-2 self-start md:self-auto"
          >
            {copied ? "Copied JSON to Clipboard ✓" : "Export Layout JSON ↗"}
          </button>
        </div>

        {/* Project Meta Selector & Info (Read-only) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 bg-surface/10 border border-primary/5 p-6 rounded">
          <div>
            <label className="block text-[10px] font-mono text-foreground/40 uppercase mb-2">Select Project</label>
            <select
              value={selectedSlug}
              onChange={(e) => handleProjectChange(e.target.value)}
              className="w-full bg-background border border-primary/10 px-4 py-2 text-sm text-foreground/80 focus:border-tech-blue/50 focus:outline-none"
            >
              {projects.map((proj) => (
                <option key={proj.slug} value={proj.slug}>
                  {proj.title}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-mono text-foreground/40 uppercase mb-2">Category</label>
            <input
              type="text"
              value={category}
              readOnly
              className="w-full bg-surface/5 border border-primary/10 px-4 py-2 text-sm text-foreground/40 cursor-not-allowed outline-none"
            />
          </div>
          <div>
            <label className="block text-[10px] font-mono text-foreground/40 uppercase mb-2">Year</label>
            <input
              type="text"
              value={year}
              readOnly
              className="w-full bg-surface/5 border border-primary/10 px-4 py-2 text-sm text-foreground/40 cursor-not-allowed outline-none"
            />
          </div>
        </div>

        {/* Sections List */}
        <div className="space-y-12">
          {sections.map((section, sIndex) => (
            <div
              key={section.id}
              className="border border-primary/10 bg-surface/5 p-6 relative group/section"
            >
              {/* Section Controls */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-primary/5 pb-4 mb-6">
                <div className="flex-1">
                  <input
                    type="text"
                    value={section.name}
                    onChange={(e) => updateSectionName(section.id, e.target.value)}
                    className="bg-transparent border-b border-transparent hover:border-primary/20 focus:border-tech-blue/50 focus:outline-none text-lg font-bold tracking-tight uppercase w-full max-w-md py-1"
                  />
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-[10px] font-mono text-foreground/30">SECTION 0{sIndex + 1}</span>
                  <button
                    onClick={() => removeSection(section.id)}
                    className="text-[10px] font-mono text-red-500/60 hover:text-red-500 hover:underline transition-colors"
                  >
                    Delete Section
                  </button>
                </div>
              </div>

              {/* Section Content: Left/Right Split */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Visual Asset Drop Area & Grid Preview (Left) */}
                <div className="lg:col-span-7 space-y-6">
                  <label className="block text-[10px] font-mono text-foreground/40 uppercase">Visual Assets</label>
                  
                  {/* File Upload Dropzone */}
                  <div className="border border-dashed border-primary/25 hover:border-tech-blue/50 transition-colors p-8 text-center bg-surface/5 cursor-pointer relative group">
                    <input
                      type="file"
                      multiple
                      accept="image/*,video/*"
                      onChange={(e) => handleFileUpload(section.id, e.target.files)}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <div className="text-xs font-mono text-foreground/40 group-hover:text-tech-blue transition-colors">
                      + Drag & Drop Images/Videos here, or Click to select
                    </div>
                  </div>

                  {/* Asset Previews Grid */}
                  {section.assets.length > 0 && (
                    <div className="grid grid-cols-12 gap-4">
                      {section.assets.map((asset) => (
                        <div
                          key={asset.id}
                          className={`${
                            asset.span === "span-12" ? "col-span-12" : asset.span === "span-8" ? "col-span-8" : asset.span === "span-6" ? "col-span-6" : "col-span-4"
                          } border border-primary/10 bg-background/50 p-2 relative group/asset`}
                        >
                          {/* Asset Info Overlay */}
                          <div className="absolute top-2 right-2 z-10 flex items-center gap-2 opacity-0 group-hover/asset:opacity-100 transition-opacity">
                            <select
                              value={asset.span}
                              onChange={(e) => updateAssetSpan(section.id, asset.id, e.target.value)}
                              className="bg-background/95 border border-primary/20 text-[9px] font-mono p-1 text-foreground/80 focus:outline-none"
                            >
                              <option value="span-12">Full Width (12 cols)</option>
                              <option value="span-8">Wide (8 cols)</option>
                              <option value="span-6">Half Width (6 cols)</option>
                              <option value="span-4">One Third (4 cols)</option>
                            </select>
                            <button
                              onClick={() => removeAsset(section.id, asset.id)}
                              className="bg-red-950/80 border border-red-500/30 text-red-400 text-[9px] font-mono p-1 hover:bg-red-900 transition-colors"
                            >
                              Remove
                            </button>
                          </div>

                          {/* Media Preview */}
                          <div className="aspect-video bg-black/20 overflow-hidden flex items-center justify-center">
                            {asset.type === "video" ? (
                              <video src={asset.previewUrl} muted className="w-full h-full object-cover" />
                            ) : (
                              <img src={asset.previewUrl} alt={asset.fileName} className="w-full h-full object-cover" />
                            )}
                          </div>

                          <div className="mt-2 flex items-center justify-between text-[9px] font-mono text-foreground/40 overflow-hidden">
                            <span className="truncate mr-2" title={asset.fileName}>{asset.fileName}</span>
                            <span className="shrink-0 uppercase text-tech-blue/70">[{asset.span}]</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Section Notes (Right) */}
                <div className="lg:col-span-5 flex flex-col gap-6">
                  <div className="flex-1 flex flex-col">
                    <label className="block text-[10px] font-mono text-foreground/40 uppercase mb-2">Page Copy / Text Content</label>
                    <textarea
                      value={section.content}
                      onChange={(e) => updateSectionContent(section.id, e.target.value)}
                      placeholder="Write the paragraph, copy, or text that will show directly on the live page..."
                      className="w-full flex-1 min-h-[120px] bg-background border border-primary/10 p-4 text-xs font-mono text-foreground/70 leading-relaxed focus:border-tech-blue/50 focus:outline-none resize-none"
                    />
                  </div>
                  <div className="flex-1 flex flex-col">
                    <label className="block text-[10px] font-mono text-foreground/40 uppercase mb-2">Design & Placement Notes</label>
                    <textarea
                      value={section.notes}
                      onChange={(e) => updateSectionNotes(section.id, e.target.value)}
                      placeholder="Specify layout requests (e.g. 'Overlap image with text', 'Apply parallax scrolling', 'This video needs to be muted and autoplaying')."
                      className="w-full flex-1 min-h-[120px] bg-background border border-primary/10 p-4 text-xs font-mono text-foreground/70 leading-relaxed focus:border-tech-blue/50 focus:outline-none resize-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Actions */}
        <div className="mt-12 flex justify-between gap-6 pb-24">
          <button
            onClick={addSection}
            className="px-6 py-3 border border-primary/20 hover:border-primary/40 text-foreground/60 hover:text-foreground font-mono text-xs tracking-wider transition-all uppercase"
          >
            + Add Section
          </button>
          <button
            onClick={exportJSON}
            className="px-8 py-3 bg-foreground text-background hover:bg-foreground/90 font-mono text-xs tracking-wider transition-all uppercase font-bold"
          >
            {copied ? "Copied ✓" : "Export Layout JSON ↗"}
          </button>
        </div>
      </div>
    </PageWrapper>
  );
}
