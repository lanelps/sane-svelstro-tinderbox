import React from 'react'
import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'scriptInline',
  title: 'Script Inline',
  type: 'object',
  icon: () => '📜',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'value',
      title: 'Value',
      type: 'text',
      description: (
        <>
          Be sure to remove any <code>{'<script>'}</code> tags from the code.
        </>
      ),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      value: 'value',
    },
    prepare: ({title, value}) => ({
      title,
      subtitle: value,
    }),
  },
})
