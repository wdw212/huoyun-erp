// v-draggable.js - 修复版本
export default {
  mounted(el, binding, vnode) {
    const options = binding.value || {};
    
    // 创建拖拽手柄
    let handle;
    if (options.handle) {
      handle = el.querySelector(options.handle);
    } else {
      handle = document.createElement('div');
      handle.className = 'drag-handle';
      handle.style.cssText = `
        height: 20px;
        background: #f0f0f0;
        cursor: grab;
        border-bottom: 1px solid #ddd;
        display: flex;
        align-items: center;
        justify-content: center;
        user-select: none;
      `;
      handle.innerHTML = '<span style="color: #666;">≡ 拖拽</span>';
      el.insertBefore(handle, el.firstChild);
      el._createdHandle = handle;
    }
    
    // 存储拖拽相关数据和位置
    el._draggable = {
      isDragging: false,
      startX: 0,
      startY: 0,
      initialX: 0,
      initialY: 0,
      currentX: 0,
      currentY: 0,
      hasMoved: false // 标记是否已经移动过
    };

    const onMouseDown = (e) => {
      if (e.button !== 0) return;
      
      const dragData = el._draggable;
      dragData.isDragging = true;
      dragData.startX = e.clientX;
      dragData.startY = e.clientY;
      
      // 获取元素当前位置
      const rect = el.getBoundingClientRect();
      dragData.initialX = rect.left;
      dragData.initialY = rect.top;
      
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
      
      handle.style.cursor = 'grabbing';
      el.style.userSelect = 'none';
      el.style.zIndex = '2171';
    };

    const onMouseMove = (e) => {
      const dragData = el._draggable;
      if (!dragData.isDragging) return;
      
      const deltaX = e.clientX - dragData.startX;
      const deltaY = e.clientY - dragData.startY;
      
      // 更新元素位置并保存当前位置
      dragData.currentX = dragData.initialX + deltaX;
      dragData.currentY = dragData.initialY + deltaY;
      dragData.hasMoved = true;
      
      el.style.position = 'fixed';
      el.style.left = dragData.currentX + 'px';
      el.style.top = dragData.currentY + 'px';
    };

    const onMouseUp = (e) => {
      const dragData = el._draggable;
      dragData.isDragging = false;
      
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      
      handle.style.cursor = 'grab';
      el.style.userSelect = '';
    };

    handle.addEventListener('mousedown', onMouseDown);
    
    // 存储事件处理函数以便清理
    el._onMouseDown = onMouseDown;
    el._onMouseMove = onMouseMove;
    el._onMouseUp = onMouseUp;

    handle.style.cursor = 'grab';
  },

  updated(el, binding, vnode) {
    // 在组件更新后恢复位置
    const dragData = el._draggable;
    if (dragData && dragData.hasMoved && !dragData.isDragging) {
      // 确保元素保持固定定位和最后的位置
      el.style.position = 'fixed';
      el.style.left = dragData.currentX + 'px';
      el.style.top = dragData.currentY + 'px';
    }
  },

  unmounted(el, binding, vnode) {
    if (el._onMouseDown) {
      const handle = el._dragHandle || el.querySelector('.drag-handle');
      if (handle) {
        handle.removeEventListener('mousedown', el._onMouseDown);
      }
    }
    
    document.removeEventListener('mousemove', el._onMouseMove);
    document.removeEventListener('mouseup', el._onMouseUp);
    
    if (el._createdHandle) {
      el.removeChild(el._createdHandle);
    }
    
    delete el._draggable;
    delete el._dragHandle;
    delete el._onMouseDown;
    delete el._onMouseMove;
    delete el._onMouseUp;
    delete el._createdHandle;
  }
}