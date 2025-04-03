import {defineField, defineType} from 'sanity'

export const projectsListSectionType = defineType({
  name: 'projectsList.section',
  title: 'Projects List',
  type: 'object',
  fields: [
    defineField({
      name: 'projects',
      title: 'Projects',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'project'}]}],
    }),
  ],

  preview: {
    select: {
      projects: 'projects',
    },

    prepare: ({projects}) => {
      const subtitle =
        projects?.length > 9 ? `${projects.length} projects` : `${projects.length} project`

      return {
        title: `Projects List`,
        subtitle: subtitle || 'No projects',
      }
    },
  },
})
