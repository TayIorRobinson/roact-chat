import { GetClientLuaChatService } from "@rbxts/chat-service";
import Roact from "@rbxts/roact";
import { UserInputService } from "@rbxts/services";
import { sendMessage } from "client/ChatComms";
import {
	ChatBoxActiveBackground,
	ChatBoxBackground,
	ChatBoxFont,
	ChatBoxPlaceholderText,
	ChatBoxPlaceholderTextColor,
	ChatBoxTextColor,
	ChatBoxTextSize,
} from "client/Consts";

interface ChatBoxProps {
	value?: string;
}
interface ChatBoxState {
	active: boolean;
}

const chatService = GetClientLuaChatService();

export class ChatBox extends Roact.Component<ChatBoxProps, ChatBoxState> {
	ref: Roact.Ref<TextBox>;
	constructor() {
		super({
			value: "",
		});
		this.ref = Roact.createRef<TextBox>();
	}
	state = {
		active: false,
	};
	didMount() {
		UserInputService.InputEnded.Connect((input, gameProcessed) => {
			if (gameProcessed) return false;
			if (input.KeyCode === Enum.KeyCode.Slash) this.ref.getValue()?.CaptureFocus();
		});
	}
	render() {
		return (
			<textbox
				Ref={this.ref}
				BackgroundColor3={this.state.active ? ChatBoxActiveBackground : ChatBoxBackground}
				Position={new UDim2(0, 0, 1, -24)}
				Size={new UDim2(1, 0, 0, ChatBoxTextSize)}
				Font={ChatBoxFont}
				TextSize={ChatBoxTextSize}
				PlaceholderColor3={ChatBoxPlaceholderTextColor}
				PlaceholderText={this.state.active ? "" : ChatBoxPlaceholderText}
				TextXAlignment={Enum.TextXAlignment.Left}
				TextColor3={ChatBoxTextColor}
				Text={this.props.value || ""}
				Event={{
					Focused: () => {
						this.setState({ active: true });
					},
					FocusLost: () => {
						sendMessage(this.ref.getValue()!.Text);
						this.props.value = "";
						this.setState({ active: false });
					},
				}}
			></textbox>
		);
	}
}
