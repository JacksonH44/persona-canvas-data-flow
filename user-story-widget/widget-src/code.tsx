const { widget } = figma;
const { AutoLayout, Text, Input, useSyncedState } = widget;

interface UserStory {
  content: string;
}

function Widget() {
  const [storyData, setStoryData] = useSyncedState<string[]>("data", []);
  const [productDesc, setProductDesc] = useSyncedState<string>("product", "")

  async function fetchStoryData() {
    try {
      const response = await fetch("http://localhost:8000/userstory/")
      const contents = [await response.json()]
      setStoryData(contents)
    } catch (error) {
      console.error("Error fetching user stories:", error)
    }
  }

  return (
    <AutoLayout
      direction="vertical"
      height="hug-contents"
      padding={8}
      fill="#FFFFFF"
      cornerRadius={8}
      spacing={12}
    >
      {/* Product Description */}
      <AutoLayout
        direction="vertical" 
        horizontalAlignItems="start" 
        verticalAlignItems="start" 
        spacing={8}
        width="hug-contents"
        stroke="#FFFFFF"
        strokeWidth={1}
      >
        <Text fontSize={24} fill="#000000">
          Product Description:
        </Text>
        <AutoLayout
          stroke="#000000"
          strokeWidth={1}
          width={300}
          height={80}
          padding={8}
        >
          <Input
            value={productDesc}
            placeholder="Enter product description..."
            fontSize={16}
            onTextEditEnd={(e) => setProductDesc(e.characters)}
            fill="#000000"
            width="fill-parent"
            height="fill-parent"
          />
        </AutoLayout>
        
      </AutoLayout>

      {/* Generate User Stories button */}
      <AutoLayout
        width={"fill-parent"}
        horizontalAlignItems={"center"}
      >
        <AutoLayout
          width={200}
          height={50}
          fill="#42A5F5"
          cornerRadius={8}
          onClick={fetchStoryData}
          horizontalAlignItems="center"
          verticalAlignItems="center"
        >
          <Text fill="#FFFFFF" fontSize={16} fontWeight={"bold"}>Generate User Stories</Text>
        </AutoLayout>
      </AutoLayout>

      {/* User Stories section */}
      <AutoLayout
        direction="vertical" 
        horizontalAlignItems="start" 
        verticalAlignItems="start" 
        spacing={4} 
      >
        <Text fontSize={24} fill="#000000">
          {storyData.length != 0 ? "User story:" : ""}
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
