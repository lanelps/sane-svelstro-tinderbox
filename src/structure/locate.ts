// this is a universal version of Sanity's example locate, so that only
// its companion locate.config.ts needed to specify types for presentation

// We keep this file local, instead of in the /lib, because its possible to
// add 'All' links as in the last step, given the All page is compatible

// it's configured by a simple locate.config.ts file, in the same folder

import {
  type DocumentLocationResolver,
  type DocumentLocationsState,
} from "sanity/presentation";
import { map, Observable } from "rxjs";

import { locates } from "./locate.config";

export const locate: DocumentLocationResolver = (params, context) => {
  // TypeScript doesn't notice that id actually is used, in the Groq query
  // @ts-ignore
  const { type, id } = params;
  const locate = locates.find((val) => val.type === type);

  type AddedFields = { [key: string]: string };

  if (locate && locate.type === params.type) {
    const keys = locates.map((locate) => locate.key);
    const fields = ["_type", "slug", ...keys];
    /*
      Listen to all changes in the selected document 
      and all documents that reference it
    */
    const doc$ = context.documentStore.listenQuery(
      `*[_id==$id || references($id)]
             { ${fields.map((field) => `"${field}": ${field}`).join(", ")}}`,
      params,
      { perspective: "previewDrafts" }
    ) as Observable<
      | ({
          _type: string;
          slug?: { current: string };
        } & AddedFields[]) // AddedFields allows our different ones per doc type
      | null
    >;

    // pipe the real-time results to RXJS's map function
    return doc$.pipe(
      map((docs) => {
        if (!docs) {
          return {
            message: "Unable to map any document types to locations",
            tone: "critical",
          } satisfies DocumentLocationsState;
        }

        // we get the rroups separately at first, for following steps
        const locateGroups = locates
          .map((locate) => {
            return docs
              .filter(
                ({ _type, slug }) => _type === locate.type && slug?.current
              )
              .map((doc) => ({
                type: `${doc._type}`,
                title: doc[locate.key] || `${locate.key} missing`,
                href: `${locate.path}/${doc.slug.current}`,
              }));
          })
          .filter((arr) => arr.length > 0);

        // make a flat list of all places the original document's content is used
        const allLocates = locateGroups.flatMap((arr) => arr);

        // make a list of all the types using this original doc/s data, for possible 'All' link
        // @ts-ignore -- we optionally do use referTypes
        const referTypes = locateGroups.map((group) => group[0].type);

        // make a list of 'All named' items to be added. Be sure you have the all page
        // Presentation-enabled, or you'd get a 'can't connect' message for it in Studio
        const allLabeled = locates.reduce((accum, locate) => {
          if (locate.allPath && referTypes.includes(locate.type)) {
            accum.push({
              title: locate.label,
              href: locate.allPath,
            });
          }
          return accum;
        }, []);

        return {
          locations: [...allLocates, ...allLabeled].filter(Boolean),
        } satisfies DocumentLocationsState;
      })
    );
  }

  return null;
};
