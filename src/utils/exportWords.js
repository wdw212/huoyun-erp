import { 
  Document, Packer, Paragraph, TextRun, 
  Table, TableRow, TableCell, WidthType,
  ImageRun, AlignmentType, PageOrientation,
  SectionType, HeadingLevel, convertMillimetersToTwip
} from "docx";

/**
 * 将图片URL转换为Base64（docx库要求图片为Base64格式）
 * @param {string} url 图片网络地址
 * @returns {Promise<string>} 图片Base64编码
 */
async function imageUrlToBase64(url) {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error("图片转Base64失败:", error);
    throw new Error("图片加载失败，请检查URL是否有效");
  }
}

/**
 * 构建Word文档内容（适配你的数据结构）
 * @param {Object} data 原始数据 {entities: [], text: ''}
 * @param {Array} tableData 可选的表格数组数据
 * @returns {Promise<Document>} docx文档对象
 */
async function buildWordDocument(data, tableData = []) {
  // 文档内容节点
  const docChildren = [];

  // 1. 添加文本内容（优先显示text字段）
  if (data.text) {
    docChildren.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        alignment: AlignmentType.LEFT,
        children: [
          new TextRun({
            text: "文档说明",
            bold: true,
            size: 24, // 字号（1pt = 2 单位）
          }),
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.LEFT,
        spacing: { after: 200 }, // 段后间距
        children: [
          new TextRun({
            text: data.text,
            size: 22, // 11pt 常规字号
            font: "微软雅黑",
          }),
        ],
      })
    );
  }

  // 2. 处理图片（解析entities中的图片）
  if (data.entities && data.entities.length > 0) {
    for (const entity of data.entities) {
      if (entity.entity_type === 2 && entity.entity_content?.image?.image_ori?.url) {
        // 图片标题
        docChildren.push(
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            alignment: AlignmentType.LEFT,
            spacing: { before: 300 },
            children: [
              new TextRun({
                text: "相关图片",
                bold: true,
                size: 22,
              }),
            ],
          })
        );

        // 转换图片为Base64
        const imageBase64 = await imageUrlToBase64(entity.entity_content.image.image_ori.url);
        
        // 添加图片到文档
        docChildren.push(
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
            children: [
              new ImageRun({
                data: imageBase64,
                transformation: {
                  width: 500, // 图片宽度（px）
                  height: Math.round(500 * entity.entity_content.image.image_ori.height / entity.entity_content.image.image_ori.width), // 等比缩放高度
                },
              }),
            ],
          })
        );
      }
    }
  }

  // 3. 处理表格数据（数组转Word表格）
  if (tableData.length > 0) {
    docChildren.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        alignment: AlignmentType.LEFT,
        spacing: { before: 300 },
        children: [
          new TextRun({
            text: "数据表格",
            bold: true,
            size: 22,
          }),
        ],
      })
    );

    // 构建表格
    const tableRows = tableData.map((row, rowIndex) => {
      const cells = (Array.isArray(row) ? row : [row]).map(cell => {
        return new TableCell({
          width: { size: 100 / (Array.isArray(row) ? row.length : 1), type: WidthType.PERCENTAGE },
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: cell?.toString() || "",
                  size: 20,
                  font: "微软雅黑",
                  bold: rowIndex === 0, // 表头加粗
                }),
              ],
            }),
          ],
        });
      });

      return new TableRow({ children: cells });
    });

    // 添加表格到文档
    docChildren.push(
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: tableRows,
        margins: { top: 100, bottom: 100 },
        borders: {
          top: { style: "single", size: 1 },
          bottom: { style: "single", size: 1 },
          left: { style: "single", size: 1 },
          right: { style: "single", size: 1 },
          insideHorizontal: { style: "single", size: 1 },
          insideVertical: { style: "single", size: 1 },
        },
      })
    );
  }

  // 4. 构建最终文档（强制A4纸张，适配最新版docx）
  const doc = new Document({
    sections: [
      {
        properties: {
          type: SectionType.CONTINUOUS,
          page: {
            // 直接设置A4尺寸（210mm × 297mm），无需导入PageSize
            size: {
              width: convertMillimetersToTwip(210),  // A4宽度
              height: convertMillimetersToTwip(297), // A4高度
              orientation: PageOrientation.PORTRAIT,  // 纵向
            },
            // 直接设置页边距（2cm），无需导入Margins
            margin: {
              top: convertMillimetersToTwip(20),
              right: convertMillimetersToTwip(20),
              bottom: convertMillimetersToTwip(20),
              left: convertMillimetersToTwip(20),
              header: convertMillimetersToTwip(10),
              footer: convertMillimetersToTwip(10),
              gutter: 0,
            },
          },
        },
        children: docChildren,
      },
    ],
    styles: {
      default: {
        paragraph: {
          font: "微软雅黑",
          lineSpacing: 1.5, // 行间距1.5倍
        },
      },
    },
  });

  return doc;
}

/**
 * 导出标准A4 Word文档（核心函数）
 * @param {Object} options 配置项
 * @param {Object} options.data 原始数据 {entities: [], text: ''}
 * @param {Array} options.tableData 表格数组数据
 * @param {string} options.fileName 导出文件名（无需.docx后缀）
 */
export async function exportWord(options) {
  try {
    // const { data, tableData = [], fileName = "标准A4文档" } = options;
    const { data, tableData = [], fileName = "标准A4文档" } = {...options, data: rawData, tableData: demoTableData,};
    
    // 构建文档
    const doc = await buildWordDocument(data, tableData);
    
    // 生成Blob并下载
    const blob = await Packer.toBlob(doc);
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = fileName.endsWith(".docx") ? fileName : `${fileName}.docx`;
    link.click();
    
    // 清理资源
    URL.revokeObjectURL(link.href);
    console.log(`标准A4文档「${link.download}」导出成功`);
    return true;
  } catch (error) {
    console.error("Word导出失败:", error);
    alert(`导出失败：${error.message}`);
    return false;
  }
}

// ------------------- 使用示例（完全适配你的数据结构） -------------------
// 你的原始数据
const rawData = {
  "entities": [{
    "entity_type": 2,
    "entity_content": {
      "image": {
        "key": "tos-cn-i-a9rns2rl98/434d60e36e9a40b480683e5a82cc16dd.png",
        "image_ori": {
          "url": "https://p9-flow-imagex-sign.byteimg.com/tos-cn-i-a9rns2rl98/434d60e36e9a40b480683e5a82cc16dd.png~tplv-a9rns2rl98-image.png?lk3s=8e244e95&rcl=20260226180630E577D97386BE4DA77784&rrcfp=dafada99&x-expires=2088324390&x-signature=BnYbhqLqsZxxYwTzz3abVgPzT7Y%3D",
          "width": 1920,
          "height": 992
        }
      }
    }
  }],
  "text": "设置后生成的文档内容不对，也不是A4大小"
};

// 示例表格数据
const demoTableData = [
  ["问题类型", "现象", "解决方案"],
  ["纸张大小", "非A4尺寸", "使用convertMillimetersToTwip直接设置A4尺寸"],
  ["内容乱码", "文字显示异常", "使用标准docx格式+微软雅黑字体"],
  ["图片显示", "图片无法加载", "URL转Base64后插入"]
];

// 调用导出函数（核心）
// exportWord({
//   data: rawData,
//   tableData: demoTableData,
//   fileName: "修复后的A4文档"
// });