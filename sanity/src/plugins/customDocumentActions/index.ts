import {
  definePlugin,
  type DocumentActionComponent,
  type DocumentActionsResolver,
  type NewDocumentOptionsResolver,
} from 'sanity'

// #region shopify
import shopifyDelete from './shopifyDelete'
import shopifyLink from './shopifyLink'
// #endregion shopify

import {
  LOCKED_DOCUMENT_TYPES,
  // #region shopify
  SHOPIFY_DOCUMENT_TYPES,
  // #endregion shopify
} from '../../constants'

// Types excluded from the 'new document' menu.
const HIDDEN_TEMPLATE_TYPES = [
  ...LOCKED_DOCUMENT_TYPES,
  // #region shopify
  ...SHOPIFY_DOCUMENT_TYPES,
  // #endregion shopify
]

export const resolveDocumentActions: DocumentActionsResolver = (prev, {schemaType}) => {
  // #region shopify
  if (SHOPIFY_DOCUMENT_TYPES.includes(schemaType)) {
    prev = prev.filter(
      (previousAction: DocumentActionComponent) =>
        previousAction.action === 'publish' ||
        previousAction.action === 'unpublish' ||
        previousAction.action === 'discardChanges',
    )

    return [
      ...prev,
      shopifyDelete as DocumentActionComponent,
      shopifyLink as DocumentActionComponent,
    ]
  }
  // #endregion shopify

  if (LOCKED_DOCUMENT_TYPES.includes(schemaType)) {
    prev = prev.filter(
      (previousAction: DocumentActionComponent) =>
        previousAction.action === 'publish' || previousAction.action === 'discardChanges',
    )
  }

  return prev
}

export const resolveNewDocumentOptions: NewDocumentOptionsResolver = (prev) => {
  const options = prev.filter((previousOption) => {
    return !HIDDEN_TEMPLATE_TYPES.includes(previousOption.templateId)
  })

  return options
}

export const customDocumentActions = definePlugin({
  name: 'custom-document-actions',
  document: {
    actions: resolveDocumentActions,
    newDocumentOptions: resolveNewDocumentOptions,
  },
})
