// v-draggable.js - 使用拖拽手柄版本
export default {
  mounted(el, binding, vnode) {
    const options = binding.value || {};
    
    // 创建拖拽手柄
    let handle;
    if (options.handle) {
      handle = el.querySelector(options.handle);
    } else {
      // 如果没有指定手柄，创建一个默认的
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
    
    // 存储拖拽相关数据
    el._draggable = {
      isDragging: false,
      startX: 0,
      startY: 0,
      initialX: 0,
      initialY: 0
    };

    const onMouseDown = (e) => {
      // 如果不是左键点击，不处理
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
      
      // 添加拖拽样式
      handle.style.cursor = 'grabbing';
      el.style.userSelect = 'none';
      el.style.zIndex = '2171';
    };

    const onMouseMove = (e) => {
      const dragData = el._draggable;
      if (!dragData.isDragging) return;
      
      const deltaX = e.clientX - dragData.startX;
      const deltaY = e.clientY - dragData.startY;
      
      // 更新元素位置
      el.style.position = 'fixed';
      el.style.left = (dragData.initialX + deltaX) + 'px';
      el.style.top = (dragData.initialY + deltaY) + 'px';
    };

    const onMouseUp = (e) => {
      const dragData = el._draggable;
      dragData.isDragging = false;
      
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      
      // 恢复样式
      handle.style.cursor = 'grab';
      el.style.userSelect = '';
    };

    // 绑定事件到手柄
    handle.addEventListener('mousedown', onMouseDown);
    
    // 存储事件处理函数以便清理
    el._onMouseDown = onMouseDown;
    el._onMouseMove = onMouseMove;
    el._onMouseUp = onMouseUp;

    // 设置初始光标样式
    handle.style.cursor = 'grab';
  },

  unmounted(el, binding, vnode) {
    // 清理事件监听器
    if (el._onMouseDown) {
      const handle = el._dragHandle || el.querySelector('.drag-handle');
      if (handle) {
        handle.removeEventListener('mousedown', el._onMouseDown);
      }
    }
    
    // 清理文档级别的事件监听器
    document.removeEventListener('mousemove', el._onMouseMove);
    document.removeEventListener('mouseup', el._onMouseUp);
    
    // 移除创建的手柄
    if (el._createdHandle) {
      el.removeChild(el._createdHandle);
    }
    
    // 清理存储的数据
    delete el._draggable;
    delete el._dragHandle;
    delete el._onMouseDown;
    delete el._onMouseMove;
    delete el._onMouseUp;
    delete el._createdHandle;
  }
}