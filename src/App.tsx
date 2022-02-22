import TextField from "./components/TextField";
import { textFeildDefaultContextValue, TextFieldDefaultContext } from './components/TextField/context';

export default function App(): JSX.Element {
	return <TextFieldDefaultContext.Provider value={textFeildDefaultContextValue}>
		<TextField />
	</TextFieldDefaultContext.Provider>;
}
