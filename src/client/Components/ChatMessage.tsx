import { GetClientLuaChatService } from "@rbxts/chat-service";
import Roact from "@rbxts/roact";
import { TextService } from "@rbxts/services";
import ChatService from "@rbxts/chat-service";
import {
	ChatFont,
	ChatTextBackground,
	ChatTextBackgroundTransparency,
	ChatTextColor,
	ChatTextSize,
} from "client/Consts";

interface ChatMessageProps {
	chatMessage: ChatService.ChatMessage;
}
interface ChatMessageState {}

const chatService = GetClientLuaChatService();

export class ChatMessage extends Roact.PureComponent<ChatMessageProps, ChatMessageState> {
	render() {
		let message = this.props.chatMessage;

		// Roblox localises system messages. This uses the default (English).
		let messageText = message.Message || "#".rep(message.MessageLength);
		let [defaultStart, defaultEnd] = messageText.find("{RBX_LOCALIZATION_DEFAULT}");
		if (defaultStart) {
			let [paramStart, paramEnd] = messageText.find("{RBX_LOCALIZATION_PARAMS}");
			if (paramStart) {
				messageText = messageText.sub(defaultEnd! + 1, paramStart! - 1);
			} else {
				messageText = messageText.sub(defaultEnd! + 1);
			}
		}

		// Calculate size for the individual pieces of text
		let nameSize = message.FromSpeaker
			? TextService.GetTextSize(message.FromSpeaker, 24, Enum.Font.Arial, new Vector2(0, 24))
			: // System messages have no sender so it's important to have a fallback
			  new Vector2(0, 24);
		let messageSize = TextService.GetTextSize(messageText, 24, Enum.Font.Arial, new Vector2(0, 24));

		return (
			<frame BackgroundTransparency={1} BorderSizePixel={0} Size={UDim2.fromOffset(0, ChatTextSize)}>
				<textlabel
					BackgroundColor3={ChatTextBackground}
					BackgroundTransparency={ChatTextBackgroundTransparency}
					Size={UDim2.fromOffset(nameSize.X + ChatTextSize / 2, nameSize.Y)}
					Font={message.ExtraData?.Font || ChatFont}
					TextSize={ChatTextSize}
					BorderSizePixel={0}
					TextXAlignment={Enum.TextXAlignment.Left}
					TextColor3={message.ExtraData?.NameColor || ChatTextColor}
					Text={message.FromSpeaker || ""}
				></textlabel>
				<textlabel
					BackgroundColor3={ChatTextBackground}
					BackgroundTransparency={ChatTextBackgroundTransparency}
					BorderSizePixel={0}
					Position={UDim2.fromOffset(nameSize.X + ChatTextSize / 2, 0)}
					Size={UDim2.fromOffset(messageSize.X, messageSize.Y)}
					Font={message.ExtraData?.Font || ChatFont}
					TextSize={message.ExtraData?.TextSize || ChatTextSize}
					TextXAlignment={Enum.TextXAlignment.Left}
					TextColor3={message.ExtraData?.ChatColor || ChatTextColor}
					Text={messageText}
				></textlabel>
			</frame>
		);
	}
}
