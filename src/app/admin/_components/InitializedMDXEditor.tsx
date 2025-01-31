'use client'
import React, { useEffect, useMemo, useState, type ForwardedRef, memo } from 'react'
import {
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  markdownShortcutPlugin,
  MDXEditor,
  type MDXEditorMethods,
  type MDXEditorProps,
  BoldItalicUnderlineToggles,
  toolbarPlugin,
  UndoRedo,
  CreateLink,
  linkDialogPlugin,
  InsertTable,
  tablePlugin,
  InsertThematicBreak,
  ListsToggle,
  InsertImage,
  Separator,
  BlockTypeSelect,
  ChangeAdmonitionType,
  ChangeCodeMirrorLanguage,
  CodeToggle,
  ConditionalContents,
  DiffSourceToggleWrapper,
  InsertAdmonition,
  InsertCodeBlock,
  InsertFrontmatter,
  InsertSandpack,
  ShowSandpackInfo,
  StrikeThroughSupSubToggles,
  EditorInFocus,
  DirectiveNode,
  AdmonitionDirectiveDescriptor,
  codeBlockPlugin,
  codeMirrorPlugin,
  diffSourcePlugin,
  directivesPlugin,
  frontmatterPlugin,
  imagePlugin,
  linkPlugin,
  sandpackPlugin,
  SandpackConfig,
  DirectiveDescriptor
} from '@mdxeditor/editor'
import '@mdxeditor/editor/style.css'
import { LeafDirective } from 'mdast-util-directive'

import 'lexical'
import { AdmonitionKind } from 'lexical'

// Only import this to the next file
export default function InitializedMDXEditor({
    editorRef,
    ...props
}: { editorRef: ForwardedRef<MDXEditorMethods> | null } & MDXEditorProps) {
  const [selectFormatting, setSelectFormatting] = useState('title_1');

  const [fontFormatting, setFontFormatting] = useState([
    { label: '제목1', value: 'title_1' },
    { label: '제목2', value: 'title_2' },
    { label: '제목3', value: 'title_3' },
    { label: '본문1', value: 'text_1' }
  ]);

  const onChangeSelect = (value: string) => {
    const fontFormat = fontFormatting.find(item => item.value === value);
    setSelectFormatting(fontFormat?.value as string);
  };

  return (
    <MDXEditor
      plugins={ALL_PLUGINS}
      {...props}
      ref={editorRef}
    />
  );
}

const defaultSnippetContent = `
export default function App() {
  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <h2>Start editing to see some magic happen!</h2>
    </div>
  );
}
`.trim();

export const virtuosoSampleSandpackConfig: SandpackConfig = {
  defaultPreset: 'react',
  presets: [
    {
      label: 'React',
      name: 'react',
      meta: 'live react',
      sandpackTemplate: 'react',
      sandpackTheme: 'light',
      snippetFileName: '/App.js',
      snippetLanguage: 'jsx',
      initialSnippetContent: defaultSnippetContent
    },
    {
      label: 'React',
      name: 'react',
      meta: 'live',
      sandpackTemplate: 'react',
      sandpackTheme: 'light',
      snippetFileName: '/App.js',
      snippetLanguage: 'jsx',
      initialSnippetContent: defaultSnippetContent
    },
    {
      label: 'Virtuoso',
      name: 'virtuoso',
      meta: 'live virtuoso',
      sandpackTemplate: 'react-ts',
      sandpackTheme: 'light',
      snippetFileName: '/App.tsx',
      initialSnippetContent: defaultSnippetContent,
      dependencies: {
        'react-virtuoso': 'latest',
        '@ngneat/falso': 'latest'
      },
      files: {}
    }
  ]
};

interface YoutubeDirectiveNode extends LeafDirective {
  name: 'youtube';
  attributes: { id: string };
}

