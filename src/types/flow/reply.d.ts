export interface iReplyNode {
  nodeId: string;
  nodeName: string;
  headerType?: "image" | "document" | "video";
  headerLink?: string;
  body: string;
  footer?: string;
  replyButton1: string;
  replyButtonId1: string;
  replyButton2?: string;
  replyButtonId2?: string;
  replyButton3?: string;
  replyButtonId3?: string;
}
