import {defineArrayMember, defineType} from 'sanity'

export default defineType({
  name: 'portableText',
  title: 'Portable Text',
  type: 'array',
  of: [
    defineArrayMember({
      name: 'block',
      title: 'Block',
      type: 'block',

      styles: [{title: `Normal`, value: `normal`}],

      lists: [{title: `Bullet`, value: `bullet`}],

      // Marks let you mark up inline text in the block editor.
      marks: {
        // Decorators usually describe a single property – e.g. a typographic
        // preference or highlighting by editors.
        decorators: [
          {title: `Strong`, value: `strong`},
          {title: `Emphasis`, value: `em`},
          {title: `Underline`, value: `underline`},
        ],
        // Annotations can be any object structure – e.g. a link or a footnote.
        annotations: [
          {
            name: `link`,
            title: `URL`,
            type: `object`,
            fields: [
              {
                name: `href`,
                title: `URL`,
                type: `string`,
              },
              {
                name: `isExternal`,
                title: `External?`,
                type: `boolean`,
                description: `Opens link in new tab`,
                initialValue: false,
              },
            ],
          },
        ],
      },
    }),
    // defineArrayMember({
    //   title: `Alt Image`,
    //   type: `altImage`,
    // }),
  ],
})
