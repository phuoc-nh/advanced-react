import * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import Card from '@/features/shared/components/ui/Card'
import { CreateExperienceForm } from '@/features/experiences/components/CreaetExperienceForm'

export const Route = createFileRoute('/experiences/create')({
  component: CreateExperienceComponent,
})

function CreateExperienceComponent() {


  return <main className="space-y-4">
    <h1 className="text-2xl font-bold">Create Experience</h1>
    <Card>
      <CreateExperienceForm
      />
    </Card>
  </main>
}
