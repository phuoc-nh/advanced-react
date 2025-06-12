import { useRouter } from "@tanstack/react-router";
import { AlertTriangle, RefreshCcw } from "lucide-react";

import { Button } from "./ui/Button";
import Card from "./ui/Card";

export function NotFoundComponent() {
	const router = useRouter();

	return (
		<Card className="flex flex-col items-center justify-center gap-2">
			<AlertTriangle className="h-8 w-8" />
			<p>The page you are looking for could not be found.</p>
		</Card>
	);
}