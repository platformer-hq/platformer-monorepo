import './ios-page-transition.scss';

export function getIosPageTransitionOptions(): Required<Pick<
  UsePageTransitionOptions,
  'afterEnter' | 'animate' | 'beforeAnimate'
>> {
  const { b } = bem('ios-page-transition');
  return {
    beforeAnimate({ el, page, transition }) {
      el.classList.add(...b(page, transition).split(' '));
    },
    animate({ transition, page, el, done }) {
      const leftTransform = ['translateX(-100px)', 'translateX(0)'];
      const rightTransform = ['translateX(100%)', 'translateX(0)'];
      if (transition === 'leave') {
        [leftTransform, rightTransform].forEach(arr => arr.reverse());
      }
      el
        .animate({ transform: page === 'right' ? rightTransform : leftTransform }, {
          duration: 300,
          easing: 'ease-in-out',
        })
        .finished
        .then(() => {
          done();
        });
    },
    afterEnter({ el, page }) {
      el.classList.remove(...b(page, 'enter').split(' '));
    },
  };
}
