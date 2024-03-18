export function pagingParser ({ responseList, currentList, params }) {
  let result = currentList
  if (params.offset === 0) {
    result = responseList
  } else {
    if (params.offset + responseList.length !== currentList.length) {
      result = result?.concat(responseList) || []
    }
  }
  let hasMore = true
  if (responseList.length < params.pageSize) {
    hasMore = false
  }

  return {
    list: result,
    hasMore,
  }
}
