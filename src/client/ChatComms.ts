import { GetClientLuaChatService } from "@rbxts/chat-service";
import { MessagingService, ReplicatedStorage } from "@rbxts/services";

const chatSystem = ReplicatedStorage.WaitForChild("DefaultChatSystemChatEvents") as Folder;
const ChatMain = GetClientLuaChatService();
export const sendEvent = chatSystem.WaitForChild("SayMessageRequest") as RemoteEvent;
export const recvEvent = chatSystem.WaitForChild("OnNewMessage") as RemoteEvent;
export const fltrEvent = chatSystem.WaitForChild("OnMessageDoneFiltering") as RemoteEvent;
export const sysmEvent = chatSystem.WaitForChild("OnNewSystemMessage") as RemoteEvent;

export function sendMessage(message: string) {
	if (message.size() < 1) return;
	if (message.sub(1, 1) !== "/") sendEvent.FireServer(message, "All");
	ChatMain.MessagePosted.fire(message); // thanks Kiriot22, https://devforum.roblox.com/t/fire-the-builtin-player-chatted-event-from-my-script/271745/3?u=thelmgn
}
