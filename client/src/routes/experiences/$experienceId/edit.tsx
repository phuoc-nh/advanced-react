import * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/experiences/$experienceId/edit')({
	component: EditExperiencePage,
})

function EditExperiencePage() {
	return <div>Hello "/experiences/$experienceId/edit"!</div>
}
