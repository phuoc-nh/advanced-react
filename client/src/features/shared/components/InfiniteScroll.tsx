import React, { useRef } from 'react'

type InfiniteScrollProps = {
	children: React.ReactNode
	hasNextPage?: boolean
	onLoadMore: () => void
	threshold?: number
}

export default function InfiniteScroll({ children, hasNextPage, onLoadMore, threshold = 500 }: InfiniteScrollProps) {
	const containerRef = useRef<HTMLDivElement>(null);

	React.useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				const target = entries[0];
				if (target.isIntersecting && hasNextPage) { // check if the target is visible in the viewport
					onLoadMore();
				}
			},
			{
				rootMargin: `0px 0px ${threshold}px 0px`, // Adjust the root margin to trigger before reaching the bottom
			}
		);

		const currentContainer = containerRef.current;
		if (currentContainer) {
			observer.observe(currentContainer);
		}
		return () => {
			if (currentContainer) {
				observer.unobserve(currentContainer);
			}
		};

	}, [hasNextPage, onLoadMore, threshold]);

	return (
		<div>
			{children}
			<div ref={containerRef} className='h-1'> </div>
		</div>
	)
}
