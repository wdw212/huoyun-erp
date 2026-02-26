/**
 * 通用Word导出函数，支持文本、图片、表格（数组）类型数据
 * @param {Object} options - 导出配置
 * @param {string} options.fileName - 导出文件名（无需.doc后缀）
 * @param {Array} options.dataList - 数据列表，每项格式：{type: 'text|image|table', value: 对应值, label: 标题（可选）}
 * @param {Object} options.style - 全局样式配置（可选）
 */
export function exportWord(options) {
  // 默认配置
  const defaultOptions = {
    fileName: "导出文档",
    dataList: exportData,
    style: {
      font: "微软雅黑, SimHei, sans-serif",
      fontSize: "14px",
      titleSize: "16px",
      tableBorder: "1px solid #000",
      tablePadding: "8px",
      imgMaxWidth: "600px"
    }
  };

  // 合并配置
  const config = { ...defaultOptions, ...options };
  config.style = { ...defaultOptions.style, ...options.style };

  try {
    // 生成HTML内容
    function buildHtmlContent() {
      let html = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { 
              font-family: ${config.style.font}; 
              font-size: ${config.style.fontSize}; 
              margin: 20px;
              line-height: 1.6;
            }
            .data-label {
              font-size: ${config.style.titleSize};
              font-weight: bold;
              margin: 15px 0 8px 0;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin: 10px 0;
            }
            th, td {
              border: ${config.style.tableBorder};
              padding: ${config.style.tablePadding};
              text-align: center;
            }
            th {
              background-color: #f5f5f5;
              font-weight: bold;
            }
            img {
              max-width: ${config.style.imgMaxWidth};
              height: auto;
              margin: 10px 0;
            }
            .text-content {
              white-space: pre-line; /* 保留换行符 */
              margin: 10px 0;
            }
          </style>
        </head>
        <body>
      `;

      // 遍历数据列表，生成对应HTML
      config.dataList.forEach(item => {
        if (!item.type || !item.value) return;

        // 添加标题（如果有）
        if (item.label) {
          html += `<div class="data-label">${item.label}<div class="data-label">${item.label}</div>`;
        }

        // 根据类型生成内容
        switch (item.type) {
          // 文本类型
          case 'text':
            const textContent = (item.value || "").toString().replace(/\n/g, "<br/>");
            html += `<div class="text-content">${textContent}</div>`;
            break;

          // 图片类型（支持base64或网络地址）
          case 'image':
            html += `<img src="${item.value}" alt="${item.label || '图片'}" />`;
            break;

          // 表格类型（数组）
          case 'table':
            if (Array.isArray(item.value) && item.value.length > 0) {
              html += '<table>';
              item.value.forEach((row, rowIndex) => {
                html += '<tr>';
                const cells = Array.isArray(row) ? row : [row];
                cells.forEach(cell => {
                  const cellTag = rowIndex === 0 ? 'th' : 'td';
                  const cellText = (cell || "").toString().replace(/\n/g, "<br/>");
                  html += `<${cellTag}>${cellText}</${cellTag}>`;
                });
                html += '</tr>';
              });
              html += '</table>';
            } else {
              html += '<div>暂无表格数据</div>';
            }
            break;
        }

        // 数据项之间添加分隔
        html += '<br/>';
      });

      html += `
        </body>
        </html>
      `;
      return html;
    }

    // 生成Blob并下载
    const htmlContent = buildHtmlContent();
    const blob = new Blob([htmlContent], {
      type: 'application/msword;charset=utf-8'
    });

    const link = document.createElement('a');
    const fullFileName = config.fileName.endsWith('.doc') 
      ? config.fileName 
      : `${config.fileName}.doc`;
    
    link.download = fullFileName;
    link.href = URL.createObjectURL(blob);
    
    document.body.appendChild(link);
    link.click();
    
    // 清理资源
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);

    console.log(`Word文档「${fullFileName}」导出成功`);
    return true;
  } catch (error) {
    console.error('Word导出失败:', error);
    alert(`导出失败：${error.message}`);
    return false;
  }
}

// ------------------- 使用示例 -------------------
// 1. 准备测试数据（包含文本、图片、表格）
const exportData = [
  {
    type: 'text',
    label: '文档说明',
    value: '这是一份包含多种数据类型的测试文档\n1. 支持文本换行\n2. 支持图片展示\n3. 支持数组生成表格'
  },
  {
    type: 'image',
    label: '测试图片',
    // 可以是网络图片地址或base64编码
    value: 'https://picsum.photos/600/400' 
  },
  {
    type: 'table',
    label: '员工信息表',
    value: [
      ['姓名', '部门', '年龄', '入职时间'],
      ['张三', '研发部\n前端组', 28, '2020-01-15'],
      ['李四', '产品部', 32, '2018-09-05'],
      ['王五', '市场部', 25, '2021-03-20']
    ]
  },
  {
    type: 'text',
    label: '备注',
    value: '1. 表格支持单元格内换行\n2. 图片自适应宽度\n3. 所有样式可自定义'
  }
];

// 2. 调用导出函数
// exportWord({
//   fileName: '多类型数据导出文档',
//   dataList: exportData,
//   // 可选：自定义样式
//   style: {
//     titleSize: '18px',
//     imgMaxWidth: '500px',
//     tableBorder: '1px solid #666'
//   }
// });