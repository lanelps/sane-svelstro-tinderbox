import {LockIcon} from '@sanity/icons'
import {Box, Text, TextInput, Tooltip} from '@sanity/ui'
import {
  type StringInputProps,
  useFormValue,
  type SanityDocument,
  type StringSchemaType,
} from 'sanity'

type Props = StringInputProps<StringSchemaType & {options?: {field?: string}}>

const ProxyString = (props: Props) => {
  const {schemaType} = props

  const path = schemaType?.options?.field
  const doc = useFormValue([]) as SanityDocument

  const proxyValue = path?.split('.').reduce((obj: any, key) => obj?.[key], doc) ?? ''

  return (
    <Tooltip
      content={
        <Box padding={2}>
          <Text muted size={1}>
            This value is set in Shopify (<code>{path}</code>)
          </Text>
        </Box>
      }
      portal
    >
      <TextInput iconRight={LockIcon} readOnly={true} value={proxyValue} />
    </Tooltip>
  )
}

export default ProxyString
