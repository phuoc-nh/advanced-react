import { useState, useEffect } from 'react';
import { startKeepAlive, stopKeepAlive, pingServer } from '../../../lib/utils/keep-alive';

export function KeepAliveControl() {
	const [isRunning, setIsRunning] = useState(false);
	const [lastPing, setLastPing] = useState<string | null>(null);

	useEffect(() => {
		// Assume it's running in production
		if (import.meta.env.PROD) {
			setIsRunning(true);
		}
	}, []);

	const handleStart = () => {
		startKeepAlive();
		setIsRunning(true);
	};

	const handleStop = () => {
		stopKeepAlive();
		setIsRunning(false);
	};

	const handleManualPing = async () => {
		await pingServer();
		setLastPing(new Date().toLocaleTimeString());
	};

	// Only show in development mode for debugging
	if (import.meta.env.PROD) {
		return null;
	}

	return (
		<div className="fixed bottom-4 right-4 bg-white border border-gray-300 rounded-lg p-4 shadow-lg">
			<h3 className="text-sm font-semibold mb-2">Keep-Alive Control</h3>

			<div className="space-y-2">
				<div className="flex items-center gap-2">
					<span className={`w-2 h-2 rounded-full ${isRunning ? 'bg-green-500' : 'bg-red-500'}`}></span>
					<span className="text-xs">{isRunning ? 'Running' : 'Stopped'}</span>
				</div>

				<div className="flex gap-2">
					<button
						onClick={handleStart}
						disabled={isRunning}
						className="px-2 py-1 text-xs bg-green-500 text-white rounded disabled:opacity-50"
					>
						Start
					</button>
					<button
						onClick={handleStop}
						disabled={!isRunning}
						className="px-2 py-1 text-xs bg-red-500 text-white rounded disabled:opacity-50"
					>
						Stop
					</button>
					<button
						onClick={handleManualPing}
						className="px-2 py-1 text-xs bg-blue-500 text-white rounded"
					>
						Ping
					</button>
				</div>

				{lastPing && (
					<div className="text-xs text-gray-600">
						Last manual ping: {lastPing}
					</div>
				)}
			</div>
		</div>
	);
}
