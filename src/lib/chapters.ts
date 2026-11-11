// A project chapter's anchor on its case page: the Info board's list, the section that opens the chapter, and the
// home rotation's contents all address it by this id (/works/<slug>#ch-…).
export const chapterId = (c: string) => `ch-${c.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
