import { createLinkRoute } from './create-link'
import { deleteLinkRoute } from './delete-link'
import { exportLinksCsvRoute } from './export-links-csv'
import { getLinkRoute } from './get-link'
import { getLinksRoute } from './get-links'
import { incrementLinkAccessesRoute } from './increment-link-accesses'

export const routes = [
  createLinkRoute,
  getLinksRoute,
  getLinkRoute,
  deleteLinkRoute,
  incrementLinkAccessesRoute,
  exportLinksCsvRoute,
]
