import {defineField} from 'sanity'
import {SECTION_REFERENCES} from '../../constants'

export default defineField({
  name: 'sections',
  title: 'Sections',
  type: 'array',
  group: 'content',
  of: SECTION_REFERENCES,
})
