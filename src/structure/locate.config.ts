// Define an object line each, in the `locates` array, for the document
// references you'd like to show in Presentation's 'Used in' dropdown.

// A normal object line looks like this:
//   - type is the document type
//   - key is the usual indexing identity field of the documents
//   - path is the initial url path for the documents

// example:  { type: 'post', key: 'title', path: '/post' },

// That's all it takes, in the usual case for Presentation editable pages

export const locates = [{ type: "project", key: "title", path: "/projects" }];

// If with care to what follows, yyou also want to have an 'all docs' listing
// item for the doc type, showing up in the dropdown, then you can add two fields
// to its particular object:
//    - allPath as the url path introducing the document list
//    - label as a text label for this item

// example: { type: 'post', key: 'title', path: '/post',
//   allPath: '/', label: 'All postsa' },

// Be aware, however, that if you add such 'All docs' items, you must assure that
// the allPath page is enabled for Presentation, particularly with `enableVisualEditing`
// arranged, otherwise it will fail in the Studio, as 'Unable to Connect'.
//
// In addition, to make this work, you'd have to create the items on this
// listing page using references to actual free-standing document components,
// with data provision so that they could connect to the type that the
// Studio will actually be live editing.
//
// And, you'd need to disable normal click-to-view for the listing items equally,
// so it doesn't interfere and cause the item to load on clicks,
// thus also failing on-originating-page edit in the studio.
//
// Thus, this added ability might seem useful, but only if you'd like to
// take an amount of effort to arrange everything so that it could work.
// This is probably why the ability exists only as a commented-out item
// in the original locate example.
