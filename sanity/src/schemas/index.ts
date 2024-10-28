// singletons
import homePage from './singletons/homePage'
import settings from './singletons/settings'

const singletons = [homePage, settings] as any[]

// documents
import project from './documents/project'

const documents = [project] as any[]

// sections
import exampleSection from './sections/example'

const sections = [exampleSection] as any[]

// objects
import altImage from './objects/altImage'
import media from './objects/media'
import portableText from './objects/portableText'
import scriptInline from './objects/scriptInline'
import scriptSrc from './objects/scriptSrc'
import seoPage from './objects/seo/page'
import seoSettings from './objects/seo/settings'
import video from './objects/video'

const objects = [
  altImage,
  media,
  portableText,
  scriptInline,
  scriptSrc,
  seoPage,
  seoSettings,
  video,
] as any[]

export const schemaTypes = [...singletons, ...documents, ...sections, ...objects]
