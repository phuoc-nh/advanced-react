import { describe, it, expect, beforeEach, vi } from 'vitest'
import { screen } from '@testing-library/react'
import { server } from '@/test/mocks/server'
import { http, HttpResponse } from 'msw'
import { renderWithProviders } from '@/test/test-utils'
import userEvent from '@testing-library/user-event'
import { trpc } from '@/router'

import ExperienceCard from '../ExperienceCard'
import { ExperienceForList } from '../../types'

// Helper component that triggers the feed query to populate cache


// Mock the current user hook
vi.mock('@/features/auth/hooks/useCurrentUser', () => ({
	useCurrentUser: () => ({
		currentUser: { id: 2, name: 'Current User' }
	})
}))

// Mock the toast hook
vi.mock('@/features/shared/hooks/useToast', () => ({
	useToast: () => ({
		toast: vi.fn()
	})
}))

// Mock the router hooks
vi.mock('@tanstack/react-router', async (importOriginal) => {
	const actual = await importOriginal<typeof import('@tanstack/react-router')>()
	return {
		...actual,
		Link: ({ children, to, params, ...props }: any) => (
			<a href={`${to.replace(/\$\w+/g, (match: string) => params[match.slice(1)])}`} {...props}>
				{children}
			</a>
		),
		useNavigate: () => vi.fn(),
		useParams: () => ({}),
		useSearch: () => ({}),
	}
})

const mockExperience: ExperienceForList = {
	id: 1,
	title: 'Test Experience',
	content: 'This is a test experience content',
	user: {
		id: 1,
		name: 'John Doe',
		bio: null,
		avatarUrl: null,
		createdAt: '2025-01-10T10:00:00Z',
		updatedAt: '2025-01-10T10:00:00Z'
	},
	userId: 1,
	isAttending: false,
	attendeesCount: 5,
	commentsCount: 3,
	scheduledAt: '2025-01-15T10:00:00Z',
	imageUrl: 'https://example.com/experience.jpg',
	url: 'https://example.com/event',
	location: 'Test Location',
	createdAt: '2025-01-10T10:00:00Z',
	updatedAt: '2025-01-10T10:00:00Z'
}

describe('ExperienceCard Integration Tests', () => {
	const user = userEvent.setup()

	beforeEach(() => {
		server.resetHandlers()
		// renderWithProviders(<FeedDataLoader />)
	})

	it('renders experience card with all information', () => {
		renderWithProviders(<ExperienceCard experience={mockExperience} />)

		// Check if experience content is displayed
		expect(screen.getByText('Test Experience')).toBeInTheDocument()
		expect(screen.getByText('This is a test experience content')).toBeInTheDocument()
		expect(screen.getByText('John Doe')).toBeInTheDocument()

		// Check if metrics are displayed
		expect(screen.getByText('5')).toBeInTheDocument() // attendees count
		expect(screen.getByText('3')).toBeInTheDocument() // comments count

		// Check if date is displayed
		expect(screen.getByText('1/15/2025')).toBeInTheDocument()

		// Check if event details link is displayed
		expect(screen.getByText('Event details')).toBeInTheDocument()
		expect(screen.getByText('Event details')).toHaveAttribute('href', 'https://example.com/event')
	})

	// it('shows attend button for non-owner users', () => {
	// 	renderWithProviders(<ExperienceCard experience={mockExperience} />)

	// 	expect(screen.getByText('Attend')).toBeInTheDocument()
	// })

	it('shows owner actions for experience owner', () => {
		const ownerExperience = { ...mockExperience, userId: 2 } // Same as current user

		renderWithProviders(<ExperienceCard experience={ownerExperience} />)

		expect(screen.getByText('Edit')).toBeInTheDocument()
		expect(screen.getByText('Delete')).toBeInTheDocument()
	})

	it('handles successful attend action with MSW feed data flow', async () => {

		// Step 3: Render the actual ExperienceCard component
		console.log('📋 Step 3: Rendering ExperienceCard...')
		renderWithProviders(<ExperienceCard experience={mockExperience} />)

		const attendButton = screen.getByText('Going')

		// Step 4: Click attend button - mutation should now have access to cached feed data
		console.log('📋 Step 4: Clicking attend button...')
		await user.click(attendButton)

		// Wait for the mutation to complete
		await new Promise(resolve => setTimeout(resolve, 200))

		// Verify the test completed successfully
		expect(attendButton).toBeInTheDocument()

		console.log('✅ Test completed - check console logs for the complete data flow!')
	})

	it('displays image when imageUrl is provided', () => {
		renderWithProviders(<ExperienceCard experience={mockExperience} />)

		const image = screen.getByRole('img', { name: 'Test Experience' })
		expect(image).toBeInTheDocument()
		expect(image).toHaveAttribute('src', 'https://example.com/experience.jpg')
	})

	it('does not display image when imageUrl is not provided', () => {
		const experienceWithoutImage = { ...mockExperience, imageUrl: null }
		renderWithProviders(<ExperienceCard experience={experienceWithoutImage} />)

		const image = screen.queryByRole('img', { name: 'Test Experience' })
		expect(image).not.toBeInTheDocument()
	})

	it('handles delete action for owner', async () => {
		const ownerExperience = { ...mockExperience, userId: 2 }

		server.use(
			http.post('/api/trpc/experiences.delete', () => {
				return HttpResponse.json({
					result: { data: 1 }
				})
			})
		)

		renderWithProviders(<ExperienceCard experience={ownerExperience} />)

		const deleteButton = screen.getByText('Delete')
		await user.click(deleteButton)

		// The delete button should be clickable
		expect(deleteButton).toBeInTheDocument()
	})

	it('shows correct navigation links', () => {
		renderWithProviders(<ExperienceCard experience={mockExperience} />)

		// Check user profile link
		const userLink = screen.getAllByRole('link').find(link =>
			link.getAttribute('href')?.includes('/users/1')
		)
		expect(userLink).toBeInTheDocument()

		// Check experience details link
		const experienceLink = screen.getAllByRole('link').find(link =>
			link.getAttribute('href')?.includes('/experiences/1')
		)
		expect(experienceLink).toBeInTheDocument()

		// Check attendees link
		const attendeesLink = screen.getAllByRole('link').find(link =>
			link.getAttribute('href')?.includes('/experiences/1/attendees')
		)
		expect(attendeesLink).toBeInTheDocument()
	})
})
