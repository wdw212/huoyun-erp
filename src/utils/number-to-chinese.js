// number-to-chinese.js

/**
 * 数字转汉字工具类
 * @class NumberToChinese
 */
export class NumberToChinese {
  constructor(options = {}) {
    // 默认配置
    this.config = {
      mode: 'normal', // 'normal'普通模式, 'money'金额模式
      capital: false, // 是否使用大写数字
      ...options
    };

    this._initializeNumberMaps();
  }

  /**
   * 初始化数字映射
   * @private
   */
  _initializeNumberMaps() {
    // 数字字符映射
    this.chineseNumbers = this.config.capital
      ? ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖']
      : ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];

    // 单位映射
    this.chineseUnits = this.config.capital
      ? ['', '拾', '佰', '仟']
      : ['', '十', '百', '千'];

    this.chineseSections = ['', '万', '亿', '兆'];

    // 金额模式特殊单位
    this.moneyUnits = this.config.capital
      ? ['元', '角', '分', '厘']
      : ['元', '角', '分', '厘'];
  }

  /**
   * 验证输入是否为有效数字
   * @param {string} numStr - 输入的数字字符串
   * @returns {boolean}
   */
  isValidNumber(numStr) {
    if (!numStr || numStr.trim() === '') return false;

    // 允许小数点、逗号分隔符和负号
    const regex = /^-?\d{1,3}(,\d{3})*(\.\d+)?$/;
    if (!regex.test(numStr)) return false;

    // 转换为数字验证
    const num = parseFloat(numStr.replace(/,/g, ''));
    return !isNaN(num) && isFinite(num);
  }

  /**
   * 转换整数部分
   * @param {string} numStr - 整数部分字符串
   * @returns {string}
   */
  convertIntegerPart(numStr) {
    if (numStr === '0') return this.chineseNumbers[0];

    let result = '';
    const len = numStr.length;

    // 按四位分组处理
    const sections = [];
    for (let i = len; i > 0; i -= 4) {
      sections.push(numStr.substring(Math.max(0, i - 4), i));
    }
    sections.reverse();

    // 处理每一组
    for (let i = 0; i < sections.length; i++) {
      const section = sections[i];
      let sectionText = '';

      // 处理组内的每一位
      for (let j = 0; j < section.length; j++) {
        const digit = parseInt(section[j]);
        const unitIndex = section.length - 1 - j;

        if (digit !== 0) {
          sectionText += this.chineseNumbers[digit] + this.chineseUnits[unitIndex];
        } else {
          // 处理连续的零
          if (sectionText.length > 0 &&
              sectionText[sectionText.length - 1] !== this.chineseNumbers[0] &&
              !(j === section.length - 1 && sectionText === '')) {
            sectionText += this.chineseNumbers[0];
          }
        }
      }

      // 去除末尾的零
      if (sectionText.endsWith(this.chineseNumbers[0])) {
        sectionText = sectionText.slice(0, -1);
      }

      // 添加组单位（万、亿等）
      if (sectionText) {
        result += sectionText + this.chineseSections[sections.length - 1 - i];
      }
    }

    // 处理连续的零
    const zeroChar = this.chineseNumbers[0];
    result = result.replace(new RegExp(`${zeroChar}+`, 'g'), zeroChar);

    // 处理开头和结尾的零
    if (result.startsWith(zeroChar)) result = result.substring(1);
    if (result.endsWith(zeroChar)) result = result.slice(0, -1);

    return result || zeroChar;
  }

  /**
   * 转换小数部分（普通模式）
   * @param {string} decimalStr - 小数部分字符串
   * @returns {string}
   */
  convertDecimalPart(decimalStr) {
    if (!decimalStr) return '';

    let result = '点';
    const digits = decimalStr.split('');

    for (let i = 0; i < digits.length; i++) {
      const digit = parseInt(digits[i]);
      result += this.chineseNumbers[digit];
    }

    return result;
  }

  /**
   * 转换小数部分（金额模式）
   * @param {string} decimalStr - 小数部分字符串
   * @returns {string}
   */
  convertDecimalPartMoney(decimalStr) {
    if (!decimalStr) return this.config.capital ? '整' : '整';

    let result = '';
    const digits = decimalStr.split('');

    // 处理角、分、厘
    for (let i = 0; i < Math.min(digits.length, 3); i++) {
      const digit = parseInt(digits[i]);
      if (digit !== 0) {
        result += this.chineseNumbers[digit] + this.moneyUnits[i + 1];
      } else if (i === 0 && result === '') {
        // 处理类似 20.01 的情况
        result += '零';
      }
    }

    return result || (this.config.capital ? '整' : '整');
  }

  /**
   * 主转换函数
   * @param {string|number} number - 要转换的数字
   * @returns {string} 转换后的中文数字
   */
  convert(number) {
    // 转换为字符串
    const numStr = typeof number === 'number' ? number.toString() : String(number);

    // 验证输入
    if (!this.isValidNumber(numStr)) {
      throw new Error('请输入有效的数字格式');
    }

    // 移除逗号并处理负号
    const cleanNumber = numStr.replace(/,/g, '');
    const isNegative = cleanNumber.startsWith('-');
    const absNumber = isNegative ? cleanNumber.substring(1) : cleanNumber;

    // 分割整数和小数部分
    const [integerPart, decimalPart] = absNumber.split('.');

    // 转换整数部分
    let result = this.convertIntegerPart(integerPart);

    // 转换小数部分
    if (decimalPart) {
      if (this.config.mode === 'money') {
        result += this.moneyUnits[0] + this.convertDecimalPartMoney(decimalPart);
      } else {
        result += this.convertDecimalPart(decimalPart);
      }
    } else if (this.config.mode === 'money') {
      result += this.moneyUnits[0] + (this.config.capital ? '整' : '整');
    }

    // 添加负号
    if (isNegative) {
      result = (this.config.capital ? '负' : '负') + result;
    }

    return result;
  }

  /**
   * 设置配置选项
   * @param {Object} options - 配置选项
   */
  setConfig(options) {
    this.config = { ...this.config, ...options };
    this._initializeNumberMaps();
  }

  /**
   * 批量转换数字数组
   * @param {Array} numbers - 数字数组
   * @returns {Array} 转换结果数组
   */
  convertArray(numbers) {
    return numbers.map(num => {
      try {
        return this.convert(num);
      } catch (error) {
        return `错误: ${error.message}`;
      }
    });
  }
}

// 创建默认实例
export const numberToChinese = new NumberToChinese();

// 工具函数
/**
 * 快速转换函数
 * @param {string|number} number - 要转换的数字
 * @param {Object} options - 配置选项
 * @returns {string}
 */
export function convertNumber(number, options = {}) {
  const converter = new NumberToChinese(options);
  return converter.convert(number);
}

/**
 * 转换为金额格式
 * @param {string|number} number - 要转换的数字
 * @param {boolean} capital - 是否使用大写
 * @returns {string}
 */
export function convertToMoney(number, capital = false) {
  const converter = new NumberToChinese({ mode: 'money', capital });
  return converter.convert(number);
}

// 默认导出
export default numberToChinese;
