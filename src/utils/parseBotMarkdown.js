import getChatTypeByGuid from "./getChatType.js";

const parseBotMarkdown = (text) => {
  if (!text) {
    return { metadata: [], real_text: "" };
  }
  const patterns = [
    { style: "Mono", regex: /\`\`([^``]*)\`\`/g },
    { style: "Bold", regex: /\*\*([^*]*)\*\*/g },
    { style: "Quote", regex: /\$\$([^$]*)\$\$/g },
    { style: "Italic", regex: /\_\_([^_]*)\_\_/g },
    { style: "Strike", regex: /\~\~([^~]*)\~\~/g },
    { style: "Underline", regex: /\-\-([^-]*)\-\-/g },
    { style: "Mention", regex: /\@\@([^@]*)\@\@\(([^(]*)\)/g },
    { style: "Spoiler", regex: /\#\#([^#]*)\#\#/g },
  ];
  const tokens = [];
  for (const { style, regex } of patterns) {
    let match;
    while ((match = regex.exec(text)) !== null) {
      tokens.push({
        style,
        index: match.index,
        raw: match[0],
        inner: match[1],
        mentionObject: style === "Mention" ? match[2] : null,
      });
    }
  }
  tokens.sort((a, b) => a.index - b.index || b.raw.length - a.raw.length);
  const metadata = [];
  let real_text = "";
  let lastIndex = 0;
  let removedBefore = 0;
  for (const token of tokens) {
    if (token.index < lastIndex) continue;
    real_text += text.slice(lastIndex, token.index);

    const from_index = real_text.length;
    if (token.style !== "Mention") {
      metadata.push({
        type: token.style,
        from_index,
        length: token.inner.length,
      });
    } else {
      const mentionType = getChatTypeByGuid(token.mentionObject) || "Link";
      if (mentionType === "Link") {
        metadata.push({
          from_index,
          length: token.inner.length,
          link_url: token.mentionObject,
          type: "Link",
        });
      } else {
        metadata.push({
          type: "MentionText",
          from_index,
          length: token.inner.length,
          mention_text_user_id: token.mentionObject,
        });
      }
    }
    real_text += token.inner;
    lastIndex = token.index + token.raw.length;
  }
  real_text += text.slice(lastIndex);
  return {
    metadata,
    real_text,
  };
};

export default parseBotMarkdown;
