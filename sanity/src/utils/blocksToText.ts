type TextBlock = {
  _type: string
  children?: {text?: string}[]
}

/**
 * @name blocksToText
 * @function
 * @description Flattens portable text to plain text, e.g. for a Studio preview subtitle.
 * A plain string passes through, which keeps previews working while a field migrates
 * from `string` to portable text.
 * @param {TextBlock[] | string | undefined} blocks - The portable text value.
 * @returns {string} The plain text, with blocks separated by a space.
 */
const blocksToText = (blocks: TextBlock[] | string | undefined = []): string => {
  if (typeof blocks === 'string') return blocks

  return blocks
    .filter((block) => block._type === 'block' && block.children)
    .map((block) => block.children!.map((child) => child.text ?? '').join(''))
    .join(' ')
}

export default blocksToText
