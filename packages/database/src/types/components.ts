export enum DiscordButtonStyle {
  LINK = 5,
}

export interface IDiscordEmbedField {
  name: string;
  value: string;
  inline?: boolean;
}

export interface IDiscordEmbed {
  title?: string;
  description?: string;
  color?: string;
  footer?: { text: string; icon_url?: string };
  image?: { url: string };
  thumbnail?: { url: string };
  author?: { name: string; url?: string; icon_url?: string };
  timestamp?: string;
  url?: string;
  provider?: {
    name: string;
    url?: string;
  };
  fields?: IDiscordEmbedField[]; // discord limits to 25 fields
}

export interface IDiscordButton {
  style: DiscordButtonStyle.LINK;
  url: string;
  label?: string;
  emoji?: { id: string; name: string; animated: boolean };
  disabled?: boolean;
}
