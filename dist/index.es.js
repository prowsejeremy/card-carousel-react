import React, { useState, useRef, useEffect } from 'react';

function styleInject(css, ref) {
  if ( ref === void 0 ) ref = {};
  var insertAt = ref.insertAt;

  if (!css || typeof document === 'undefined') { return; }

  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';

  if (insertAt === 'top') {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

var css_248z = ".cardCarousel {\n  padding: 0 2rem;\n  position: relative;\n}\n\n.cardCarouselInner {\n  position: relative;\n}\n\n.carouselItems {\n  transition: all 400ms ease-out;\n  position: relative;\n}\n\n.carouselItemContent {\n  width: auto;\n  display: inline-block;\n  vertical-align: middle;\n  overflow: hidden;\n  max-width: 100vw;\n}\n\n.carousel-arrow {\n  position: absolute;\n  top: calc(50% - 3rem);\n\n  width: 6rem;\n  height: 6rem;\n  z-index: 10;\n\n  opacity: 1;\n  visibility: visible;\n\n  transition: all 400ms ease-out;\n}\n\n.carousel-arrow.disabled {\n  opacity: 0;\n  visibility: hidden;\n}\n\n.prev-button {\n  left: 2rem;\n}\n\n.next-button {\n  right: 2rem;\n}\n\n@media screen and (min-width: 768px) {\n  .cardCarousel {\n    padding: 0 10rem;\n  }\n\n  .prev-button {\n    left: 5rem;\n  }\n  \n  .next-button {\n    right: 5rem;\n  }\n}";
styleInject(css_248z);

const CardCarousel = props => {
  const {
    children,
    settings
  } = props;
  const defaultSettings = {
    buffer: 50,
    // Buffer for whether to switch to next slide if it sits right on the border of the viewbox
    nextArrow: false,
    prevArrow: false
  };
  const config = {
    ...defaultSettings,
    ...settings
  };
  const [itemsWrapperWidth, setItemsWrapperWidth] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [transitionIndex, setTransitionIndex] = useState(0);
  const [itemCount, setItemCount] = useState(0);
  let touchStartVal = 0;
  let touchChangeThreshold = 100;
  const carouselItemsRef = useRef();
  const carouselWrapperRef = useRef();
  useEffect(() => {
    setItemCount(children.length - 1);
  }, [children.length]);
  useEffect(() => {
    getItemsWrapperWidth();
  }, [carouselItemsRef.current]);
  useEffect(() => {
    window.addEventListener('resize', getItemsWrapperWidth);
    return () => {
      window.removeEventListener('resize', getItemsWrapperWidth);
    };
  }, [typeof window !== undefined]);
  useEffect(() => {
    handleMove(transitionIndex);
  }, [transitionIndex]);
  const getItemsWrapperWidth = () => {
    const carouselChildren = carouselItemsRef.current.children;
    if (carouselChildren) {
      let carouselWidth = 0;
      [...carouselChildren].map(child => {
        return carouselWidth += child.offsetWidth;
      });
      setItemsWrapperWidth(`${carouselWidth}px`);
    }
  };
  const itemInView = (currentItemBox, viewBox) => {
    return currentItemBox.left > viewBox.left - config.buffer && currentItemBox.right < viewBox.right + config.buffer;
  };
  const getMoveVal = (item, viewBox, dir = 'next') => {
    if (dir == 'next') {
      return (item.offsetLeft - viewBox.width + item.offsetWidth) * -1;
    } else {
      return item.offsetLeft * -1;
    }
  };
  const handleMove = index => {
    if (currentIndex == index) return;
    const dir = index > currentIndex ? 'next' : 'prev';
    const currentItem = carouselItemsRef.current.children[index];
    if (!currentItem) return;
    const currentItemBox = currentItem.getBoundingClientRect();
    const carouselWrapperBox = carouselWrapperRef.current.getBoundingClientRect();
    if (itemInView(currentItemBox, carouselWrapperBox)) {
      if (dir == 'next') {
        return setTransitionIndex(transitionIndex + 1);
      } else {
        return setTransitionIndex(transitionIndex - 1);
      }
    } else {
      const moveVal = getMoveVal(currentItem, carouselWrapperBox, dir);
      carouselItemsRef.current.style.transform = `translateX(${moveVal}px)`;
    }
    setCurrentIndex(transitionIndex);
  };
  const handleTouchStart = e => {
    touchStartVal = e.changedTouches[0].clientX;
  };
  const handleTouchEnd = e => {
    let touchEndVal = e.changedTouches[0].clientX;
    let touchDelta = touchEndVal - touchStartVal;
    if (touchDelta > touchChangeThreshold) {
      return handleMoveInteract('prev');
    } else if (touchDelta * -1 > touchChangeThreshold) {
      return handleMoveInteract('next');
    }
  };
  const handleMoveInteract = dir => {
    let changedIndex = 0;
    if (dir == 'next') {
      changedIndex = currentIndex + 1 < itemCount ? currentIndex + 1 : itemCount;
    } else {
      changedIndex = currentIndex - 1 > 0 ? currentIndex - 1 : 0;
    }
    return setTransitionIndex(changedIndex);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: `cardCarousel ${itemsWrapperWidth ? 'show' : ''}`,
    onTouchStart: handleTouchStart,
    onTouchEnd: handleTouchEnd
  }, /*#__PURE__*/React.createElement("div", {
    className: "cardCarouselInner",
    ref: carouselWrapperRef
  }, /*#__PURE__*/React.createElement("div", {
    ref: carouselItemsRef,
    className: "carouselItems",
    style: {
      "width": itemsWrapperWidth ? itemsWrapperWidth : '99999px'
    }
  }, children?.map((child, key) => {
    return /*#__PURE__*/React.createElement("div", {
      className: "carouselItemContent",
      key: key,
      "data-active": key === currentIndex
    }, child);
  }))), /*#__PURE__*/React.createElement("button", {
    className: `carousel-arrow prev-button ${currentIndex == 0 ? 'disabled' : 'active'}`,
    onClick: () => {
      handleMoveInteract('prev');
    }
  }, config?.nextArrow || 'PREV'), /*#__PURE__*/React.createElement("button", {
    className: `carousel-arrow next-button ${currentIndex == itemCount ? 'disabled' : 'active'}`,
    onClick: () => {
      handleMoveInteract('next');
    }
  }, config?.prevArrow || 'NEXT'));
};

export { CardCarousel as default };
