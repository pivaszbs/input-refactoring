import { StrictMode } from "react";
import { render } from "react-dom";
import { createStore } from "@reatom/core";
import App from "./App";
import { context } from "@reatom/react";
import { connectReduxDevtools } from "@reatom/debug";

const store = createStore();
connectReduxDevtools(store);

render(
	<context.Provider value={store}>
		<StrictMode>
			<App />
		</StrictMode>
	</context.Provider>,
	document.getElementById("root")
);
