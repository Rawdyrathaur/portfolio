const TABLE_OF_CONTENTS_HEADING = /^#{1,6}\s+Table of Contents\s*$/i

export function stripTableOfContentsSection(content = '') {
  if (!content.includes('Table of Contents')) {
    return content
  }

  const lines = content.split('\n')
  const filteredLines = []
  let skippingTableOfContents = false

  for (const line of lines) {
    const trimmedLine = line.trim()

    if (!skippingTableOfContents && TABLE_OF_CONTENTS_HEADING.test(trimmedLine)) {
      skippingTableOfContents = true
      continue
    }

    if (skippingTableOfContents && /^#{1,6}\s+/.test(trimmedLine)) {
      skippingTableOfContents = false
      filteredLines.push(line)
      continue
    }

    if (!skippingTableOfContents) {
      filteredLines.push(line)
    }
  }

  return filteredLines.join('\n')
}