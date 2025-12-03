// v-draggable-transform.js - 修复版本
export default {
  mounted(el, binding) {
    const options = binding.value || {};
    
    let handle;
    if (options.handle) {
      handle = el.querySelector(options.handle);
    }
    
    // 存储拖拽数据
    el._draggable = {
      isDragging: false,
      startX: 0,
      startY: 0,
      currentX: 0,
      currentY: 0
    };

    const onMouseDown = (e) => {
      if (e.button !== 0) return;
      
      const dragData = el._draggable;
      dragData.isDragging = true;
      
      // 记录鼠标按下时的位置
      dragData.startX = e.clientX;
      dragData.startY = e.clientY;
      
      // 获取元素当前的transform值
      const transform = el.style.transform;
      if (transform) {
        const match = transform.match(/translate\(([^,]+)px,\s*([^)]+)px\)/);
        if (match) {
          dragData.currentX = parseFloat(match[1]) || 0;
          dragData.currentY = parseFloat(match[2]) || 0;
        }
      }
      
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
      
      if (handle) handle.style.cursor = 'grabbing';
      el.style.userSelect = 'none';
      el.style.zIndex = '2171';
    };

    const onMouseMove = (e) => {
      const dragData = el._draggable;
      if (!dragData.isDragging) return;
      
      // 计算鼠标移动的距离
      const deltaX = e.clientX - dragData.startX;
      const deltaY = e.clientY - dragData.startY;
      
      // 计算新的位置（当前位置 + 移动距离）
      const newX = dragData.currentX + deltaX;
      const newY = dragData.currentY + deltaY;
      
      // 应用transform
      el.style.transform = `translate(${newX}px, ${newY}px)`;
    };

    const onMouseUp = (e) => {
      const dragData = el._draggable;
      if (dragData.isDragging) {
        dragData.isDragging = false;
        
        // 更新当前位置
        const transform = el.style.transform;
        if (transform) {
          const match = transform.match(/translate\(([^,]+)px,\s*([^)]+)px\)/);
          if (match) {
            dragData.currentX = parseFloat(match[1]) || 0;
            dragData.currentY = parseFloat(match[2]) || 0;
          }
        }
      }
      
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      
      if (handle) handle.style.cursor = 'grab';
      el.style.userSelect = '';
    };

    if (handle) {
      handle.addEventListener('mousedown', onMouseDown);
      handle.style.cursor = 'grab';
    }
    
    // 存储事件监听器以便清理
    el._onMouseDown = onMouseDown;
    el._onMouseMove = onMouseMove;
    el._onMouseUp = onMouseUp;
    
    // 添加重置方法
    el._resetDragPosition = () => {
      const dragData = el._draggable;
      dragData.currentX = 0;
      dragData.currentY = 0;
      el.style.transform = '';
    };
  },

  updated(el, binding) {
    // 检查是否需要重置拖拽位置
    const isHidden = el.style.top === '-2000px' || 
                    el.style.left === '-1000px' || 
                    el.classList.contains('hidden');
    
    if (isHidden && el._resetDragPosition) {
      el._resetDragPosition();
    }
  },

  unmounted(el) {
    // 清理事件监听器
    if (el._onMouseDown) {
      const handle = el.querySelector('.custom-handle-image');
      if (handle) {
        handle.removeEventListener('mousedown', el._onMouseDown);
      }
    }
    
    document.removeEventListener('mousemove', el._onMouseMove);
    document.removeEventListener('mouseup', el._onMouseUp);
    
    // 清理数据
    delete el._draggable;
    delete el._onMouseDown;
    delete el._onMouseMove;
    delete el._onMouseUp;
    delete el._resetDragPosition;
  }
}