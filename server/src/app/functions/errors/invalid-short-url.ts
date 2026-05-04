export class InvalidShortUrl extends Error {
  constructor() {
    super('URL encurtada mal formatada.')
  }
}
