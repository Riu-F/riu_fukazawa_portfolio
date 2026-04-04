export type BoardItemType =
  | "instructionCard"
  | "placeholderObject"
  | "stickerObject"
  | "polaroidObject"
  | "photoStackObject";

export type BoardStackImage = { src: string; alt?: string };

export type BoardItem = {
  id: string;
  type: BoardItemType;
  x: number;
  y: number;
  interactive?: boolean;
  title?: string;
  category?: string;
  description?: string;
  imageSrc?: string;
  alt?: string;
  stackImages?: BoardStackImage[];
  stackVisibleImages?: BoardStackImage[];
  revealedImages?: BoardStackImage[];
  /** stack: default pile; sticker: smaller hero + reveal; polaroid: polaroid-shaped hero / stack */
  stackPresentation?: "stack" | "sticker" | "polaroid";
  focusZoom?: number;
  framingSize?: { width: number; height: number };
  detailBody?: string;
  placeholderEmoji?: string;
};

export function isBoardItemInteractive(item: BoardItem): boolean {
  if (item.type === "instructionCard") return false;
  return item.interactive !== false;
}
