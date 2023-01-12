import { createSearchIndex, createUniqueServiceIndex } from "../modules/service/crud";

export default async function () {
  await createSearchIndex();
  await createUniqueServiceIndex();
}
