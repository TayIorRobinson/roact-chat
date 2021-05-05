import ChatService from "@rbxts/chat-service";
import Roact from "@rbxts/roact";
import { fltrEvent, recvEvent, sysmEvent } from "client/ChatComms";

import { ChatHeight } from "client/Consts";
import { ChatBox } from "./ChatBox";
import { ChatMessage } from "./ChatMessage";

interface ChatProps {}
interface ChatState {}
export class Chat extends Roact.Component<ChatProps, ChatState> {
	chatLog: Map<number, ChatService.ChatMessage>;
	logChanged = false;
	constructor(P: ChatProps) {
		super(P);
		this.chatLog = new Map<number, ChatService.ChatMessage>();
		recvEvent.OnClientEvent.Connect((msg: ChatService.ChatMessage) => this.handleIncomingMessage(msg));
		sysmEvent.OnClientEvent.Connect((msg: ChatService.ChatMessage) => this.handleIncomingMessage(msg));
		fltrEvent.OnClientEvent.Connect((msg: ChatService.ChatMessage) => this.handleIncomingMessage(msg));
	}
	handleIncomingMessage(msg: ChatService.ChatMessage) {
		this.chatLog.set(msg.ID, msg);
		this.logChanged = true;
		this.setState({});
	}
	shouldUpdate() {
		if (this.logChanged) {
			this.logChanged = false;
			return true;
		}
		return false;
	}
	render() {
		let ChatMessages = new Map<number, Roact.Element>();
		ChatMessages.set(
			-1,
			<uilistlayout
				VerticalAlignment={Enum.VerticalAlignment.Bottom}
				HorizontalAlignment={Enum.HorizontalAlignment.Left}
			></uilistlayout>,
		);
		for (let message of this.chatLog) {
			ChatMessages.set(message[0], <ChatMessage chatMessage={message[1]}></ChatMessage>);
		}
		return (
			<screengui ResetOnSpawn={false}>
				<frame BackgroundTransparency={1} BorderSizePixel={0} Size={UDim2.fromOffset(0, ChatHeight)}>
					{ChatMessages}
				</frame>
				<ChatBox></ChatBox>
			</screengui>
		);
	}
}
