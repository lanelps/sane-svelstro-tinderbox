// ==============================
// Links
// ==============================

export type Slug = {
  current: string;
};

export type Reference = {
  _id: string;
  _type: string;
  title: string;
  slug: Slug;
};

// `label` is optional because the same shapes back both the `link` object (where the label is
// a required field) and the `inlineLink` portable-text annotation (where the annotated text is
// the label, so the schema has no label field at all).

export interface ObjLink {
  label?: string;
  url: string;
}

export interface ExternalLink {
  type: "external";
  label?: string;
  url: string;
  newTab: boolean;
}

export interface FileLink {
  type: "file";
  label?: string;
  file: {
    _type: "file";
    asset: {
      url: string;
    };
  };
}

export interface InternalLink {
  type: "internal";
  label?: string;
  reference: Reference;
}

export type Link = ExternalLink | FileLink | InternalLink | ObjLink | string;

export type Links = Link[];

export interface LinkAttributes {
  href: string;
  target?: string;
  rel?: string;
  download?: boolean;
}

/** A resolved `inlineLink` annotation as it arrives on a portable-text block's `markDefs`. */
export type InlineLinkMarkDef = (ExternalLink | FileLink | InternalLink) & {
  _type: "inlineLink";
  _key: string;
};
