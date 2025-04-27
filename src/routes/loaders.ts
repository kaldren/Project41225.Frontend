import { LoaderFunctionArgs, useLoaderData } from "react-router";
import { PageLoaderRouteParams } from "./types";

export async function pageRouteLoader(args: LoaderFunctionArgs): Promise<PageLoaderRouteParams> {
  return {
    id: args.params.id,
    childId: args.params.childId,
  };
}

export function usePageParams(): PageLoaderRouteParams {
  return useLoaderData() as PageLoaderRouteParams;
}
