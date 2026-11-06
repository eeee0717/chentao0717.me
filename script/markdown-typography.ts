import type MarkdownIt from 'markdown-it'
import Token from 'markdown-it/lib/token.mjs'

const productNames = [
  'Cherry Studio App',
  'Cherry Studio',
  'Visual Studio Code',
  'GitHub Actions',
  'Claude Code',
  'MacBook Pro',
]
const productPattern = new RegExp(`(?<![A-Za-z0-9_])(?:${productNames.join('|')})(?![A-Za-z0-9_])`, 'g')
const segmenter = new Intl.Segmenter('zh-CN', { granularity: 'word' })
const hanWord = /^\p{Script=Han}+$/u
const terminalPunctuation = /^[。！？!?…」』）》】”’"'，、；：]*$/u

interface ProtectedRange {
  start: number
  end: number
}

function chineseEnding(content: string): ProtectedRange | undefined {
  const end = content.trimEnd().length
  const segments = [...segmenter.segment(content.slice(0, end))]
  const index = segments.findLastIndex(segment => segment.isWordLike)
  const word = segments[index]
  if (!word || !hanWord.test(word.segment) || !terminalPunctuation.test(content.slice(word.index + word.segment.length, end)))
    return

  let start = word.index
  const previous = segments[index - 1]
  if (word.segment.length === 1 && previous && hanWord.test(previous.segment) && previous.index + previous.segment.length === start)
    start = previous.index

  if (end - start < 2 || end - start > 8)
    return
  return { start, end }
}

function textToken(content: string) {
  const token = new Token('text', '', 0)
  token.content = content
  return token
}

function protect(token: Token, ending: boolean) {
  const content = token.content
  const ranges: ProtectedRange[] = [...content.matchAll(productPattern)]
    .map(match => ({ start: match.index, end: match.index + match[0].length }))
  const tail = ending ? chineseEnding(content) : undefined
  if (tail)
    ranges.push(tail)
  if (!ranges.length)
    return [token]

  const tokens: Token[] = []
  let position = 0
  for (const range of ranges) {
    tokens.push(textToken(content.slice(position, range.start)))
    const open = new Token('span_open', 'span', 1)
    open.attrSet('class', 'typography-nowrap')
    tokens.push(open, textToken(content.slice(range.start, range.end)), new Token('span_close', 'span', -1))
    position = range.end
  }
  tokens.push(textToken(content.slice(position)))
  return tokens
}

export function markdownTypography(md: MarkdownIt) {
  md.core.ruler.after('inline', 'typography', (state) => {
    for (const [index, block] of state.tokens.entries()) {
      if (block.type !== 'inline' || !block.children || block.content.includes('{{'))
        continue

      const parent = state.tokens[index - 1]
      const prose = parent?.type === 'paragraph_open' || parent?.type === 'heading_open'
      const last = block.children.at(-1)
      let literalDepth = 0
      block.children = block.children.flatMap((token) => {
        if (token.type === 'html_inline') {
          if (/^<(?:code|pre|kbd|samp|script|style)\b/i.test(token.content))
            literalDepth++
          else if (/^<\/(?:code|pre|kbd|samp|script|style)\s*>/i.test(token.content))
            literalDepth = Math.max(0, literalDepth - 1)
        }
        if (token.type !== 'text' || literalDepth)
          return [token]
        return protect(token, prose && token === last)
      })
    }
  })
}
