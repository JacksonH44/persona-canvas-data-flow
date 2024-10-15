const { widget } = figma;
const { AutoLayout } = widget;

import { Face } from "./face";

function Persona() {
  const [personaData, setPersonaData] = widget.useSyncedState("data", []);

  widget.useEffect(() => {
    console.log('Effect used!')
  })

  return (
    <AutoLayout
      direction="horizontal"
      horizontalAlignItems="center"
      verticalAlignItems="center"
      height="hug-contents"
      padding={8}
      fill="#FFFFFF"
      cornerRadius={8}
      spacing={12}
    >
      <Face />
    </AutoLayout>
  );
}
widget.register(Persona);
