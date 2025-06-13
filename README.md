conditionally choose trpc link. batchlink for json request, httpLink for non-json request
conditionally invalidate queries based on current location
if remove experience at current location, it should be removed from the list
invalidate queries really matter, make sure to use it wisely dont overuse it
optimistic updates: use useMutate callback to run logic before actual mutation. Prevent on-going requests if any. Manually update cache with intended data
lastly, if error occurs, revert cache to previous state