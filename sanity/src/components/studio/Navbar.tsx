import type {NavbarProps} from 'sanity'

// #region shopify
import {SHOPIFY_STORE_ID} from '../../constants'
import ShopifyNavbar from './ShopifyNavbar'
// #endregion shopify

export default function Navbar(props: NavbarProps) {
  // #region shopify
  if (SHOPIFY_STORE_ID) return <ShopifyNavbar {...props} />
  // #endregion shopify

  return props.renderDefault(props)
}
