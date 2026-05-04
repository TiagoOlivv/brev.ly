export class LinkAlreadyExists extends Error {
  constructor() {
    super('URL encurtada já existente.')
  }
}
