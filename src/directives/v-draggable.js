export default {
  beforeMount(el, binding) {
    // 设置元素为绝对定位
    el.style.position = 'absolute';
    
    // 获取拖拽手柄选择器，默认为 .drag-handle
    const handleSelector = binding.value?.handle || '.drag-handle';
    
    // 查找拖拽手柄
    const dragHandle = el.querySelector(handleSelector);
    
    // 如果没有找到拖拽手柄，则整个元素可拖拽
    const dragElement = dragHandle || el;
    
    // 存储拖拽状态
    let isDragging = false;
    let isEnabled = binding.value?.enabled !== false; // 默认启用
    
    const handleMouseDown = (e) => {
      // 检查是否在表单元素上，如果是则忽略
      if (e.target.tagName === 'SELECT' || 
          e.target.tagName === 'INPUT' || 
          e.target.tagName === 'TEXTAREA') {
        return;
      }
      
      // 检查是否启用了拖拽
      if (!isEnabled) return;
      
      isDragging = true;
      const startX = e.clientX;
      const startY = e.clientY;
      const startLeft = parseInt(el.style.left || 0);
      const startTop = parseInt(el.style.top || 0);
      
      const handleMouseMove = (moveEvent) => {
        if (!isDragging) return;
        
        const currentX = moveEvent.clientX;
        const currentY = moveEvent.clientY;
        
        const deltaX = currentX - startX;
        const deltaY = currentY - startY;
        
        el.style.left = `${startLeft + deltaX}px`;
        el.style.top = `${startTop + deltaY}px`;
      };
      
      const handleMouseUp = () => {
        isDragging = false;
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
      
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    };
    
    // 存储处理函数以便卸载时移除
    el._dragHandler = handleMouseDown;
    
    // 存储启用/禁用函数以便外部调用
    el._enableDrag = () => { isEnabled = true; };
    el._disableDrag = () => { isEnabled = false; };
    
    dragElement.addEventListener('mousedown', handleMouseDown);
    
    // 防止拖拽时选择文本
    dragElement.style.userSelect = 'none';
  },
  
  updated(el, binding) {
    // 处理启用/禁用状态的更新
    if (binding.value?.enabled !== undefined) {
      if (binding.value.enabled) {
        el._enableDrag?.();
      } else {
        el._disableDrag?.();
      }
    }
  },
  
  unmounted(el) {
    if (el._dragHandler) {
      const handleSelector = binding?.value?.handle || '.drag-handle';
      const dragHandle = el.querySelector(handleSelector);
      const dragElement = dragHandle || el;
      dragElement.removeEventListener('mousedown', el._dragHandler);
    }
  }
};