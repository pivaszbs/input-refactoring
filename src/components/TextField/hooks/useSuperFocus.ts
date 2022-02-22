import { useAction } from "@reatom/react";
import { popFromSuperFocus, pushToSuperFocus } from "@app/components/TextField/entities/focus";
import { useEffect } from "react";

export function useSuperFocus(selector: string | null, priority: number) {
	const pushFocus = useAction(pushToSuperFocus);
	const popFocus = useAction(popFromSuperFocus);
	useEffect(() => {
		pushFocus({
			selector,
			priority
		});

		return () => popFocus(priority);
	}, []);
}
