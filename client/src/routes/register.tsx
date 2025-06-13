import * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import Card from '@/features/shared/components/ui/Card'
import { RegisterForm } from '@/features/auth/components/RegisterForm'

export const Route = createFileRoute('/register')({
	component: RegisterFormPage,
})

function RegisterFormPage() {
	return <main>
		<Card>
			<RegisterForm />
		</Card>
	</main>
}
