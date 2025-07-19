import { http, HttpResponse } from 'msw'

// Mock data
const mockUser = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  imageUrl: 'https://example.com/avatar.jpg'
}

const mockExperience = {
  id: 1,
  title: 'Test Experience',
  content: 'This is a test experience content',
  user: mockUser,
  userId: '2',
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

export const handlers = [
  // Experience feed endpoints
  http.get('/api/trpc/experiences.feed', () => {
    return HttpResponse.json({
      result: {
        data: {
          experiences: [mockExperience],
          nextCursor: null
        }
      }
    })
  }),

  // Experience by ID
  http.get('/api/trpc/experiences.byId', () => {
    return HttpResponse.json({
      result: {
        data: mockExperience
      }
    })
  }),

  // Experience attend mutation - both URL formats for safety
  http.post('/api/trpc/experiences.attend', () => {
    return HttpResponse.json({
      result: {
        data: { success: true }
      }
    })
  }),

  // Experience unattend mutation - both URL formats
  http.post('/api/trpc/experiences.unattend', () => {
    return HttpResponse.json({
      result: {
        data: { id: 1 }
      }
    })
  }),

  // Experience delete mutation - both URL formats
  http.post('/api/trpc/experiences.delete', () => {
    return HttpResponse.json({
      result: {
        data: 1
      }
    })
  }),

  // Experience create mutation - both URL formats
  http.post('/api/trpc/experiences.create', () => {
    return HttpResponse.json({
      result: {
        data: { ...mockExperience, id: Date.now() }
      }
    })
  }),


  // Comments endpoints
  http.get('/api/trpc/comments.byExperienceId', () => {
    return HttpResponse.json({
      result: {
        data: {
          comments: [],
          nextCursor: null
        }
      }
    })
  }),

  // Auth endpoints
  http.get('/api/trpc/auth.me', () => {
    return HttpResponse.json({
      result: {
        data: {
          id: '2',
          name: 'Current User',
          email: 'current@example.com',
          imageUrl: 'https://example.com/current-avatar.jpg'
        }
      }
    })
  }),

  // Error scenarios - can be used to override in specific tests
  http.post('/api/trpc/experiences.attend.error', () => {
    return HttpResponse.json({
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to attend experience'
      }
    }, { status: 500 })
  }),

  http.post('/api/trpc/experiences.delete.error', () => {
    return HttpResponse.json({
      error: {
        code: 'FORBIDDEN',
        message: 'Not authorized to delete this experience'
      }
    }, { status: 403 })
  })
]
