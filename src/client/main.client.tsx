import Roact from "@rbxts/roact";
import { Players } from "@rbxts/services";
import { Chat } from "./Components/Chat";

const playerGui = Players!.LocalPlayer!.FindFirstChild!("PlayerGui") as PlayerGui;

Roact.mount(<Chat></Chat>, playerGui, "UI");
