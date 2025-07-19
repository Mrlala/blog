// src/theme/theme-overrides.js
export const themeNames = {
    light: '亮色',
    dark: '暗色'
}
export default {
    light: {
        common: {
            // 全局
            bodyColor: '#f8fafb',
            textColorBase: '#1e293b',

            // 主色/强调色
            primaryColor: '#2563eb',
            secondaryColor: '#60a5fa',

            // header/footer
            headerBgColor: '#fff',
            headerTextColor: '#9b8fff',
            navLinkActiveColor: '#2563eb',
            footerBgColor: '#fff',
            footerTextColor: '#1e293b',
            footerBorderColor: '#e5eaf3',

            // 卡片
            cardColor: '#fff',
            cardRadius: '1.5em',
            cardShadow: '0 4px 22px #6091ff17',
            cardTitleColor: '#234087',
            cardAbstractColor: '#5a6d8c',
            cardTimeColor: '#b2bccc',
            coverBg: '#f2f6fd',
            coverBorder: '#f1f5f9',
            cardBorder: '#ecedf3',
            cardHoverBorder: '#7cb3ff',

            // 按钮
            btnBg: 'linear-gradient(90deg, #75c7fa 0%, #4e8ef7 100%)',
            btnText: '#fff',
            btnHoverBg: 'linear-gradient(90deg, #1e40af, #3b82f6)',
            btnHoverText: '#fff',
            btnShadow: '0 1px 4px rgba(46,110,255,0.05)',
            btnRadius: '999px',
            btnBorder: 'none',
            btnFontSize: '1.13em',
            btnPadding: '0.48em 1.6em',

            // tag chip

            tagBg: '#f1f5fa',
            tagText: '#5b7fa7',
            tagRadius: '1.1em',
            tagPadding: '0.25em 1.1em',
            tagActiveBg: '#2563eb',
            tagActiveText: '#fff',
            tagActiveBorder: '#2563eb',
            tagClearColor: '#94a3b8',

            // 输入框/搜索框
            inputBg: '#f8faff',
            inputText: '#1e293b',
            inputBorder: '#e3e8f7',
            inputPlaceholder: '#b1b7c7',
            inputRadius: '10px',
            inputPadding: '0.75em 1.2em',
            inputFontSize: '1.08em',
            inputFocusBorder: '#60a5fa',
            inputFocusBg: '#fff',

            // 状态提示
            errorColor: '#ef4444',
            loadingColor: '#89a0c5',
            noArticleColor: '#c5d0e4',

            // 其它
            dividerColor: '#e5eaf3',
            scrollbarColor: '#dde6ef',
            scrollbarThumb: '#bcd2e6',

            // 编辑器/写作页专用
            writeBgGradient: 'linear-gradient(135deg, #f8fafb 0%, #f5f8ff 100%)',
            editorShadow: '0 4px 24px 0 rgba(60,110,255,0.09), 0 2px 6px rgba(60,80,120,0.06)',

            //标签
            tagitemBg: 'linear-gradient(90deg, #aee3fa 0%, #b7c8fd 100%)',
            tagitemHoverBg: 'linear-gradient(90deg,#7fd3fa 0%,#99b5f6 100%)',
            tagitemText: '#2b4ea5',
            tagitemShadow: '0 2px 10px 0 rgba(50,100,255,0.07)',
            tagitemRemoveBg: '#a5bdfa',
            tagitemRemoveHoverBg: '#f56c6c',
            tagTipText: '#f56c6c',
            tagTipBg: '#fff8f7',

            //摘要


            coverThumbBorder: '#e0e8f4',
            coverThumbBg: '#fafbfc',
            coverThumbShadow: '0 2px 8px #0001',
            coverThumbActiveBorder: '#4f8cff',
            coverThumbActiveShadow: '0 2px 12px #4f8cff22',
            coverSelectedText: '#fff',
            coverSelectedBg: '#4f8cff',
            coverSelectedShadow: '0 1px 5px #4f8cff33',
            uploadThumbBorder: '#b5c6e0',
            uploadThumbBg: '#f4f6fb',
            uploadThumbText: '#4f8cff',


            writeMetaText: '#7a86a1',
            writeMetaBg: '#f3f4f8',
            writeMetaBarGradient: 'linear-gradient(90deg, #5baaff 0%, #8fe8d9 100%)',

            btnEditBg: '#60a5fa',
            btnEditText: '#fff',
            btnEditHoverBg: '#3b82f6',

            // 删除按钮
            btnDeleteBg: '#f87171',
            btnDeleteText: '#fff',
            btnDeleteHoverBg: '#ef4444',

            // 弹窗遮罩背景
            modalOverlayBg: 'rgba(30, 30, 30, 0.18)',
            // 弹窗主体背景及阴影
            modalBg: '#fff',
            modalShadow: '0 8px 24px rgba(0,0,0,0.13)',
            modalTextColor: '#000',

            // 弹窗按钮-确认
            modalBtnConfirmBg: '#646cff',
            modalBtnConfirmText: '#fff',
            modalBtnConfirmHoverBg: '#515fd9',

            // 弹窗按钮-取消
            modalBtnCancelBg: '#bbb',
            modalBtnCancelText: '#444',
            modalBtnCancelHoverBg: '#999',


            articleBg: '#fff',
            articleTextColor: '#3f4a54',
            articleShadow: '0 8px 32px rgba(60,60,110,0.08)',
            articleRadius: '2em',
            articleTitleColor: '#234087',
            articleDateColor: '#888',
            markdownTextColor: '#232a3a',
            markdownHeadingColor: '#335fbb',
            markdownLinkColor: '#2563eb',
            markdownCodeBg: '#f2f2f2',
            markdownCodeText: '#c7254e',
            markdownPreBg: '#23272e',
            markdownPreText: '#eee',
            errorColor: '#ef4444',
        }
    },
    dark: {
        common: {
            // 全局
            bodyColor: '#181c20',
            textColorBase: '#e7efff',

            // 主色/强调色
            primaryColor: '#5c9dff',
            secondaryColor: '#3b82f6',

            // header/footer
            headerBgColor: '#181824',
            headerTextColor: '#d1bfff',
            navLinkActiveColor: '#5c9dff',
            footerBgColor: '#181824',
            footerTextColor: '#a9b6d3',
            footerBorderColor: '#242c3a',

            // 卡片
            cardColor: '#212737',
            cardRadius: '1.5em',
            cardShadow: '0 4px 22px #0d234120',
            cardTitleColor: '#aad2ff',
            cardAbstractColor: '#b1c2d3',
            cardTimeColor: '#657395',
            coverBg: '#23273b',
            coverBorder: '#24304a',
            cardBorder: '#283041',
            cardHoverBorder: '#3c79c6',

            // 按钮
            btnBg: 'linear-gradient(90deg, #426dc5 0%, #3a7afd 100%)',
            btnText: '#e7efff',
            btnHoverBg: 'linear-gradient(90deg, #1742a0, #234588)',
            btnHoverText: '#fff',
            btnShadow: '0 1px 4px rgba(60,110,255,0.12)',
            btnRadius: '999px',
            btnBorder: 'none',
            btnFontSize: '1.13em',
            btnPadding: '0.48em 1.6em',

            // tag chip

            tagBg: '#222c39',
            tagText: '#7da9e3',
            tagRadius: '1.1em',
            tagPadding: '0.25em 1.1em',
            tagActiveBg: '#3a70d6',
            tagActiveText: '#fff',
            tagActiveBorder: '#3a70d6',
            tagClearColor: '#6b7894',

            // 输入框/搜索框
            inputBg: '#23273b',
            inputText: '#e7efff',
            inputBorder: '#425070',
            inputPlaceholder: '#8594ac',
            inputRadius: '10px',
            inputPadding: '0.75em 1.2em',
            inputFontSize: '1.08em',
            inputFocusBorder: '#5c9dff',
            inputFocusBg: '#252e44',

            // 状态提示
            errorColor: '#f67777',
            loadingColor: '#7ea7db',
            noArticleColor: '#394568',

            // 其它
            dividerColor: '#293247',
            scrollbarColor: '#252d3b',
            scrollbarThumb: '#364152',

            // 编辑器/写作页专用
            writeBgGradient: 'linear-gradient(135deg, #181c20 0%, #20273a 100%)',
            editorShadow: '0 4px 24px 0 rgba(40,54,95,0.23), 0 2px 6px rgba(30,42,70,0.18)',

            tagitemBg: 'linear-gradient(90deg, #2b445e 0%, #3c546e 100%)',
            tagitemHoverBg: 'linear-gradient(90deg, #3b6a92 0%, #456083 100%)',
            tagitemText: '#a8cdf8',
            tagitemShadow: '0 2px 10px 0 rgba(30,80,140,0.08)',
            tagitemRemoveBg: '#405788',
            tagitemRemoveHoverBg: '#e05a5a',
            tagTipText: '#ff7a7a',
            tagTipBg: '#232a36',

            //摘要



            coverThumbBorder: '#394560',
            coverThumbBg: '#232a36',
            coverThumbShadow: '0 2px 8px rgba(0,0,0,0.8)',
            coverThumbActiveBorder: '#6492ff',
            coverThumbActiveShadow: '0 2px 12px rgba(100,146,255,0.35)',
            coverSelectedText: '#fff',
            coverSelectedBg: '#6492ff',
            coverSelectedShadow: '0 1px 5px rgba(100,146,255,0.6)',
            uploadThumbBorder: '#54648a',
            uploadThumbBg: '#1e2431',
            uploadThumbText: '#6492ff',

            writeMetaText: '#9ca7cc',
            writeMetaBg: '#2a2f48',
            writeMetaBarGradient: 'linear-gradient(90deg, #3a83ff 0%, #60d1af 100%)',


            // 编辑按钮（暗色系配色）
            btnEditBg: '#3b82f6',        // 比 light 更深蓝
            btnEditText: '#e7efff',
            btnEditHoverBg: '#2563eb',

            // 删除按钮（暗色系配色）
            btnDeleteBg: '#ef4444',       // 偏暗的红色
            btnDeleteText: '#fff',
            btnDeleteHoverBg: '#b91c1c',

            // 弹窗遮罩背景（稍微更深）
            modalOverlayBg: 'rgba(0, 0, 0, 0.45)',
            // 弹窗主体背景及阴影
            modalBg: '#212737',
            modalShadow: '0 8px 24px rgba(0,0,0,0.55)',
            modalTextColor: '#e7efff',

            // 弹窗按钮-确认
            modalBtnConfirmBg: '#5c9dff',
            modalBtnConfirmText: '#fff',
            modalBtnConfirmHoverBg: '#497fd6',

            // 弹窗按钮-取消
            modalBtnCancelBg: '#555a6e',
            modalBtnCancelText: '#ccc',
            modalBtnCancelHoverBg: '#44485a',

            articleBg: '#212737',
            articleTextColor: '#e7efff',
            articleShadow: '0 8px 32px #0d234120',
            articleRadius: '2em',
            articleTitleColor: '#aad2ff',
            articleDateColor: '#b1c2d3',
            markdownTextColor: '#e7efff',
            markdownHeadingColor: '#b8caf2',
            markdownLinkColor: '#79b8ff',
            markdownCodeBg: '#2c313c',
            markdownCodeText: '#ffb386',
            markdownPreBg: '#20242c',
            markdownPreText: '#e7efff',
            errorColor: '#f67777',
        }
    }
}
