import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";
import { promptReplaceList, promptTemplate } from "../constants/commentary";

// Initialize the Bedrock client
const bedrockClient = new BedrockRuntimeClient({
  region: process.env.REACT_APP_AWS_REGION,
  credentials: {
    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
  },
});

// Memory to store the last 10 conversation messages
const memory = [];

function updateMemory(modelResponse) {
  memory.push({ role: "assistant", content: modelResponse });
  if (memory.length > 2) {
    memory.shift(); // Remove the oldest message if memory exceeds 10 conversations (20 messages)
    memory.shift();
  }
}

function preparePrompt(gameContext) {
  let currentPromptTemplate = JSON.parse(JSON.stringify(promptTemplate));
  promptReplaceList.forEach((item) => {
    currentPromptTemplate = currentPromptTemplate.replaceAll(
      `<${item}>`,
      gameContext[item]
    );
  });

  return currentPromptTemplate;
}

function formatModelResponse(modelResponse) {
  try {
    modelResponse = modelResponse.replace("json```", "").replace("```", "");

    const parsedResponse = JSON.parse(modelResponse);
    return parsedResponse;
  } catch (error) {
    console.error("Error parsing model response:", error);
    return null;
  }
}

async function getCommentaryText(
  gameContext,
  modelId = "anthropic.claude-3-5-sonnet-20240620-v1:0"
) {
  let currentPrompt = preparePrompt(gameContext);

  const messages = [...memory, { role: "user", content: currentPrompt }];

  // Prepare the payload for the model.
  let payload = {
    anthropic_version: "bedrock-2023-05-31",
    max_tokens: 1000,
    messages: messages,
  };

  // Invoke Claude with the payload and wait for the response.
  const command = new InvokeModelCommand({
    contentType: "application/json",
    accept: "application/json",
    body: JSON.stringify(payload),
    modelId,
  });
  const apiResponse = await bedrockClient.send(command);

  // Decode and return the response(s)
  const decodedResponseBody = new TextDecoder().decode(apiResponse.body);

  const responseBody = JSON.parse(decodedResponseBody);

  // Update memory with the current response
  let assistantResponse = await responseBody.content[0].text;
  updateMemory(assistantResponse);

  assistantResponse = formatModelResponse(assistantResponse);

  return assistantResponse;
}

export default getCommentaryText;
