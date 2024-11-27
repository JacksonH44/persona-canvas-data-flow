const { widget } = figma;
const { AutoLayout, Text, useSyncedState } = widget;

interface UserStory {
  content: string;
}

function Widget() {
  const [storyData, setStoryData] = useSyncedState<string[]>("data", []);

  async function fetchStoryData() {
    try {
      // const response = await fetch("http://localhost:8000/personas/")
      // const data = await response.json();
      // const contents = data.items.map((i: UserStory) => {
      //   return i.content
      // })
      // setStoryData(contents)
    } catch (error) {
      console.error("Error fetching user stories:", error)
    }
  }

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
      <AutoLayout
        width={200}
        height={50}
        fill="#007AFF"
        cornerRadius={8}
        onClick={fetchStoryData}
        horizontalAlignItems="center"
        verticalAlignItems="center"
      >
        <Text fill="#FFFFFF" fontSize={16}>Generate User Stories</Text>
      </AutoLayout>
      <AutoLayout
        direction="vertical" 
        horizontalAlignItems="start" 
        verticalAlignItems="start" 
        spacing={4} 
      >
        <Text fontSize={24} fill="#000000">
          User story:
        </Text>
        {storyData.map((content: string, index) => {
          return (
            <Text fontSize={16} key={index} fill="#000000">
              {content}
            </Text>
          )
        })}
      </AutoLayout>
    </AutoLayout>
  );
}
widget.register(Widget);
