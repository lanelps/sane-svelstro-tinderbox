---

---
# The locate.ts File

`locate.ts` enables the 'Used in' menus so useful in Presentation, which occur at the top of the editor page for your documents.

The Observer basis for locate allows it to dynamically update, so that it keeps track of document use as you build out your content.

To do this, it needs to be updated when you add doucuments, whenever you intend for them to operate in Presentation.

## Updating for new document types

If you take a look over the `locate.ts` file, you can notice the document-specific portions:

- the query is universal for documents, but notice its projection names fields, as does the type signature for resulits

- there's a Generate block for each type, filtering and mapping from query results. 

- finally, the output consolidates all monitored locations, with the option of including an 'All' location when there's one which is included in Presentation editability -- otherwise it shouldn't be provided

So to add a document type to Presentation, once you've wrapped any of its fields displays on the page for presentation, you'll do the following:

### Adjust the query, if needed

Looking at the projection, see if the name of the identifying field you want in your Used In indicator is already included -- `name`, and common others may already be there.

If the field name isn't there, add it, to the presentation, and with a ? for optionality to the type signature.

### Add its Generate block

You can copy an existing block, and adjust its field name to fit the one you chose or are re-using for the projection.

Change its variable name to fit the type.

Then adjust the href: field to properly use that document type's website pathname

### Add the result to the consolidated output

This will just be adding the `...filednameLocation` line you've created as for others, in most cases.

If you also have a listing page for the type, where you also use wrappers to make it live editable, then you can add an 'All ' block for the type, as shown commented out.

## Verifying

Once you have your document type added, you should see the 'Used in' item appear on its edit page in a freshly started Studio.

## Additional structure folder possibilities

If you wan to control Studio's main edit pane, you can add `deskStructure.tsx` file here, and import in your sanity.config.ts in the usual ways.

Similarly, if you'd like to add abilities such as side-by-side review for pages not using Presentation, you can add a `defaultDocumentNode.tsx` here, and similiarly import.