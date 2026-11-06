/* eslint test/no-import-node-test: "off" */
import assert from 'node:assert/strict'
import { it } from 'node:test'
import MarkdownIt from 'markdown-it'
import anchor from 'markdown-it-anchor'
import { load } from 'cheerio'
import { markdownTypography } from '../script/markdown-typography.ts'

function render(content, typography = true) {
  const md = new MarkdownIt({ html: true }).use(anchor)
  if (typography)
    md.use(markdownTypography)
  return load(md.render(content))
}

it('protects_product_names_and_chinese_endings', () => {
  const input = '在 Cherry Studio 中使用 Claude Code 和 GitHub Actions，改善阅读体验。'
  const $ = render(input)
  assert.equal($('p').text(), input)
  assert.deepEqual($('.typography-nowrap').toArray().map(el => $(el).text()), [
    'Cherry Studio',
    'Claude Code',
    'GitHub Actions',
    '体验。',
  ])
  assert.equal(render('试试 Cherry Studio App。')('.typography-nowrap').text(), 'Cherry Studio App')
})

it('preserves_text_links_and_heading_anchors', () => {
  const input = '## 使用 Cherry Studio 改善阅读体验\n\n通过 [GitHub Actions](https://github.com/features/actions) **改善阅读体验**，保留链接与强调。'
  const before = render(input, false)
  const after = render(input)
  assert.equal(after('body').text(), before('body').text())
  assert.equal(after('h2').attr('id'), before('h2').attr('id'))
  assert.equal(after('a').attr('href'), before('a').attr('href'))
  assert.equal(after('strong').text(), before('strong').text())
})

it('leaves_code_and_interpolation_unchanged', () => {
  const input = [
    '`Cherry Studio 改善阅读体验。`',
    '',
    '```text',
    'Cherry Studio 改善阅读体验。',
    '```',
    '',
    '<code>Cherry Studio 改善阅读体验。</code>',
    '',
    '{{ \"Cherry Studio 改善阅读体验。\" }}',
  ].join('\n')
  const $ = render(input)
  assert.equal($('.typography-nowrap').length, 0)
  assert.equal($('body').text(), render(input, false)('body').text())
})

it('handles_short_latin_and_punctuation_only_content', () => {
  for (const input of ['好', '。', 'Hello world.', '中文尾部有一个字啊。', '这是中华人民共和国。']) {
    const $ = render(input)
    assert.equal($('p').text(), input)
    for (const span of $('.typography-nowrap').toArray())
      assert.ok($(span).text().length <= 8)
  }
  assert.equal(render('normal Cherry StudioX text')('.typography-nowrap').length, 0)
})

it('renders_without_native_autospace_or_pretty_wrapping', () => {
  const $ = render('使用 Visual Studio Code 写作，留出阅读空间。')
  assert.equal($('.typography-nowrap').first().text(), 'Visual Studio Code')
  assert.equal($('.typography-nowrap').last().text(), '空间。')
  assert.equal($('p').text(), '使用 Visual Studio Code 写作，留出阅读空间。')
  assert.equal($('script, style').length, 0)
})
