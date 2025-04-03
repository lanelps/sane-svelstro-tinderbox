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

export interface ObjLink {
  label: string;
  url: string;
}

export interface ExternalLink {
  type: "external";
  label: string;
  url: string;
  newTab: boolean;
}

export interface FileLink {
  type: "file";
  label: string;
  file: {
    _type: "file";
    asset: {
      url: string;
    };
  };
}

export interface InternalLink {
  type: "internal";
  label: string;
  reference: Reference;
}

export type Link = ExternalLink | FileLink | InternalLink | ObjLink | string;

export type Links = Link[];
