/**
 * SSML (Speech Synthesis Markup Language) is a subset of XML specifically
 * designed for controlling synthesis. You can see examples of how the SSML
 * should be parsed in `ssml.test.ts`.
 *
 * DO NOT USE CHATGPT, COPILOT, OR ANY AI CODING ASSISTANTS.
 * Conventional auto-complete and Intellisense are allowed.
 *
 * DO NOT USE ANY PRE-EXISTING XML PARSERS FOR THIS TASK.
 * You may use online references to understand the SSML specification, but DO NOT read
 * online references for implementing an XML/SSML parser.
 */

/** Parses SSML to a SSMLNode, throwing on invalid SSML */
export function parseSSML(ssml: string): SSMLNode {
  // NOTE: Don't forget to run unescapeXMLChars on the SSMLText
  /*
  return {
    name: '',
    attributes: [],
    children: [],
  }
  */
 ssml = ssml.trim();

 if (!ssml.startsWith('>') || !ssml.endsWith('>')) {
  throw new Error('Invalid SSML Format. Please double check !')
 }
 
 function parseAttributes (attributesString: string): SSMLAttribute[] {
   const attributes: SSMLAttribute[] = [];
   const attributePattern = /(\w+)="([^"]*)"/g;
     let match;
     while ((match = attributePattern.exec(attributesString)) !== null) {
       attributes.push({ name: match[1], value: match[2] });
     }
     return attributes;
 }

 function parseNode(ssml: string): SSMLNode {
    
	if (!ssml.startsWith('<')) {
      return unescapeXMLChars(ssml);
    }
    
    const endOfOpeningTag = ssml.indexOf('>');
    
    const tagContent = ssml.slice(1, endOfOpeningTag);
    
    const [tagName, ...attrParts] = tagContent.split(/\s+/);
    
    const attributesString = attrParts.join(' ');
    
    const attributes = parseAttributes(attributesString);
    
    const closingTag = `</${tagName}>`;
    
    const closingTagIndex = ssml.indexOf(closingTag);
    
    const childrenString = ssml.slice(endOfOpeningTag + 1, closingTagIndex);
    
    const children: SSMLNode[] = [];
    
    let remaining = childrenString.trim();
    
    while (remaining.length > 0) {
    
	  if (remaining.startsWith('<')) {
        const nextTagEnd = remaining.indexOf('>') + 1;
        const nextClosingTag = remaining.slice(0, nextTagEnd).split(' ')[0].replace('<', '</') + '>';
        const nextClosingTagIndex = remaining.indexOf(nextClosingTag) + nextClosingTag.length;
        const childSSML = remaining.slice(0, nextClosingTagIndex);
        children.push(parseNode(childSSML));
        remaining = remaining.slice(nextClosingTagIndex).trim();
      } else {
        const nextTagStart = remaining.indexOf('<');
        if (nextTagStart === -1) {
          children.push(unescapeXMLChars(remaining));
          break;
      } else {
        const text = remaining.slice(0, nextTagStart);
        children.push(unescapeXMLChars(text));
        remaining = remaining.slice(nextTagStart).trim();
      }
    }
  }

  return {
    name: tagName,
    attributes,
    children,
  }

 }

 return parseNode(ssml);

}

/** Recursively converts SSML node to string and unescapes XML chars */
export function ssmlNodeToText(node: SSMLNode): string {
  /* return '' */
  if (typeof node === 'string') {
    return node;
  }

  const childrenText = node.children.map(ssmlNodeToText).join('');
  return childrenText;
}

// Already done for you
const unescapeXMLChars = (text: string) =>
  text.replaceAll('&lt;', '<').replaceAll('&gt;', '>').replaceAll('&amp;', '&')

type SSMLNode = SSMLTag | SSMLText
type SSMLTag = {
  name: string
  attributes: SSMLAttribute[]
  children: SSMLNode[]
}
type SSMLText = string
type SSMLAttribute = { name: string; value: string }
