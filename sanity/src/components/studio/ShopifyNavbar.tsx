// #shopify-file
import {Box, Button, Card, Flex} from '@sanity/ui'
import type {NavbarProps} from 'sanity'

import {SHOPIFY_STORE_ID} from '../../constants'
import ShopifyIcon from '../icons/Shopify'

/**
 * Studio navbar with a shortcut through to the Shopify admin.
 * Rendered only when SANITY_STUDIO_SHOPIFY_STORE_ID is set.
 */
export default function ShopifyNavbar(props: NavbarProps) {
  return (
    <Card>
      <Flex align="center">
        <Box flex={1}>{props.renderDefault(props)}</Box>
        <Card paddingY={2} paddingRight={2} borderBottom={true}>
          <Button
            as="a"
            href={`https://admin.shopify.com/store/${SHOPIFY_STORE_ID}`}
            mode="bleed"
            title="Open Shopify Admin"
            target="_blank"
            padding={1}
          >
            <ShopifyIcon />
          </Button>
        </Card>
      </Flex>
    </Card>
  )
}
