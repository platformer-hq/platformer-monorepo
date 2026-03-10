import './android-page-transition.scss';

export function getAndroidPageTransitionOptions(): Required<Pick<
  UsePageTransitionOptions,
  'afterEnter' | 'animate' | 'beforeAnimate'
>> {
  const { b } = bem('android-page-transition');
  return {
    beforeAnimate({ el, page, transition }) {
      el.classList.add(...b(page, transition).split(' '));
    },
    animate({ transition, page, el, done }) {
      if (page === 'left') {
        return setTimeout(done, 300);
      }
      const transform = ['translateX(100%)', 'translateX(0)'];
      el
        .animate({ transform: transition === 'leave' ? transform.reverse() : transform }, {
          duration: 300,
          easing: 'ease-out',
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
