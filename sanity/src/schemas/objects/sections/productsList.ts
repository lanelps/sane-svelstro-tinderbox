import {defineField, defineType} from 'sanity'

export const productsListSectionType = defineType({
  name: 'section.productsList',
  title: 'Products List',
  type: 'object',
  fields: [
    defineField({
      name: 'products',
      title: 'Products',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'product'}]}],
    }),
  ],

  preview: {
    select: {
      products: 'products',
    },

    prepare: ({products}) => {
      const subtitle =
        products?.length > 9 ? `${products.length} products` : `${products.length} product`

      return {
        title: 'Products List',
        subtitle: subtitle || 'No products',
      }
    },
  },
})
