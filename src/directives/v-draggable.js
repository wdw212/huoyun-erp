// src/directives/v-draggable.js
export default {
  beforeMount(el) {
    el.style.position = 'absolute';

    const handleMouseDown = (e) => {
      const startX = e.clientX;
      const startY = e.clientY;
      const startLeft = parseInt(el.style.left || 0);
      const startTop = parseInt(el.style.top || 0);

      const handleMouseMove = (moveEvent) => {
        const currentX = moveEvent.clientX;
        const currentY = moveEvent.clientY;

        const deltaX = currentX - startX;
        const deltaY = currentY - startY;

        el.style.left = `${startLeft + deltaX}px`;
        el.style.top = `${startTop + deltaY}px`;
      };

      const handleMouseUp = () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    };

    el.addEventListener('mousedown', handleMouseDown);
  },
  unmounted(el) {
    el.removeEventListener('mousedown', handleMouseDown);
  }
};