export const YoutubeDirectiveDescriptor: DirectiveDescriptor<YoutubeDirectiveNode> = {
  name: 'youtube',
  type: 'leafDirective',
  testNode(node) {
    return node.name === 'youtube';
  },
  attributes: ['id'],
  hasChildren: false,
  Editor: ({ mdastNode, lexicalNode, parentEditor }) => {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        <button
          onClick={() => {
            parentEditor.update(() => {
              lexicalNode.selectNext();
              lexicalNode.remove();
            });
          }}
        >
          delete
        </button>
        <iframe
          width="560"
          height="315"
          src={`https://www.youtube.com/embed/${mdastNode.attributes.id}`}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        ></iframe>
      </div>
    );
  }
};

function whenInAdmonition(editorInFocus: EditorInFocus | null) {
  const node = editorInFocus?.rootNode;
  if (!node || node.getType() !== 'directive') {
    return false;
  }
  return ['note', 'tip', 'danger', 'info', 'caution'].includes(
    (node as DirectiveNode).getMdastNode().name as AdmonitionKind
  );
}

// ─────────────────────────────────────────────────────────────
// KitchenSinkToolbar를 memo로 감싸 불필요한 리렌더링 방지
// ─────────────────────────────────────────────────────────────
export const KitchenSinkToolbar: React.FC = () => {
  return (
    <DiffSourceToggleWrapper>
      <ConditionalContents
        options={[
          {
            when: (editor) => editor?.editorType === 'codeblock',
            contents: () => <ChangeCodeMirrorLanguage />
          },
          {
            when: (editor) => editor?.editorType === 'sandpack',
            contents: () => <ShowSandpackInfo />
          },
          {
            fallback: () => (
              <>
                <UndoRedo />
                <Separator />
                <BoldItalicUnderlineToggles />
                <CodeToggle />
                <Separator />
                <StrikeThroughSupSubToggles />
                <Separator />
                <ListsToggle />
                <Separator />
                <ConditionalContents
                  options={[
                    { when: whenInAdmonition, contents: () => <ChangeAdmonitionType /> },
                    { fallback: () => <BlockTypeSelect /> }
                  ]}
                />
                <Separator />
                <CreateLink />
                <InsertImage />
                <Separator />
                <InsertTable />
                <InsertThematicBreak />
                <Separator />
                <InsertCodeBlock />
                <InsertSandpack />
                <ConditionalContents
                  options={[
                    {
                      when: (editorInFocus) => !whenInAdmonition(editorInFocus),
                      contents: () => (
                        <>
                          <Separator />
                          <InsertAdmonition />
                        </>
                      )
                    }
                  ]}
                />
                <Separator />
                <InsertFrontmatter />
              </>
            )
          }
        ]}
      />
    </DiffSourceToggleWrapper>
  );
}

// 실제 툴바를 MDXEditor에 끼우는 plugin
export const ALL_PLUGINS = [
  toolbarPlugin({ toolbarContents: () => <KitchenSinkToolbar /> }),
  listsPlugin(),
  quotePlugin(),
  headingsPlugin({ allowedHeadingLevels: [1, 2, 3] }),
  linkPlugin(),
  linkDialogPlugin(),
  imagePlugin({
    imageAutocompleteSuggestions: ['https://via.placeholder.com/150', 'https://via.placeholder.com/150'],
    imageUploadHandler: async () => Promise.resolve('https://picsum.photos/200/300')
  }),
  tablePlugin(),
  thematicBreakPlugin(),
  frontmatterPlugin(),
  codeBlockPlugin({ defaultCodeBlockLanguage: '' }),
  sandpackPlugin({ sandpackConfig: virtuosoSampleSandpackConfig }),
  codeMirrorPlugin({ codeBlockLanguages: { js: 'JavaScript', css: 'CSS', txt: 'Plain Text', tsx: 'TypeScript', '': 'Unspecified' } }),
  directivesPlugin({ directiveDescriptors: [YoutubeDirectiveDescriptor, AdmonitionDirectiveDescriptor] }),
  diffSourcePlugin({ viewMode: 'rich-text', diffMarkdown: 'boo' }),
  markdownShortcutPlugin()
];
