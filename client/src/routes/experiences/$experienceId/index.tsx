import * as React from 'react'
import { createFileRoute, notFound } from '@tanstack/react-router'
import { z } from 'zod'
import { isTRPCClientError, trpc } from '@/router'
import { ExperienceDetails } from '@/features/experiences/components/ExperienceDetail'
import CommentsSection from '@/features/comments/components/CommentsSection'

export const Route = createFileRoute('/experiences/$experienceId/')({
  params: {
    parse: (params) => ({
      experienceId: z.coerce.number().parse(params.experienceId),
    }),
  },
  component: ExperiencePage,
  loader: async ({ params, context: { trpcQueryUtils } }) => {
    try {
      await trpcQueryUtils.experiences.byId.ensureData({
        id: params.experienceId,
      })
    } catch (error) {
      if (isTRPCClientError(error) && error.data?.code === 'NOT_FOUND') {
        throw notFound();
      }

      throw error;
    }
  },
})

function ExperiencePage() {
  const { experienceId } = Route.useParams()

  const [experience, query] = trpc.experiences.byId.useSuspenseQuery({
    id: experienceId,
  })

  return (
    <main className="space-y-4 pb-20">
      <ExperienceDetails experience={experience} />
      <CommentsSection
        experienceId={experience.id}
        commentsCount={experience.commentsCount}
      />
    </main>
  )
}
