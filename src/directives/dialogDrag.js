// directives/dialogDrag.js
export default {
  mounted(el) {
    // 获取对话框头部和对话框主体元素
    const dialogHeaderEl = el.querySelector('.el-dialog__header');
    const dragDom = el.querySelector('.el-dialog');

    if (!dialogHeaderEl || !dragDom) {
      console.warn('未找到对话框所需的DOM元素');
      return;
    }

    // 设置拖拽样式
    dialogHeaderEl.style.cssText += ';cursor:move;';
    // 确保对话框定位不为static，以便设置top/left生效
    if (getComputedStyle(dragDom).position !== 'fixed') {
      console.warn('建议将el-dialog的position设置为fixed，以便拖拽定位计算更准确。');
    }

    // 存储初始位置和鼠标按下时的坐标
    let initialTransform = { x: 0, y: 0 };
    let startCoords = { x: 0, y: 0 };
    let isDragging = false;

    // 鼠标按下事件 - 开始拖拽
    const handleMousedown = (e) => {
      isDragging = true;
      // 记录初始鼠标位置
      startCoords.x = e.clientX;
      startCoords.y = e.clientY;
      
      // 获取对话框当前的transform样式，并解析出位移值
      const style = window.getComputedStyle(dragDom);
      const transform = style.transform;
      if (transform && transform !== 'none') {
        // 提取matrix中的位移值，假设是2D矩阵
        const matrix = new DOMMatrix(transform);
        initialTransform.x = matrix.m41; // 水平位移
        initialTransform.y = matrix.m42; // 垂直位移
      } else {
        initialTransform.x = 0;
        initialTransform.y = 0;
      }

      // 更改光标样式并阻止事件冒泡
      dialogHeaderEl.style.cursor = 'move';
      e.preventDefault();
    };

    // 鼠标移动事件 - 处理拖拽
    const handleMousemove = (e) => {
      if (!isDragging) return;

      // 计算鼠标移动距离
      const deltaX = e.clientX - startCoords.x;
      const deltaY = e.clientY - startCoords.y;

      // 计算新的位置
      const newX = initialTransform.x + deltaX;
      const newY = initialTransform.y + deltaY;

      // 应用新位置，使用transform性能通常更好
      dragDom.style.transform = `translate(${newX}px, ${newY}px)`;
    };

    // 鼠标抬起事件 - 结束拖拽
    const handleMouseup = () => {
      isDragging = false;
      dialogHeaderEl.style.cursor = 'move';
      // 移除文档级别的事件监听
      document.removeEventListener('mousemove', handleMousemove);
      document.removeEventListener('mouseup', handleMouseup);
    };

    // 在头部元素上监听鼠标按下事件
    dialogHeaderEl.addEventListener('mousedown', (e) => {
      handleMousedown(e);
      // 在文档上监听鼠标移动和抬起事件，防止拖拽过快时鼠标脱离对话框头部
      document.addEventListener('mousemove', handleMousemove);
      document.addEventListener('mouseup', handleMouseup);
    });

    // 可选：将清理函数挂载到元素上，以便于后续销毁
    el._cleanupDrag = () => {
      document.removeEventListener('mousemove', handleMousemove);
      document.removeEventListener('mouseup', handleMouseup);
      dialogHeaderEl.removeEventListener('mousedown', handleMousedown);
    };
  },
  // 指令与元素解绑时，清理事件监听
  beforeUnmount(el) {
    if (el._cleanupDrag) {
      el._cleanupDrag();
    }
  }
}